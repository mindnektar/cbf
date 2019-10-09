const {
    shield, rule, not,
} = require('graphql-shield');

const { AuthorizationRequiredError } = require('../../errors');

const everyone = rule({ cache: 'contextual' })(() => (
    true
));
const isAuthenticated = rule({ cache: 'contextual' })((parent, variables, context) => (
    context.auth.role !== 'anonymous'
));
const isAdmin = rule({ cache: 'contextual' })((parent, variables, context) => (
    context.auth.role === 'admin'
));
const isUser = rule({ cache: 'contextual' })((parent, variables, context) => (
    context.auth.role === 'user'
));

module.exports = shield({
    Query: {
        announcements: everyone,
        match: everyone,
        matches: everyone,
        users: isAuthenticated,
        me: isAuthenticated,
    },
    Mutation: {
        createAnnouncement: isAdmin,
        updateAnnouncement: isAdmin,
        deleteAnnouncement: isAdmin,
        createMatch: isAuthenticated,
        openMatch: isAuthenticated,
        joinMatch: isAuthenticated,
        confirmInvitation: isAuthenticated,
        declineInvitation: isAuthenticated,
        removePlayerFromMatch: isAuthenticated,
        startMatch: isAuthenticated,
        pushActions: isAuthenticated,
        createMessage: isAuthenticated,
        markMessagesRead: isAuthenticated,
        createUser: isAdmin,
        confirmUser: not(isAuthenticated),
        login: not(isAuthenticated),
        renewToken: not(isAuthenticated),
    },
    Subscription: {
        matchOpened: isAuthenticated,
        playerJoined: isAuthenticated,
        invitationConfirmed: isAuthenticated,
        invitationDeclined: isAuthenticated,
        removedPlayerFromMatch: isAuthenticated,
        matchStarted: isAuthenticated,
        actionsPushed: isAuthenticated,
        messageCreated: isAuthenticated,
    },
}, {
    allowExternalErrors: true,
    fallback: new AuthorizationRequiredError(),
});
