module.exports = (resolve, parent, variables, context, info) => {
    if (info.fieldNodes[0].alias && typeof parent === 'object') {
        const property = parent[info.fieldNodes[0].alias.value];

        if (typeof property !== 'undefined') {
            return property;
        }
    }

    return resolve(parent, variables, context, info);
};
