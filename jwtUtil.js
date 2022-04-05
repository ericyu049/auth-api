import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const ALIVE_TIME = 15 * 60;
const JWT_SECRETKEY = 'big penis';

function generateToken(user) {
    const role = user.role;
    const username = user.username;
    const type = 'access';

    const tokenPayload = { role, username, type };
    const token = jwt.sign(
        tokenPayload,
        JWT_SECRETKEY,
        { expiresIn: ALIVE_TIME }
    );
    return token;
}

function getRefreshToken(user) {
    const username = user.username;
    const role = user.role;
    const type = 'refresh';

    const password = user.password;
    const key = genKey(username, password);

    const tokenPayload = { type, username, role, key };

    const refreshToken = jwt.sign(tokenPayload, JWT_SECRET_KEY);
    return refreshToken;
}

function hashHmacSha256(s) {
  return crypto
    .createHmac('sha256', JWT_SECRET_KEY)
    .update(s)
    .digest('hex');
}

function genKey(id, password) {
    const rawKey = id + password;
    const key = hashHmacSha256(rawKey, JWT_SECRET_KEY);
    return key;
}