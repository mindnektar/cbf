import { Model, transaction } from 'objection';

module.exports = async (callback) => {
    const trx = await transaction.start(Model.knex());

    try {
        const result = await callback(trx);
        await trx.commit();
        return result;
    } catch (error) {
        await trx.rollback();
        throw error;
    }
};
