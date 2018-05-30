import shuffle from 'knuth-shuffle-seeded';

export default randomSeed => ({
    shuffle: array => shuffle(array, randomSeed),
});
