const uuid = require('uuid/v4');
const shuffle = require('knuth-shuffle').knuthShuffle;
const gameConstants = require('../../shared/constants/games');

const calculateAllStates = (initialState, actions, transformers) => {
    let currentState = initialState;

    return [
        currentState,
        ...actions.map((action) => {
            const actionOwner = currentState.currentPlayer;

            currentState = transformers[action[0]](currentState, action[1]);
            currentState.action = [
                ...action,
                actionOwner,
            ];

            return currentState;
        }),
    ];
};

module.exports = (app) => {
    app.get('/api/games', (request, response) => {
        app.knex('game')
            .innerJoin('user_in_game', 'game.id', 'user_in_game.game_id')
            .groupBy('game.id')
            .select('game.*', app.knex.raw('group_concat(user_in_game.user_id) as players'))
            .then((result) => {
                const games = {};

                result.forEach((row) => {
                    games[row.id] = {
                        created_at: row.created_at,
                        handle: row.handle,
                        id: row.id,
                        playerOrder: row.playerOrder,
                        players: row.players.split(','),
                        status: row.status,
                    };
                });

                response.json(games);
            });
    });

    app.post('/api/games', (request, response) => {
        app.knex('user')
            .where('access_token', request.header('X-Access-token'))
            .select()
            .then(([user]) => {
                const id = uuid();
                const game = {
                    id,
                    status: gameConstants.GAME_STATUS_SETTING_UP,
                    handle: request.body.game,
                };

                app.knex('game').insert(game).then(() => {
                    app.knex('user_in_game').insert({
                        user_id: user.id,
                        game_id: id,
                        admin: true,
                    }).then(() => {
                        response.json(game);
                    });
                });
            });
    });

    app.patch('/api/games', (request, response) => {
        app.knex('game').where('id', request.body.id).update(request.body.data).then(() => {
            if (request.body.data.status === gameConstants.GAME_STATUS_ACTIVE) {
                app.knex('game').where('id', request.body.id).select().then(([game]) => {
                    const { setup } = require(`../games/${game.handle}`);
                    const state = JSON.stringify(setup());

                    app.knex('user_in_game').where('game_id', game.id).select().then((players) => {
                        const playerOrder = shuffle(
                            players.map(player => player.user_id)
                        ).join(',');

                        app.knex('game')
                            .where('id', game.id)
                            .update({
                                actions: '[]',
                                initial_state: state,
                                player_order: playerOrder,
                            })
                            .then(() => response.status(204).send());
                    });
                });

                return;
            }

            response.status(204).send();
        });
    });

    app.post('/api/user_in_game', (request, response) => {
        app.knex('user')
            .where('access_token', request.header('X-Access-token'))
            .select()
            .then(([user]) => {
                app.knex('user_in_game').insert({
                    game_id: request.body.id,
                    user_id: user.id,
                }).then(() => response.status(204).send());
            });
    });

    app.get('/api/games/:id', (request, response) => {
        app.knex('game')
            .where('id', request.params.id)
            .select()
            .then(([game]) => {
                const { transformers } = require(`../../shared/games/${game.handle}`);

                response.json({
                    gameStates: calculateAllStates(
                        JSON.parse(game.initial_state),
                        JSON.parse(game.actions),
                        transformers
                    ),
                    playerOrder: game.player_order.split(','),
                });
            });
    });

    app.post('/api/games/:id', (request, response) => {
        app.knex('user')
            .where('access_token', request.header('X-Access-token'))
            .select()
            .then(([user]) => {
                app.knex('game').where('id', request.params.id).select().then(([game]) => {
                    const {
                        transformers, validators,
                    } = require(`../../shared/games/${game.handle}`);

                    const states = calculateAllStates(
                        JSON.parse(game.initial_state),
                        JSON.parse(game.actions),
                        transformers
                    );

                    let currentState = states[states.length - 1];
                    const playerOrder = game.player_order.split(',');
                    const currentPlayer = currentState.currentPlayer;

                    if (playerOrder[currentPlayer] !== user.id) {
                        response.status(403).json({ errors: 'forbidden' });
                    }

                    try {
                        request.body.forEach(([action, payload = []]) => {
                            if (!validators[action](currentState, payload)) {
                                throw new Error(`invalid action: ${action}`);
                            }

                            currentState = transformers[action](
                                currentState, payload
                            );

                            currentState.action = [
                                action,
                                payload,
                                currentPlayer,
                            ];
                        });

                        app.knex('game')
                        .where('id', request.params.id)
                        .update(
                            'actions',
                            JSON.stringify([
                                ...JSON.parse(game.actions),
                                ...request.body,
                            ])
                        )
                        .then(() => response.status(204).send())
                        .catch(error => (
                            response.status(400).json({ errors: error })
                        ));
                    } catch (error) {
                        response.status(400).json({ errors: error });
                    }
                });
            });
    });
};
