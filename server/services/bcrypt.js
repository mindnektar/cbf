import bcrypt from 'bcryptjs';
import config from '../../shared/config';

export default {
    hash: async (input) => (
        new Promise((resolve, reject) => (
            bcrypt.genSalt(config.bcrypt.saltRounds, (err, salt) => {
                if (err) {
                    return reject(err);
                }
                return bcrypt.hash(input, salt, (err2, hash) => {
                    if (err2) {
                        return reject(err2);
                    }
                    return resolve(hash);
                });
            })
        ))
    ),
    compare: async (input, hash) => (
        new Promise((resolve, reject) => (
            bcrypt.compare(input, hash, (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res);
            })
        ))
    ),
};
