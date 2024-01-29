//getting button from DOM id
const buttons = document.querySelectorAll(".button-container button");
const weeklybuttons = document.querySelectorAll(".weeklybutton-container button");
const queryButton = document.getElementById("querybutton-container");

$(document).ready(async function () {
	//https://stackoverflow.com/questions/9045868/javascript-date-getweek
	Date.prototype.getWeek = function () {
		var onejan = new Date(this.getFullYear(), 0, 1);
		var today = new Date(this.getFullYear(), this.getMonth(), this.getDate());
		var dayOfYear = (today - onejan + 86400000) / 86400000;
		return Math.ceil(dayOfYear / 7);
	};
	let date = new Date();
	var week = date.getWeek() - 1; // Subtracting 1 to get the actual week number
	var today = date.getDate();
	var month = date.getMonth() + 1; // Adding 1 to get the actual month number
	var year = date.getFullYear();

	// Initialize initialData for chart
	const initialData = {
		labels: [], // Array to store timestamps
		datasets: [
			{
				label: "Average Measurement Data",
				data: [], // Array to store measurements objects
				backgroundColor: "green",
				borderColor: "green",
			},
		],
	};

	// Create Chart.js chart
	const ctx = document.getElementById("DailyDataChart").getContext("2d");
	const chart = new Chart(ctx, {
		type: "bar",
		data: initialData,
		options: {
			responsive: true,
			title: {
				display: true,
				text: "Average measurement metric data by Hour",
			},
		},
	});

	// Function to update chart data based on button clicked
	function updateChart(metric) {
		const queryParams = `sensor-data/data?month=${month}&week=${week}&day=${today}`;
		app.api.get(queryParams, function (error, data) {
			// Clear previous data
			initialData.labels = []; //timestamp
			initialData.datasets[0].data = []; //measurement data dependinbg on metric

			// Group data by hour and calculate average value
			const hourlyData = {};
			for (let row of data) {
				//each row contains a timestamp and measurement data of each sensor and location
				const createdAt = new Date(row.createdAt); //set to local time
				const hourString = new Date(
					createdAt.getFullYear(),
					createdAt.getMonth(),
					createdAt.getDate(),
					createdAt.getHours()
				).toISOString();
				if (!hourlyData[hourString]) {
					hourlyData[hourString] = [];
				}
				hourlyData[hourString].push(row.measurement[metric]); //pushing measurement data into hourlyData
			}

			// Calculate average value for each hour
			//console.log(hourlyData); //24 values for each hour of the day
			for (let hourString in hourlyData) {
				const averageValue =
					hourlyData[hourString].reduce((acc, val) => acc + val, 0) /
					hourlyData[hourString].length;
				initialData.labels.push(
					new Date(hourString).toLocaleString("en-US", {
						timeZone: "UTC",
						hour12: false,
					})
				);
				initialData.datasets[0].data.push(averageValue);
			}

			// Update chart
			chart.update();
		});
	}
	// Event listeners for buttons
	document.getElementById("psiButton").addEventListener("click", function () {
		updateChart("psi");
	});

	document.getElementById("tempButton").addEventListener("click", function () {
		updateChart("temperature");
	});

	document.getElementById("humButton").addEventListener("click", function () {
		updateChart("humidity");
	});

	document.getElementById("o3Button").addEventListener("click", function () {
		updateChart("o3");
	});

	document.getElementById("no2Button").addEventListener("click", function () {
		updateChart("no2");
	});

	document.getElementById("so2Button").addEventListener("click", function () {
		updateChart("so2");
	});

	document.getElementById("coButton").addEventListener("click", function () {
		updateChart("co");
	});


});
