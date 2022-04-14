import { randomUUID } from "crypto";

function getUserByUsername(db, username) {
    const query = { username: username };
    return new Promise((resolve, reject) => {
        db.collection('user').find(query).toArray((error, result) => {
            if (error) reject(error);
            if (result) resolve(result[0]);
        })
    });
}
function verifyPassword(user, password) {
    return password === user.password;
}
function createUser(db, user) {
    const query = {uuid: randomUUID(), username: user.username, password: user.password, email: user.email};
    return new Promise(resolve => {
        db.collection('user').insertOne(query, (error, result) => {
            if (error) throw error;
            if (result) resolve(result);
        })
    })
}
export { 
    getUserByUsername, 
    verifyPassword,
    createUser
};