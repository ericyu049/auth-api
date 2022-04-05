import './jwtUril.js';

const express = require("express");
const app = express();
const axios = require("axios");

const PORT = process.env.PORT || 8080


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
    response.status(200).json({ token, refreshtoken });
})




app.listen(PORT, () => console.log(`Application is running on http://localhost:${PORT}`));