const express = require("express");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
const { APIlogger } = require('../middleware/apiLogger.js');
const { apikeyCheck } = require('../middleware/apiKey.js');

const app = express();
app.use(helmet());
const port = 80;

//express-rate-limit stolen from docs
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 600, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})


// Apply the rate limiting middleware to all requests.
app.use(limiter)

//disable x-powered-by header for security reasons
app.disable("x-powered-by");

//parse json body format 
app.use(express.json());
app.set("json spaces", 2);


/*
middleware logic ( called by next() )
*/
app.use("/api/seed/v0", [ apikeyCheck , APIlogger] ,require("../routes/seed_route.js"));
app.use('/api/v0', [apikeyCheck, APIlogger] ,require("../routes/api_route.js")); //webserver\routes\api_route.js



// Catch 404 and forward to error handler. If none of the above routes are
// used, this is what will be called.
app.use(function (req, res, next) {
	var err = new Error("Not Found");
	err.message = "Page not found";
	err.status = 404;
	next(err);
});

// Error handler. This is where `next()` will go on error
app.use(function(err, req, res, next) {
	console.error(err.status || res.status, err.name, req.method, req.url);
	if(![ 404].includes(err.status || res.status)){
	  console.error(err.message);
	  console.error(err.stack);
	  console.error('=========================================');
	}
	
	console.log(err.name + " validation error");
	// Parse key error for Sequilzw
	let keyErrors = {}
	if(['SequelizeValidationError'].includes(err.name) && err.errors){
		for(let item of err.errors){
			if(item.path){
				keyErrors[item.path] = item.message
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
