const { run } = require("./modules/IoT-sensor");
const client = require("./modules/mqtt");

async function publishData() {
    try {
        const data = await run();
        console.log(data);
        client.publish("iot-data", JSON.stringify(data));
    } catch (err) {
        console.error(err);
    }
}

client.on("connect", () => {
	console.log("Connected to MQTT broker");
	publishData();
});

client.on("end", () => {
	console.log("Disconnected from MQTT broker");
	client.reconnect();
});

client.on("error", (err) => {
	console.error("Error:", err);
	client.end();
});

//every 15 minutes
setInterval(publishData, 900000);
//every 1 minute
//setInterval(publishData, 60000);






