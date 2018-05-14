module.exports = {
    id: 9,
    instruction: 'You may take a djinn by paying two elders or one elder and one fakir.',
    performOnConfirm: () => require('../actions').COLLECT_DJINN,
    params: [
        { name: 'selectedDjinn', defaultValue: null },
        { name: 'selectedElders', defaultValue: [] },
        { name: 'selectedFakirs', defaultValue: [] },
    ],
};
