import crypto from 'crypto';
import baseX from 'base-x';

const encoder = baseX('123456789ABCDEFGHJKMNPQRSTVWXYZ');

module.exports = (length) => (
    encoder
        .encode(crypto.randomBytes(Math.ceil((length * 5) / 8)))
        .slice(0, length)
);
