export default (scores) => {
    const sortedScores = [...scores].sort((a, b) => {
        for (let i = 0; i < a.values.length; i += 1) {
            if (a.values[i] !== b.values[i]) {
                return b.values[i] - a.values[i];
            }
        }

        return a.player.name.localeCompare(b.player.name);
    });

    let lastRank;

    return sortedScores.map((score, index) => {
        lastRank = (
            !sortedScores[index - 1]
            || !sortedScores[index - 1].values.every((value, valueIndex) => (
                score.values[valueIndex] >= value
            ))
        ) ? index + 1 : lastRank;

        return {
            ...score,
            rank: lastRank,
        };
    });
};
