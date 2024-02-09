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
	const dailyinitialData = {
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
	const weeklyinitialData = {
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

	const MonthlyinitialData = {
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

	// https://www.chartjs.org/docs/latest/axes/
	const ctx = document.getElementById("DailyDataChart").getContext("2d");
	const dailyChart = new Chart(ctx, {
		type: "bar",
		data: dailyinitialData,
		options: {
			responsive: true,
			title: {
				display: true,
				text: "Average measurement metric data by Hour",
			},
			scales: {
				x: {
					valueFormatString: "Time",
					title: {
						display: true,
						text: "Date and Time in 24 hour format",
					},
				},
				y: {
					title: {
						display: true,
						text: "Measurement",
					},
				},
			},
		},
	});
	//weekly chart
	const weeklyCtx = document.getElementById("WeeklyDataChart").getContext("2d");
	const weeklyChart = new Chart(weeklyCtx, {
		type: "bar",
		data: weeklyinitialData,
		options: {
			responsive: true,
			title: {
				display: true,
				text: "Average measurement metric data by Week",
			},
			scales: {
				x: {
					valueFormatString: "Time",
					title: {
						display: true,
						text: "Week",
					},
				},
				y: {
					title: {
						display: true,
						text: "Measurement",
					},
				},
			},
		},
	});

	//monthly chart
	const monthlyCtx = document
		.getElementById("MonthlyDataChart")
		.getContext("2d");
	const monthlyChart = new Chart(monthlyCtx, {
		type: "bar",
		data: MonthlyinitialData,
		options: {
			responsive: true,
			title: {
				display: true,
				text: "Average measurement metric data by Month",
			},
			scales: {
				x: {
					valueFormatString: "Time",
					title: {
						display: true,
						text: "Month",
					},
				},
				y: {
					title: {
						display: true,
						text: "Measurement",
					},
				},
			},
		},
	});

	// Function to update chart data based on button clicked
	function updateChart(metric) {
		const queryParams = `sensor-data/data?month=${month}&week=${week}&day=${today}`;
		app.api.get(queryParams, function (error, data) {
			// Clear previous data
			dailyinitialData.labels = []; //timestamp
			dailyinitialData.datasets[0].data = []; //measurement data dependinbg on metric

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
				dailyinitialData.labels.push(
					new Date(hourString).toLocaleString("en-US", {
						timeZone: "UTC",
						hour12: false,
					})
				);
				dailyinitialData.datasets[0].data.push(averageValue);
			}

			// Update chart
			dailyChart.update();
		});
	}
	function updateWeeklyChart(metric) {
		const queryParams = `sensor-data/data?month=${month}&week=${week}`;
		app.api.get(queryParams, function (error, data) {
			// Clear previous data
			weeklyinitialData.labels = []; //timestamp
			weeklyinitialData.datasets[0].data = []; //measurement data depending on metric

			// Group data by week and calculate average value for each week
			const weeklyData = {};
			for (let row of data) {
				const weekNumber = getWeekNumber(new Date(row.createdAt));
				if (!weeklyData[weekNumber]) {
					weeklyData[weekNumber] = [];
				}
				weeklyData[weekNumber].push(row.measurement[metric]);
			}

			for (let weekNumber in weeklyData) {
				const averageValue =
					weeklyData[weekNumber].reduce((acc, val) => acc + val, 0) /
					weeklyData[weekNumber].length;
				weeklyinitialData.labels.push(`Week ${weekNumber}`);
				weeklyinitialData.datasets[0].data.push(averageValue);
			}

			// Update chart
			weeklyChart.update();
		});
	}

	function getWeekNumber(date) {
		const onejan = new Date(date.getFullYear(), 0, 1);
		const dayOfYear = Math.ceil((date - onejan) / 86400000);
		return Math.ceil(dayOfYear / 7);
	}

	//month chart
	function updateMonthlyChart(metric) {
		const queryParams = `sensor-data/data?month=${month}`;
		app.api.get(queryParams, function (error, data) {
			// Clear previous data
			MonthlyinitialData.labels = []; //timestamp
			MonthlyinitialData.datasets[0].data = []; //measurement data depending on metric

			// Group data by month and calculate average value for each month
			const monthlyData = {};
			for (let row of data) {
				const monthNumber = new Date(row.createdAt).getMonth();
				if (!monthlyData[monthNumber]) {
					monthlyData[monthNumber] = [];
				}
				monthlyData[monthNumber].push(row.measurement[metric]);
			}

			for (let monthNumber in monthlyData) {
				const averageValue =
					monthlyData[monthNumber].reduce((acc, val) => acc + val, 0) /
					monthlyData[monthNumber].length;
				MonthlyinitialData.labels.push(`Month ${monthNumber}`);
				MonthlyinitialData.datasets[0].data.push(averageValue);
			}

			// Update chart
			monthlyChart.update();
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

	//week buttons
	document
		.getElementById("weeklypsiButton")
		.addEventListener("click", function () {
			updateWeeklyChart("psi");
		});

	document
		.getElementById("weeklytempButton")
		.addEventListener("click", function () {
			updateWeeklyChart("temperature");
		});

	document
		.getElementById("weeklyhumButton")
		.addEventListener("click", function () {
			updateWeeklyChart("humidity");
		});

	document
		.getElementById("weeklyo3Button")
		.addEventListener("click", function () {
			updateWeeklyChart("o3");
		});

	document
		.getElementById("weeklyno2Button")
		.addEventListener("click", function () {
			updateWeeklyChart("no2");
		});

	document
		.getElementById("weeklyso2Button")
		.addEventListener("click", function () {
			updateWeeklyChart("so2");
		});

	document
		.getElementById("weeklycoButton")
		.addEventListener("click", function () {
			updateWeeklyChart("co");
		});

	//month buttons
	document
		.getElementById("monthlypsiButton")
		.addEventListener("click", function () {
			updateMonthlyChart("psi");
		});

	document
		.getElementById("monthlytempButton")
		.addEventListener("click", function () {
			updateMonthlyChart("temperature");
		});

	document
		.getElementById("monthlyhumButton")
		.addEventListener("click", function () {
			updateMonthlyChart("humidity");
		});

	document
		.getElementById("monthlyo3Button")
		.addEventListener("click", function () {
			updateMonthlyChart("o3");
		});

	document
		.getElementById("monthlyno2Button")
		.addEventListener("click", function () {
			updateMonthlyChart("no2");
		});

	document
		.getElementById("monthlyso2Button")
		.addEventListener("click", function () {
			updateMonthlyChart("so2");
		});

	document
		.getElementById("monthlycoButton")
		.addEventListener("click", function () {
			updateMonthlyChart("co");
		});
});
