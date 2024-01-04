var validator = require("validator");

// Regular expressions for data validation
const psiPattern = /^\d+$/;
const humidityPattern = /^\d+%$/;
const concentrationPattern = /^\d+ppm$/;
const temperaturePattern = /^-?\d+°C$/;
const windspeedPattern = /^\d+km\/h$/;
const timePattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
const regionPattern = /^[a-zA-Z-]+$/;

function validateData(data) {
	return (
		psiPattern.test(data.psi) &&
		humidityPattern.test(data.humidity) &&
		concentrationPattern.test(data.o3) &&
		concentrationPattern.test(data.no2) &&
		concentrationPattern.test(data.so2) &&
		concentrationPattern.test(data.co) &&
		temperaturePattern.test(data.temperature) &&
		windspeedPattern.test(data.windspeed) &&
		timePattern.test(data.time) &&
		regionPattern.test(data.region)
	);
}

const dateRegex =
	/^[A-Za-z]{3}, \d{2} [A-Za-z]{3} \d{4} \d{2}:\d{2}:\d{2} GMT$/;

function isValidDateString(value) {
	return dateRegex.test(value);
}

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

function isMacAddress(value) {
	//	Joi.string().regex(/^([0-9a-f]{2}-){5}([0-9a-f]{2})$/i).lowercase()
	//return validator.isMACAddress(value, { no_separators: true, eui: 48 });
	const macAddress = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
	const valid = macAddress.test(value);
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
/*
isMACAddress(str [, options])

*/
