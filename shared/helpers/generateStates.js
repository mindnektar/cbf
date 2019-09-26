import azul from '../games/azul';
import fiveTribes from '../games/five-tribes';

const gameMap = {
    azul,
    'five-tribes': fiveTribes,
};

export default (match) => (
    match.actions.reduce((result, { type, payload }, index) => {
        const action = gameMap[match.handle].actions.findById(type);

        if (action.isEndGameAction) {
            return result;
        }

        return [
            ...result,
            {
                ...action.perform({
                    state: index > 0 ? result[index - 1] : null,
                    payload,
                    player: action.player,
                    allPlayers: match.players,
                    randomSeed: match.randomSeed,
                }),
            },
        ];
    }, [])
);
