var validator = require("validator");

function isAlphaNumericwithSpaces(value) {
	return validator.isAlphanumeric(value, ["en-US"], { ignore: " " });
}

//allow alphanumeric and spaces and -
function isAlphaNumericWithSpacesAndDash(value) {
	const alphanumeric = /^[a-zA-Z0-9]+$/;
	const valid = value
		.split("")
		.every((char) => alphanumeric.test(char) || char === " " || char === "-" || char === "_");
	return valid;
}

function isJson(value) {
  //check if its object
  if(typeof value === "object"){
    console.log("its an object")
    return true 
  }

}

/*
//https://stackoverflow.com/questions/35145838/regex-for-singapore-addresses
2 Orchard Turn #B4-47 ION ORCHARD Singapore 238801

68 Marine Parade Road #03-26B parkway Parade 449269

Nanyang Polytechnic 180 Ang Mo Kio Avenue 8 Singapore 569830
*/
function isAddress(value){
	//  (\d{1,3}.)?.+\s(\d{6})$
	const addressRegex = /^(\d{1,3}.)?.+\s(\d{6})$/;
	//return true if it matches
	return addressRegex.test(value);
}

//generate me an regex for alpha 
//https://stackoverflow.com/questions/11522529/regexp-for-alphabets-with-spaces

module.exports = {
	isAlphaNumericwithSpaces,
	isAlphaNumericWithSpacesAndDash,
	isJson,
	isAddress
};

