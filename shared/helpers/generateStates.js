import azul from '../games/azul';
import fiveTribes from '../games/five-tribes';

const gameMap = {
    azul,
    'five-tribes': fiveTribes,
};

export default (match, states = []) => (
    match.actions.reduce((result, action, index) => {
        if (gameMap[match.handle].actions[action.type].isEndGameAction) {
            return result;
        }

        const previousState = result[(states.length + index) - 1];

        return [
            ...result,
            gameMap[match.handle].actions[action.type].prepareAndPerform(
                match, action, previousState
            ),
        ];
    }, states)
);
