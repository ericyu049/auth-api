import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const ALIVE_TIME = 15 * 60;
const JWT_SECRETKEY = 'big penis';

function generateToken(user) {
    const username = user.username;
    const email = user.email;
    const type = 'access';

    const tokenPayload = { email, username, type };
    const token = jwt.sign(
        tokenPayload,
        JWT_SECRETKEY,
        { expiresIn: ALIVE_TIME }
    );
    return token;
}
function getRefreshToken(user) {
    const username = user.username;
    const email = user.email;
    const type = 'refresh';

    const password = user.password;
    const key = genKey(username, password);

    const tokenPayload = { type, username, email, key };

    const refreshToken = jwt.sign(tokenPayload, JWT_SECRETKEY);
    return refreshToken;
}
function hashHmacSha256(s) {
    return crypto
        .createHmac('sha256', JWT_SECRETKEY)
        .update(s)
        .digest('hex');
}

function genKey(id, password) {
    const rawKey = id + password;
    const key = hashHmacSha256(rawKey, JWT_SECRETKEY);
    return key;
}

export { generateToken, getRefreshToken };