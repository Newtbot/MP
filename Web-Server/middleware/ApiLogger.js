const { insertLogData } = require("../functions/database.js");
const APIlogger = (req, res, next) => {
  try {
    const log = {
      ip: req.ip,
      time: new Date().toUTCString(),
      method: req.method,
      //https://stackoverflow.com/questions/10183291/how-to-get-the-full-url-in-express
      host: `${req.protocol}://${req.get("host")}${req.originalUrl}`, 
      statusCode: res.statusCode,
      Responsesize: res.get('Content-Length') ? res.get('Content-Length') : 0,
      referrer: res.get('content-type') ? res.get('content-type') : "none",
      userAgent: req.headers["user-agent"],
    };
    //upload to db logic here for api logs
    insertLogData(log);
    next();
  }
  catch (error) {
    console.error(error);
  }
};

module.exports = { APIlogger };


/*
		method: req.method,
		statusCode: res.statusCode,
		protocol: req.protocol,
    //formatted in nice utc format
    time: new Date().toUTCString(),
    ip: req.ip,
		userAgent: req.headers["user-agent"],
		host: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
*/