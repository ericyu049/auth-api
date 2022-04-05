import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8080;
const ALIVE_TIME = 15 * 60;
const JWT_SECRETKEY = 'big penis';

function getUserByUsername(username) {
    if (username === 'ericyu049') {
        return {
            username: 'ericyu049',
            password: 'y5512601',
            role: 'user'
        }
    }
}
function verifyPassword(user, password) {
    return user.password === password;
}

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
app.post('/login', async (request, response) => {
    const username = request.body.username;
    const password = request.body.password;

    const user = await getUserByUsername(username);
    if (!user) {
        response.status(400).send('User not found');
        return;
    }
    const isPasswordCorrect = verifyPassword(user, password);
    if (!isPasswordCorrect) {
        response.status(400).send('Incorrect password');
        return;
    }
    const token = generateToken(user);
    const refreshToken = getRefreshToken(user);
    response.status(200).json({ rspCde: 0, rspMsg: 'Success', token, refreshToken });
})
app.post('/refreshToken', async(request, response) => {

})



app.listen(PORT, () => console.log(`Application is running on http://localhost:${PORT}`));