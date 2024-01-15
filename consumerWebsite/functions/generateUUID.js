/*
const crypto = require('crypto');
Calling the UUID method returns a UUID of standard length that you can use in your program.

let uuid = crypto.randomUUID();
console.log(uuid);

*/
const crypto = require('crypto');


async function generateUUID() {
    let uuid = crypto.randomUUID();
    return uuid;
}

module.exports = { generateUUID };