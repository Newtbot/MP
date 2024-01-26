//time is taken from the token
function isValid(time) {

	if (
		Math.floor(new Date(time).getTime() / 1000) <
		Math.floor(new Date().getTime() / 1000)
	) {
		return false;
	}
	return true;
    
}

module.exports = { isValid };
