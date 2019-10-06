import shuffle from 'knuth-shuffle-seeded';

export default (randomSeed) => ({
    draw: (source, amount) => {
        const rest = shuffle(source, randomSeed);

        return rest.splice(0, amount);
    },
    shuffle: (source) => (
        shuffle(source, randomSeed)
    ),
});
