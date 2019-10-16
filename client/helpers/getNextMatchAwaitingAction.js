import moment from 'moment';

export default (me) => (
    me ? (
        me.matches
            .filter(({ status, participants }) => {
                const participant = participants.find(({ player }) => (
                    player.id === me.id
                ));

                return status === 'ACTIVE' && participant.awaitsAction;
            })
            .sort((a, b) => {
                const aParticipant = a.participants.find(({ player }) => (
                    player.id === me.id
                ));
                const bParticipant = b.participants.find(({ player }) => (
                    player.id === me.id
                ));

                return moment(aParticipant.updatedAt).diff(bParticipant.updatedAt);
            })[0]
    ) : null
);
