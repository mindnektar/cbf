export default async ({ match, action, payload, player, pushActions, performAction }) => {
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

    const nextState = action.prepareAndPerform(
        match,
        { payload, player },
        match.states[match.stateIndex]
    );

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
