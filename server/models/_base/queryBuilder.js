import { Model, QueryBuilder } from 'objection';

const isObjectWithoutId = (value) => (
    value
    && typeof value === 'object'
    && !Array.isArray(value)
    && !value.id
);

const convertNodesWithoutIdToRelationExpression = (graph) => (
    Object.entries(graph).reduce((result, [key, value]) => {
        if (isObjectWithoutId(value)) {
            const subs = convertNodesWithoutIdToRelationExpression(value);

            return [
                ...result,
                subs.length > 0 ? `${key}.[${subs}]` : key,
            ];
        }

        return result;
    }, [])
);

const populateGraphWithIds = (graph, instance) => (
    Object.entries(graph).reduce((result, [key, value]) => {
        if (isObjectWithoutId(value)
            && instance[key]
            && instance.constructor.getRelations()[key] instanceof Model.BelongsToOneRelation
        ) {
            return {
                ...result,
                [key]: {
                    id: instance[key].id,
                    ...populateGraphWithIds(value, instance[key]),
                },
            };
        }

        return { ...result, [key]: value };
    }, {})
);

module.exports = class CustomQueryBuilder extends QueryBuilder {
    // `upsertGraph` is unable to update BelongsToOneRelations if no id is passed but a
    // representation in the database exists. This helper traverses the passed graph and adds id
    // keys to all nodes *without* ids but *with* a row in the database. If there is no row, no id
    // will be added and an insert will be performed as usual.
    // see https://github.com/Vincit/objection.js/issues/1112
    async transformGraphForBelongsToOneRelations(graph) {
        const relations = convertNodesWithoutIdToRelationExpression(graph);

        if (relations.length > 0) {
            const instance = await this.modelClass().query().findById(graph.id);
            await instance.$loadRelated(`[${relations}]`);
            return populateGraphWithIds(graph, instance);
        }

        return graph;
    }

    // @overrides super.upsertGraph
    async upsertGraph(graph, options) {
        return super.upsertGraph(
            await this.transformGraphForBelongsToOneRelations(graph),
            options,
        );
    }

    // @overrides super.upsertGraphAndFetch
    async upsertGraphAndFetch(graph, options) {
        return super.upsertGraphAndFetch(
            await this.transformGraphForBelongsToOneRelations(graph),
            options,
        );
    }

    filter(filter = {}, auth = {}) {
        const { filters } = this.modelClass();

        Object.entries(filter).forEach(([key, value]) => {
            filters[key](this, value, auth);
        });

        return this;
    }

    graphqlEager(info, additionalExpression) {
        const { relationExpression, filters } = this.modelClass().infoToEager(
            info,
            additionalExpression,
        );

        return this.eager(relationExpression, filters);
    }

    matchesAnyRows() {
        return this.count()
            .then((counted) => {
                const row = Array.isArray(counted) ? counted[0] : counted;
                return row.count > 0;
            });
    }

    paginate({ column = 'id', direction = 'asc', after }) {
        const builder = this
            .orderBy(`${this.modelClass().tableName}.${column}`, direction)
            .limit(10);

        if (after) {
            builder.where(
                `${this.modelClass().tableName}.${column}`,
                direction === 'asc' ? '>' : '<',
                after,
            );
        }

        return builder;
    }
};
