module.exports = {
    id: 0,
    instruction: (state) => {
        const { centerTiles } = state.public.game;
        const center = centerTiles.length >= 2 || ![5, undefined].includes(centerTiles[0])
            ? ' or the center of the table'
            : '';

        return `Select tiles from a factory display${center}.`;
    },
};
