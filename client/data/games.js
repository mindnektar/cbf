import azul from 'shared/games/azul';

export default {
    azul: {
        handle: 'azul',
        title: 'Azul',
        author: 'Michael Kiesling',
        playerCount: [2, 3, 4],
        playTime: '30-45',
        actions: azul.actions,
        states: azul.states,
    },
    // 'five-tribes': {
    //     handle: 'five-tribes',
    //     title: 'Five Tribes',
    //     author: 'Bruno Cathala',
    //     playerCount: [2, 3, 4],
    //     playTime: '40-80',
    // },
};
