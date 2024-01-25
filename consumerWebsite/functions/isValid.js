const moment = require("moment");
const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");

//time is taken from the token
function isValid(time){
    const timeDiff = moment(currentTime).diff(time, "minutes");

    if (timeDiff > 1) {
        console.log(timeDiff);
        return false;
    }

    return true;

}




module.exports = { isValid };