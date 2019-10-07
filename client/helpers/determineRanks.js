export default (participants) => {
    const sortedParticipants = [...participants].sort((a, b) => {
        for (let i = 0; i < a.scores.length; i += 1) {
            if (a.scores[i] !== b.scores[i]) {
                return b.scores[i] - a.scores[i];
            }
        }

        return a.player.name.localeCompare(b.player.name);
    });

    let lastRank;

    return sortedParticipants.map((participant, index) => {
        lastRank = (
            !sortedParticipants[index - 1]
            || !sortedParticipants[index - 1].scores.every((value, valueIndex) => (
                participant.scores[valueIndex] >= value
            ))
        ) ? index + 1 : lastRank;

        return {
            ...participant,
            rank: lastRank,
        };
    });
};
