/*
1) PSI metric data 
2) Humidity 
3) Gases (O3,NO2,SO2)
4) temperature 
5) Air pressure?
6) windspeed? 
8) time when data was collected / generated
*/

/*
1) generate random data for each sensor
2) pass to mqtt broker
*/

let region = ["central", "north-east", "north", "east", "west"];

function generateRandomData() {
	const psiData = getRandomValue(0, 500);
	const humidityData = getRandomValue(0, 100);
	const o3Data = getRandomValue(0, 600); //max 600 
	const no2Data = getRandomValue(0, 1000); //max 1000
	const so2Data = getRandomValue(0, 1000); //max 1000
	const coData = getRandomValue(0 , 100); 
	const temperatureData = getRandomValue(24, 40);
	const windspeedData = getRandomValue(0, 35);
	const currentTime = new Date(Date.now() + 28800000)
		.toISOString()
		.slice(0, 19)
		.replace("T", " ");
	const regionData = region[Math.floor(Math.random() * region.length)];

	var json = {
		psi: psiData.toFixed(0),
		humidity: humidityData.toFixed(0) + "%",
		o3: o3Data.toFixed(0) + "ppm",
		no2: no2Data.toFixed(0) + "ppm",
		so2: so2Data.toFixed(0) + "ppm",
		co: coData.toFixed(0) + "ppm",
		temperature: temperatureData.toFixed(0) + "°C",
		windspeed: windspeedData.toFixed(0) + "km/h",
		time: currentTime,
		region: regionData,
	};
	return json;
}

function getRandomValue(min, max) {
	return Math.random() * (max - min) + min;
}

function iot_sensor_data() {
	return generateRandomData();
}

module.exports = { iot_sensor_data };

