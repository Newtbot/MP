/*
1) api route 
2) enforce best practice for api routes
*/
const express = require("express");
const helmet = require("helmet");

const app = express();
app.use(helmet());
const port = 80;

//disable x-powered-by header for security reasons
app.disable("x-powered-by");

app.use(express.json());
app.set("json spaces", 2);

//const { APIlogger } = require('../middleware/ApiLogger.js');

//middleware logic
//app.use('/api/v0', require('../middleware/ApiKey.js'));
//app.use('/api/v0', APIlogger, require('../routes/api_route.js'));

//route logic
app.use("/api/v0", require("../routes/api_route.js"));

// Catch 404 and forward to error handler. If none of the above routes are
// used, this is what will be called.
app.use(function (req, res, next) {
	var err = new Error("Not Found");
	err.message = "Page not found";
	err.status = 404;
	next(err);
});

// Error handler. This is where `next()` will go on error
app.use(function (err, req, res, next) {
	console.error(err.status || res.status, err.name, req.method, req.url);
	if (![404].includes(err.status || res.status)) {
		console.error(err.message);
		console.error(err.stack);
		console.error("=========================================");
	}

	res.status(err.status || 500);
	res.json({
		name: err.name,
		message: err.message,
		runner: err.runner && err.runner.name,
		duration: err.duration,
	});
});
app.listen(port, () => {
	console.log(`app listening on port ${port}`);
});

module.exports = { app };
