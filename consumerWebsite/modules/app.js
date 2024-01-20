const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
const ejs = require("ejs");


app.use(express.json());
app.set("json spaces", 2);

// Set up the templating engine to build HTML for the front end.
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

// Have express server static content( images, CSS, browser JS) from the public
app.use(express.static(path.join(__dirname, "../public")));

//middleware logic ( called by next() )
const auth = require("../middleware/authChecker"); 


//route logic
app.use("/api/v0", require("../routes/api_routes")); 

//render logic
app.use("/", require("../routes/render"));

// Catch 404 and forward to error handler. If none of the above routes are
// used, this is what will be called.
app.use(function (req, res, next) {
	if (req.is("application/json")) {
	var err = new Error("Not Found");
	err.message = "Page not found";
	err.status = 404;
	next(err);
	}
	else{
		res.status(404).render("404");
	}
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
