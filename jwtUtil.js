import jwt from 'jsonwebtoken';

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