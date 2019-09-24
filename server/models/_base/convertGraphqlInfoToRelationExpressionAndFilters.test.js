const gql = require('graphql-tag');
const moment = require('moment');
const convertGraphqlInfoToRelationExpressionAndFilters = require('./convertGraphqlInfoToRelationExpressionAndFilters');
const Kid = require('../Kid');

const convertQueryToResolveInfo = (query) => {
    const operation = query.definitions
        .find(({ kind }) => kind === 'OperationDefinition');
    const fragments = query.definitions
        .filter(({ kind }) => kind === 'FragmentDefinition')
        .reduce((result, current) => ({
            ...result,
            [current.name.value]: current,
        }), {});

    return {
        fieldNodes: operation.selectionSet.selections,
        fragments,
    };
};

describe(convertGraphqlInfoToRelationExpressionAndFilters, () => {
    it('should return an empty relation expression if the query is not nested', () => {
        const query = gql`
            query {
                kid {
                    id
                }
            }
        `;

        const { relationExpression, filters } = convertGraphqlInfoToRelationExpressionAndFilters(
            convertQueryToResolveInfo(query),
            Kid,
        );

        expect(relationExpression).toEqual({});
        expect(filters).toEqual({});
    });

    it('should return the correct relation expression if the query has one level of nesting', () => {
        const query = gql`
            query {
                kid {
                    person {
                        id
                    }
                }
            }
        `;

        const { relationExpression, filters } = convertGraphqlInfoToRelationExpressionAndFilters(
            convertQueryToResolveInfo(query),
            Kid,
        );

        expect(relationExpression).toEqual({ person: {} });
        expect(filters).toEqual({});
    });

    it('should return the correct relation expression if the query has multiple levels of nesting', () => {
        const query = gql`
            query {
                kid {
                    group {
                        id
                        teachers {
                            id
                        }
                    }
                    person {
                        id
                    }
                }
            }
        `;

        const { relationExpression, filters } = convertGraphqlInfoToRelationExpressionAndFilters(
            convertQueryToResolveInfo(query),
            Kid,
        );

        expect(relationExpression).toEqual({ group: { teachers: {} }, person: {} });
        expect(filters).toEqual({});
    });

    it('should return the correct relation expression if the query contains a nested fragment', () => {
        const query = gql`
            fragment KidParts on Kid {
                person {
                    id
                }
            }

            query {
                kid {
                    ...KidParts
                }
            }
        `;

        const { relationExpression, filters } = convertGraphqlInfoToRelationExpressionAndFilters(
            convertQueryToResolveInfo(query),
            Kid,
        );

        expect(relationExpression).toEqual({ person: {} });
        expect(filters).toEqual({});
    });

    it('should return the correct relation expression if the query contains an inline fragment', () => {
        const query = gql`
            query {
                kid {
                    ...on Kid {
                        person {
                            id
                        }
                    }
                }
            }
        `;

        const { relationExpression, filters } = convertGraphqlInfoToRelationExpressionAndFilters(
            convertQueryToResolveInfo(query),
            Kid,
        );

        expect(relationExpression).toEqual({ person: {} });
        expect(filters).toEqual({});
    });

    it('should skip those parts of the query that have no representation in the model\'s relation mappings', () => {
        const query = gql`
            query {
                kid {
                    person {
                        thisDoesNotExist {
                            neitherDoesThis {
                                orThis
                            }
                        }
                    }
                }
            }
        `;

        const { relationExpression, filters } = convertGraphqlInfoToRelationExpressionAndFilters(
            convertQueryToResolveInfo(query),
            Kid,
        );

        expect(relationExpression).toEqual({ person: {} });
        expect(filters).toEqual({});
    });

    it('should return the correct relation expression and filters if the query contains filters', () => {
        const today = moment().toISOString();
        const query = gql`
            query {
                kid {
                    stays(filter: { from: "${today}" }) {
                        id
                    }
                }
            }
        `;

        const { relationExpression, filters } = convertGraphqlInfoToRelationExpressionAndFilters(
            convertQueryToResolveInfo(query),
            Kid,
        );

        expect(relationExpression).toEqual({ stays: { $modify: ['stays.from'] } });
        expect(filters).toEqual({ 'stays.from': expect.any(Function) });
    });

    it('should return the correct relation expression and filters if the query contains aliases', () => {
        const today = moment().toISOString();
        const tomorrow = moment().add(1, 'day').toISOString();
        const query = gql`
            query {
                kid {
                    todaysStays: stays(filter: { from: "${today}" }) {
                        id
                    }
                    tomorrowsStays: stays(filter: { from: "${tomorrow}" }) {
                        id
                    }
                }
            }
        `;

        const { relationExpression, filters } = convertGraphqlInfoToRelationExpressionAndFilters(
            convertQueryToResolveInfo(query),
            Kid,
        );

        expect(relationExpression).toEqual({
            todaysStays: { $modify: ['todaysStays.from'], $relation: 'stays' },
            tomorrowsStays: { $modify: ['tomorrowsStays.from'], $relation: 'stays' },
        });
        expect(filters).toEqual({
            'todaysStays.from': expect.any(Function),
            'tomorrowsStays.from': expect.any(Function),
        });
    });

    it('should throw an error if a non-existant filter is accessed', () => {
        const query = gql`
            query {
                kid {
                    stays(filter: { thisDoesNotExist: "test" }) {
                        id
                    }
                }
            }
        `;

        expect(() => {
            convertGraphqlInfoToRelationExpressionAndFilters(
                convertQueryToResolveInfo(query),
                Kid,
            );
        }).toThrow();
    });
});
