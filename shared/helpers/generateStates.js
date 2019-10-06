import randomizer from './randomizer';
import azul from '../games/azul';
import fiveTribes from '../games/five-tribes';

const gameMap = {
    azul,
    'five-tribes': fiveTribes,
};

export default (match, states = []) => (
    match.actions.reduce((result, { type, payload, randomSeed, player }, index) => {
        const action = gameMap[match.handle].actions.findById(type);

        if (action.isEndGameAction) {
            return result;
        }

        return [
            ...result,
            action.perform({
                state: result[(states.length + index) - 1] || null,
                payload,
                player,
                allPlayers: match.players,
                randomizer: randomSeed ? randomizer(randomSeed) : null,
            }),
        ];
    }, states)
);
