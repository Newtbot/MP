var validator = require('validator');

function isNumber(data) {
    if (validator.isNumeric(data))
    {
        console.log(data);
    }
    else
    {
        console.log("Invalid data");
    }


  }
  
  module.exports = { isNumber } 