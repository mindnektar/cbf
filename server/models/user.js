import validator from 'validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import _ from 'lodash';
import mongoose from '../mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 1,
        validate: {
            validator: validator.isAscii,
            message: '{VALUE} is not a valid username',
        },
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email',
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    tokens: [{
        access: {
            type: String,
            required: true,
        },
        token: {
            type: String,
            required: true,
        },
    }],
}, {
    timestamps: true,
});

UserSchema.methods.toJSON = function () {
    return {
        ..._.omit(this.toObject(), ['_id', '__v', 'password', 'tokens']),
        id: this.id,
    };
};

UserSchema.methods.generateAuthToken = function () {
    const access = 'auth';
    const token = jwt.sign({
        _id: this.id,
        access,
    }, process.env.JWT_SECRET).toString();

    this.tokens.push({ access, token });

    return this.save().then(() => token);
};

UserSchema.methods.removeToken = function (token) {
    return this.update({
        $pull: {
            tokens: {
                token,
            },
        },
    });
};

UserSchema.statics.findByToken = function (token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        return this.findOne({
            _id: decoded._id,
            'tokens.token': token,
            'tokens.access': 'auth',
        });
    } catch (e) {
        return Promise.resolve();
    }
};

UserSchema.statics.findByCredentials = function (username, password) {
    return this.findOne({ username }).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (error, response) => {
                if (response) {
                    resolve(user);
                } else {
                    reject(error);
                }
            });
        });
    });
};

UserSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        bcrypt.hash(this.password, 10, (error, hash) => {
            this.password = hash;
            next();
        });
    } else {
        next();
    }
});

export const User = mongoose.model('User', UserSchema);
