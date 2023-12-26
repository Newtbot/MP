/*
1) api route 
2) enforce best practice for api routes
*/
const express = require("express");
const helmet = require('helmet')
const app = express();
app.use(helmet())
const port = 80;

//disable x-powered-by header for security reasons
app.disable('x-powered-by')


const testRoute = require("../routes/test.js")
const latestDataroute = require("../routes/latest-Data.js")

app.use('/test', testRoute); 
app.use('/api/latest-data', latestDataroute);


app.listen(port, () => {
	console.log(`app listening on port ${port}`);
});

module.exports = { app };