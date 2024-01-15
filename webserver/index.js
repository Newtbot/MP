const { app } = require("./modules/express.js");
const client = require("./modules/mqtt");
const { isJson, isNumber } = require("./functions/validateData.js");
const { insertDatatoDB } = require("./functions/database.js");

// Event handlers
client.on("connect", () => {
	console.log("Connected to MQTT broker");
	client.subscribe("iot-data");
});

client.on("message", (topic, message) => {
	try {
		let datas = JSON.parse(message);
		if (isJson(datas)) {
			for (let key in datas) {
				let data = parseInt(
					datas[key].locationid +
						" " +
						datas[key].sensorid +
						" " +
						datas[key].measurement.psi +
						" " +
						datas[key].measurement.humidity +
						" " +
						datas[key].measurement.o3 +
						" " +
						datas[key].measurement.no2 +
						" " +
						datas[key].measurement.so2 +
						" " +
						datas[key].measurement.co +
						" " +
						datas[key].measurement.temperature +
						" " +
						datas[key].measurement.windspeed
				);
				if (isNumber(data)) {
					{
						//pass datas to database
						insertDatatoDB(datas[key]);

					}
				} else {
					console.log("Invalid data");
					client.end();
				}
			}
		} else {
			console.log("Invalid data");
			client.end();
		}
	} catch (err) {
		console.error(err);
	}
});

client.on("error", (err) => {
	console.error("Error:", err);
	client.end();
});

client.on("end", () => {
	console.log("Disconnected from MQTT broker");
	client.reconnect();
});
