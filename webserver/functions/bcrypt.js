const bcrypt = require('bcrypt');
const saltRounds = 10;
//https://github.com/kelektiv/node.bcrypt.js#readme


/*
// Load hash from your password DB.
bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
    // result == true
});
bcrypt.compare(someOtherPlaintextPassword, hash, function(err, result) {
    // result == false
});
*/


/*
//hash with salt
bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
    // Store hash in your password DB.
});

*/

async function hashAPIKey(apikey) {
    return await bcrypt.hash(apikey, saltRounds);
}

async function compareAPIKey(apikey, hash) {
    return await bcrypt.compare(apikey, hash);
}



module.exports = { 
    hashAPIKey,
    compareAPIKey
};