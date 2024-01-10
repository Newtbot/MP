var validator = require("validator");

function isAlphaNumericwithSpaces(value) {
	return validator.isAlphanumeric(value, ["en-US"], { ignore: " " });
}

//allow alphanumeric and spaces and -
function isAlphaNumericWithSpacesAndDash(value) {
	const alphanumeric = /^[a-zA-Z0-9]+$/;
	const valid = value
		.split("")
		.every((char) => alphanumeric.test(char) || char === " " || char === "-");
	return valid;
}

function isJson(value) {
  //check if its object
  if(typeof value === "object"){
    console.log("its an object")
    return true 
  }

}

module.exports = {
	validateData,
	isValidDateString,
	isAlphaNumericwithSpaces,
	isAlphaNumericWithSpacesAndDash,
	isMacAddress,
	isJson,
};

