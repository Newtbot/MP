const express = require("express");
const { rateLimit } = require("express-rate-limit");
const path = require("path");
const router = require('./routes/user');
const errorHandler = require('./utils/errorHandler');
const app = express();
const ejs = require("ejs");

module.exports = app;

//process.nextTick(() => require("./mqttApp"));

app.use(express.json());
app.set("json spaces", 2);

//express-rate-limit stolen from docs
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 600, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

// Hold list of functions to run when the server is ready
app.onListen = [
	function () {
		console.log("Express is ready");
	},
];

// Apply the rate limiting middleware to all requests.
app.use(limiter);

//disable x-powered-by header for security reasons
app.disable("x-powered-by");

// Set up the templating engine to build HTML for the front end.
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

// Have express server static content( images, CSS, browser JS) from the public
app.use(express.static(path.join(__dirname, "./public")));

//route logic
app.use("/api/seed/v0", require("./routes/seed_route.js"));
app.use("/api/v0", require("./routes/api_routes"));

//render logic
app.use("/", require("./routes/render"));

// Catch 404 and forward to error handler. If none of the above routes are
// used, this is what will be called.
app.use(function (req, res, next) {
    //application/json; charset=utf-8
        var err = new Error("Not Found");
        err.message = "Page not found";
        err.status = 404;
        next(err);
});

// Error handler. This is where `next()` will go on error
app.use(function (err, req, res, next) {
    console.error(err.status || res.status, err.name, req.method, req.url);

    // Parse key error for Sequilzw
    let keyErrors = {};
    if (["SequelizeValidationError"].includes(err.name) && err.errors) {
        for (let item of err.errors) {
            if (item.path) {
                keyErrors[item.path] = item.message;
            }
        }
        res.status = 422;
    }

    if (![404, 401, 422].includes(err.status || res.status)) {
        console.error(err.message);
        console.error(err.stack);
        console.error("=========================================");
    }
    res.status(err.status || 500);
	//  res.status(err.status || 500);

    if (req.get('Content-Type') && req.get('Content-Type').includes("json")) {
        res.json({
            name: err.name || "Unknown error",
            message: err.message,
            keyErrors,
        });
    } 
    else {
        res.json({
            name: err.name || "Unknown error",
            message: err.message,
            keyErrors,
        });
    }
});

//reset password logic
app.use("/api/user", router)

app.use(errorHandler);

const PORT = 3000;

app.listen(PORT, () => {
    console.log('server running on port ' + PORT);
});