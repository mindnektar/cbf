export default (me) => (
    me ? (
        me.matches
            .filter((match) => {
                const participant = match.participants.find(({ player }) => (
                    player.id === me.id
                ));

                return (
                    match.status !== 'FINISHED'
                    && participant
                    && participant.confirmed
                    && participant.awaitsAction
                );
            })
            .length
    ) : (
        0
    )
);
