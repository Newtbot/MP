const {
	addLocation,
	getLocation,
	getLocationById,
	getLocationByName,
	updateLocation,
	deleteLocation,
} = require("../functions/location");

const express = require("express");
const router = express.Router();

//get location
router.get("/", async (req, res, next) => {
	try {
		const location = await getLocation();
		//res send json and status code
		res.status(200).json(location);
	} catch (error) {
		console.error(error);
		next(error);
	}
});


//add location 
router.post("/new", async (req, res, next) => {
	try {
		const { name, added_by, description } = req.body;
		await addLocation(name, added_by, description);
		res.sendStatus(200)
	} catch (error) {
		console.error(error);
		next(error);
	}
});

//update location
router.put("/update", async (req, res, next) => {
	try {
		const { id, name, added_by, description } = req.body;
		await updateLocation(id, name, added_by, description);
		res.status(200).json({ message: "Location " + id + " updated"  });
	} catch (error) {
		console.error(error);
		next(error);
	}
});

//delete location
router.delete("/delete", async (req, res, next) => {
	try {
		const { id } = req.body;
		await deleteLocation(id);
		res.status(200).json({ message: "Location " + id + " deleted" });
	} catch (error) {
		console.error(error);
		next(error);
	}
});

//get location by name
router.get("/name/:name", async (req, res, next) => {
	try {
		//get params
		const { name } = req.params;
		const location = await getLocationByName(name);
		res.status(200).json(location);
	} catch (error) {
		console.error(error);
		next(error);
	}
});



//get location by id
router.get("/:id", async (req, res, next) => {
	try {
		//get params
		const { id } = req.params;
		const location = await getLocationById(id);
		res.status(200).json(location);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

module.exports = router;
