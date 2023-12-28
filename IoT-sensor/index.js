const { iot_sensor_data } = require("./modules/IoT-sensor");
const client = require("./modules/mqtt");

function publishData() {
    let data = iot_sensor_data();

    // MQTT logic
    client.publish("iot-data", JSON.stringify(data), { qos: 1 }, (err) => {
        if (err) {
            console.error("Error publishing message:", err);
        } else {
            console.log("Message published");
        }
    });
}

client.on("connect", () => {
    console.log("Connected to MQTT broker");
    publishData();
});

client.on("end", () => {
    console.log("Disconnected from MQTT broker");
    client.reconnect = true;
});

client.on("error", (err) => {
    console.error("Error:", err);
    client.end(); 
});

//every 15 minutes
setInterval(publishData, 900000);
//setInterval(publishData, 600);