//functions if needed
const {
    getAllLog
} = require("../functions/apilog.js");

const express = require("express");
const router = express.Router();

//get all 
router.get("/", async (req, res, next) => {
    let Res = await getAllLog();
    res.json(Res);
});

//get by route name?
router.get("/route/:name", async (req, res, next) => {
});

//get ny status?
router.get("/status/:status", async (req, res, next) => {
});

//by method
router.get("/method/:method", async (req, res, next) => {
});

//by ip
router.get("/ip/:ip", async (req, res, next) => {
});




module.exports = router;
