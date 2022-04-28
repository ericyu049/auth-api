import express from 'express';
import mongo from 'mongodb';
import * as jwtUtil from './src/jwtUtil.js';
import * as userService from './src/userService.js';

const client = mongo.MongoClient;
const url = 'mongodb://localhost:27017/';
var db;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8080;

app.post('/checkUser', async (request, response) => {
    const username = request.body.username;

    const user = await userService.getUserByUsername(username);
    if (user) {
        response.status(400).send('Account already exists with that username');
        return;
    }
    else {
        response.status(200).send('Username is available');
        return;
    }
});
app.post('/signup', async (request, response) => {
    const username = request.body.username;
    const password = request.body.password;
    const email = request.body.email;
    const user = {
        username: username,
        password: password,
        email: email
    }
    const result = await userService.createUser(db, user).catch(
        (error) => {
            response.status(400).send('Database error: ', error);
            return;
        }
    )
    response.status(200).json({ rspCde: 0, rspMsg: 'Account successfully created. ', result });
});
app.post('/login', async (request, response) => {
    const username = request.body.username;
    const password = request.body.password;

    const user = await userService.getUserByUsername(db, username);
    if (!user) {
        response.status(400).send('User not found');
        return;
    }
    const isPasswordCorrect = userService.verifyPassword(user, password);
    if (!isPasswordCorrect) {
        response.status(400).send('Incorrect password');
        return;
    }
    const token = jwtUtil.generateToken(user);
    const refreshToken = jwtUtil.getRefreshToken(user);
    response.cookie("ai-amadeus.auth", token, { httpOnly: true, secure: true, expire: new Date() + 900000 });
    response.cookie("ai-amadeus.leap", refreshToken, { httpOnly: true, secure: true });
    response.status(200).json({ rspCde: 0, rspMsg: 'Success' });
});
app.post('/isLoggedin', jwtUtil.authenticationMiddleware, async(request, response) => {
    if(response.locals.user) {
        response.status(200).json({ rspCde: 0, rspMsg: 'Logged in.' });
    }
    
});
app.post('/logout', async (request, response) => {

});
app.post('/refreshToken', async (request, response) => {

});
client.connect(url, function (err, database) {
    if (err) throw err;
    db = database.db("timeleapmachine");
    app.listen(PORT, () => console.log(`Application is running on http://localhost:${PORT}`));
});


