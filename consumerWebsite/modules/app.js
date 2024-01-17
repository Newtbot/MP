const express = require("express");
const helmet = require("helmet");
const path = require("path");
const app = express();
const port = 80;

const bodyParser = require('body-parser'); // Middleware 

app.use(bodyParser.urlencoded({ extended: false }));

app.use(helmet());
//disable x-powered-by header for security reasons
app.disable("x-powered-by");
app.use(express.json());
app.set("json spaces", 2);

//public folder with path to static files
app.use(express.static(path.join(__dirname, "../public")));

//middleware logic ( called by next() )
//add token middeware upon login to validate routes that require token

//route logic
app.use("/api/v0", require("../routes/api_routes")); //consumerWebsite\routes\api_routes.js

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

	console.log(err.name + " validation error");
	// Parse key error for Sequilzw
	let keyErrors = {};
	if (["SequelizeValidationError"].includes(err.name) && err.errors) {
		for (let item of err.errors) {
			if (item.path) {
				keyErrors[item.path] = item.message;
			}
		}
	}

	res.status(err.status || 500);
	console.log(keyErrors);
	res.json({
		name: err.name,
		message: err.message,
		keyErrors,
	});
});
app.listen(port, () => {
	console.log(`app listening on port ${port}`);
});

module.exports = { app };
