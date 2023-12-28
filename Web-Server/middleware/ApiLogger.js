const { connect } = require("../routes/test");

const APIlogger = (req, res, next) => {
	/*  
  console.log("API request received");
    console.log(req.ip);
    console.log(req.path);
    console.log(req.method);
    console.log(res.statusCode);
    console.log(req.headers['user-agent']);
    console.log(req.secure);
    console.log(req.protocol);
    console.log(req.get('host'));
    console.log(new Date()); 
    */
	const log = {
		method: req.method,
		statusCode: res.statusCode,
		protocol: req.protocol,
    //formatted in nice utc format
    time: new Date().toUTCString(),
    ip: req.ip,
		userAgent: req.headers["user-agent"],
		host: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
	};
  console.log(log);

	//upload to db logic here for api logs

	next();
};

module.exports = { APIlogger };


