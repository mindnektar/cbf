module.exports = {
    serialize: (data, mapping) => [
        [
            mapping.public.game.reduce((total, current) => [
                ...total,
                data.public.game[current],
            ], []),
            data.public.players.map((player, playerIndex) => (
                mapping.public.players.reduce((total, current) => [
                    ...total,
                    data.public.players[playerIndex][current],
                ], [])
            )),
        ],
        [
            mapping.private.game.reduce((total, current) => [
                ...total,
                data.private.game[current],
            ], []),
            data.private.players.map((player, playerIndex) => (
                mapping.private.players.reduce((total, current) => [
                    ...total,
                    data.private.players[playerIndex][current],
                ], [])
            )),
        ],
        data.state,
        data.action,
        data.currentPlayer,
    ],
    unserialize: (data, mapping) => ({
        public: {
            game: mapping.public.game.reduce((total, current, index) => ({
                ...total,
                [current]: data[0][0][index],
            }), {}),
            players: data[0][1].map((player, playerIndex) => (
                mapping.public.players.reduce((total, current, index) => ({
                    ...total,
                    [current]: data[0][1][playerIndex][index],
                }), {})
            )),
        },
        private: {
            game: mapping.private.game.reduce((total, current, index) => ({
                ...total,
                [current]: data[1][0][index],
            }), {}),
            players: data[1][1].map((player, playerIndex) => (
                mapping.private.players.reduce((total, current, index) => ({
                    ...total,
                    [current]: data[1][1][playerIndex][index],
                }), {})
            )),
        },
        state: data[2],
        action: data[3],
        currentPlayer: data[4],
    }),
};
