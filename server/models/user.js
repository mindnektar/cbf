import util from 'util';
import jwt from 'jsonwebtoken';
import BaseModel from './_base';
import bcrypt from '../services/bcrypt';
import tokenString from '../services/token-string';
import config from '../../shared/config';

class User extends BaseModel {
    static get tableName() {
        return 'user';
    }

    static get virtualAttributes() {
        return ['active', 'isAdmin'];
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                passwordHash: { type: 'string' },
                renewalToken: { type: 'string' },
                inviteCode: { type: 'string' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
            },
        };
    }

    static get relationMappings() {
        return {
            matches: {
                relation: BaseModel.ManyToManyRelation,
                modelClass: 'Match',
                join: {
                    from: 'user.id',
                    through: {
                        from: 'match_participant.user_id',
                        to: 'match_participant.match_id',
                    },
                    to: 'match.id',
                },
            },
        };
    }

    async updateRenewalToken(trx) {
        const token = tokenString(config.tokens.renewal.length);
        const tokenHash = await bcrypt.hash(token);

        await this.$query(trx).patch({ renewal_token: tokenHash });

        this.$set({ token });

        return this;
    }

    signRenewalToken() {
        return util.promisify(jwt.sign)(
            {
                id: this.id,
                token: this.token,
            },
            config.jwt.secret,
            {
                algorithm: config.tokens.renewal.algorithm,
                expiresIn: config.tokens.renewal.expiresIn,
            },
        );
    }

    static verifyRenewalToken(renewalJwt) {
        return util.promisify(jwt.verify)(
            renewalJwt,
            config.jwt.secret,
            { algorithms: ['HS256', 'HS384', 'HS512'] },
        );
    }

    get active() {
        return !!this.passwordHash;
    }

    get isAdmin() {
        return this.role === 'admin';
    }

    generateAuthToken() {
        return util.promisify(jwt.sign)(
            {
                id: this.id,
                role: this.role,
            },
            config.jwt.secret,
            config.tokens.identity,
        );
    }
}

export default User;
