import clone from 'clone';
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

        const prevState = result[(states.length + index) - 1];

        return [
            ...result,
            action.perform({
                state: prevState ? clone(prevState) : null,
                payload,
                player,
                allPlayers: match.participants.map((participant) => participant.player),
                randomizer: randomSeed ? randomizer(randomSeed) : null,
            }),
        ];
    }, states)
);
