/*
1) api route 
2) enforce best practice for api routes


*/
const express = require("express");
const app = express();
const port = 3000;

const testRoute = require("../routes/test.js")
const testRoute1 = require("../routes/latest-Data.js")

app.use('/test', testRoute); 
app.use('/api/latest-data', testRoute1);


app.listen(port, () => {
	console.log(`app listening on port ${port}`);
});

module.exports = { app };