import { UUID } from "bson";

function getUserByUsername(db, username) {
    const query = { username: username };
    return new Promise((resolve, reject) => {
        db.collection('user').find(query).toArray((error, result) => {
            if (error) reject(error);
            if (result) resolve(result[0]);
        })
    });
}
function verifyPassword(username, password) {
    return password === 'y5512601';
}
function createUser(db, user) {
    const query = {uuid: UUID(), username: user.username, password: user.password, email: user.email};
    return new Promise(resolve => {
        db.collection('user').insertOne(query, (error, result) => {
            if (error) throw error;
            console.log(result);
            resolve(result);
        })
    })

}
export { 
    getUserByUsername, 
    verifyPassword,
    createUser
};