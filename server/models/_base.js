import uuid from 'uuid/v4';
import moment from 'moment';
import knex from 'knex';
import { Model, snakeCaseMappers } from 'objection';
import config from '../../shared/config';
import CustomQueryBuilder from './_base/queryBuilder';
import convertGraphqlInfoToRelationExpressionAndFilters from './_base/convertGraphqlInfoToRelationExpressionAndFilters';

Model.knex(knex(config.knex));

module.exports = class BaseModel extends Model {
    static get columnNameMappers() {
        return snakeCaseMappers();
    }

    static get modelPaths() {
        return [__dirname];
    }

    static get QueryBuilder() {
        return CustomQueryBuilder;
    }

    async $beforeInsert(context) {
        await super.$beforeInsert(context);
        const { jsonSchema } = this.constructor;
        if (jsonSchema && jsonSchema.properties.id) {
            this.id = this.id || uuid();
        }
    }

    async $beforeUpdate(context) {
        await super.$beforeUpdate(context);

        if (this.constructor.jsonSchema.properties.updatedAt) {
            this.updatedAt = moment().toISOString();
        }
    }

    static infoToEager(info, additionalExpression) {
        return convertGraphqlInfoToRelationExpressionAndFilters(
            info,
            this,
            additionalExpression,
        );
    }

    $graphqlLoadRelated(...args) {
        const trx = typeof args[0] === 'function' ? args.shift() : undefined;
        const [info, additionalExpression] = args;
        const { relationExpression, filters } = this.constructor.infoToEager(
            info,
            additionalExpression,
        );

        return this.$loadRelated(relationExpression, filters, trx);
    }

    async $duplicate(trx, changes = {}) {
        const clone = this.$clone({ shallow: true });

        if (this.id) {
            clone.id = uuid();
        }

        if (this.createdAt) {
            clone.createdAt = moment().toISOString();
        }

        if (this.updatedAt) {
            clone.updatedAt = moment().toISOString();
        }

        clone.$set(changes);
        await clone.$query(trx).insert();

        return clone;
    }
};
