import gql from 'graphql-tag';
import generateStates from 'shared/helpers/generateStates';

export const typeDefs = gql`
    extend type Match {
        states: JSON!
        stateIndex: Int!
        globalParams: JSON!
    }
`;

export const resolvers = {
    Match: {
        states: (parent, params, { cache }) => {
            const states = generateStates(parent);

            cache.writeData({
                id: parent.id,
                data: {
                    states: JSON.stringify(states),
                    stateIndex: states.length - 1,
                    globalParams: JSON.stringify({}),
                },
            });

            return states;
        },
    },
};
