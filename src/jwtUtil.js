import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const ALIVE_TIME = 15 * 60;
const REFRESH_TIME = '7d';
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

    const refreshToken = jwt.sign(tokenPayload, JWT_SECRETKEY, { expiresIn: REFRESH_TIME });
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
function authenticationMiddleware(request, response, nextHandler) {
    const accessToken = getAccessTokenFromHeader(request);
    try {
        const tokenPayload = jwt.verify(accessToken, JWT_SECRETKEY);
        if (tokenPayload.type !== 'access') throw new Error('wrong token type');
        response.locals.user = tokenPayload;
        nextHandler();
    }
    catch (error) {
        response.status(401).send(error.message);
    }
}
function getAccessTokenFromHeader(request) {
    const map = new Map();
    request.headers.cookie.split(';').forEach(cookie => {
        const temp = cookie.split('=');
        const key = temp[0];
        const value = temp[1];
        map.set(key, value);
    });
    return map.get('ai-amadeus.auth');
}
export { generateToken, getRefreshToken, authenticationMiddleware };