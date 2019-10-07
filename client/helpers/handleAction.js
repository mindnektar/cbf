import clone from 'clone';

export default async ({ match, action, player, payload, pushActions, performAction }) => {
    if (action.isServerAction) {
        return pushActions({
            id: match.id,
            actions: [
                ...match.actions.slice(match.stateCountSinceLastLoad).map((newAction) => ({
                    type: newAction.type,
                    payload: newAction.payload,
                })),
                {
                    type: action.id,
                    payload,
                },
            ],
        });
    }

    const nextState = action.perform({
        state: clone(match.states[match.stateIndex]),
        payload,
        player,
        allPlayers: match.players,
    });

    return performAction({
        id: match.id,
        action: {
            __typename: 'Action',
            type: action.id,
            payload,
            player,
            randomSeed: null,
        },
        state: nextState,
    });
};
