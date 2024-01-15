const { sequelize }  = require("../database/mySql.js");
const { apikeyModel } = require("../database/model/apikeyModel.js");
const { userModel } = require("../database/model/userModel.js");
const { Op, Sequelize } = require("sequelize");

async function getUser() {
        const user = await userModel.findAll();
        return user;
}

async function addUser(user) {
    //console.log(user);
    await userModel.create(user);
}

async function getAPIKey() {
    const apikey = await apikeyModel.findAll();
    return apikey;
}

async function addAPIKey(apikey) {
    await apikeyModel.create(apikey);
}

module.exports = {
    getUser,
    addUser,
    getAPIKey,
    addAPIKey,
};
