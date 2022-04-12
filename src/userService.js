function getUserByUsername(username) {
    if (username === 'ericyu049') {
        return {
            username: 'ericyu049',
            password: 'y5512601',
            role: 'user'
        }
    }
}
function verifyPassword(username, password) {
    return password === 'y5512601';
}

export { getUserByUsername, verifyPassword };