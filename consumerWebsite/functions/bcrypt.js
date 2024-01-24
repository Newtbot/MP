const bcrypt = require('bcrypt');
const saltRounds = 10;
//https://github.com/kelektiv/node.bcrypt.js#readme

//hash for pass or token lol doesnt matter
async function hash(password) {
    return await bcrypt.hash(password, saltRounds);
}

//can be used to compare password or token
async function compareHash(password, hash) {
    return await bcrypt.compare(password, hash);
}



module.exports = { 
    hash,
    compareHash
};