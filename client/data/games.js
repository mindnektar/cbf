import azul from 'shared/games/azul';
import Azul from 'components/App/games/Azul';

export default {
    azul: {
        handle: 'azul',
        title: 'Azul',
        author: 'Michael Kiesling',
        playerCount: [2, 3, 4],
        playTime: '30-45',
        actions: azul.actions,
        states: azul.states,
        component: Azul,
        options: [{
            label: 'Game type',
            key: 'game-type',
            values: [{
                label: 'Standard',
                image: '/img/games/azul/board.png',
                value: 0,
            }, {
                label: 'Variant',
                image: '/img/games/azul/board-variant.png',
                value: 1,
            }],
        }],
    },
    // 'five-tribes': {
    //     handle: 'five-tribes',
    //     title: 'Five Tribes',
    //     author: 'Bruno Cathala',
    //     playerCount: [2, 3, 4],
    //     playTime: '40-80',
    // },
};
