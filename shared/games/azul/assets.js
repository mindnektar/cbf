module.exports = {
    tiles: [
        ...Array(20).fill(0),
        ...Array(20).fill(1),
        ...Array(20).fill(2),
        ...Array(20).fill(3),
        ...Array(20).fill(4),
    ],
    wallLayout: [
        [2, 1, 3, 4, 0],
        [0, 2, 1, 3, 4],
        [4, 0, 2, 1, 3],
        [3, 4, 0, 2, 1],
        [1, 3, 4, 0, 2],
    ],
    floorLineNegatives: [1, 1, 2, 2, 2, 3, 3],
};
