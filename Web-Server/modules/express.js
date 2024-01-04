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

const { APIlogger } = require('../middleware/apiLogger.js');

//middleware logic ( called by next() )
//app.use('/api/v0', require('../middleware/ApiKey.js'));
app.use('/api/v0', APIlogger, require('../routes/api_route.js'));

//route logic
app.use("/api/v0", require("../routes/api_route.js"));

//seed logic
app.use("/api/seed/v0", require("../routes/seed_route.js"));

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
