const { api_log_Model } = require("../database/model/apiLogModel");
const {Op} = require("sequelize");

async function getAllLog(){
    return await api_log_Model.findAll();
}




module.exports = { getAllLog };