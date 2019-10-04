export default (errors, handlers) => {
    if (!errors.graphQLErrors) {
        return;
    }

    Object.entries(handlers).forEach(([errorName, handler]) => {
        if (errors.graphQLErrors.some((error) => error.name === errorName)) {
            handler();
        }
    });
};
