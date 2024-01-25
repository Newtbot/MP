const {
    getLatestData,

} = require("../functions/sensorData");

const express = require("express");
const router = express.Router();

router.get("/data", async (req, res, next) => {
    try {
		console.log(req.query);
        const data = await getLatestData();
        res.status(200).json(data);

    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;
