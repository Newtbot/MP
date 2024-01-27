//getting button from DOM id
const buttons = document.querySelectorAll(".button-container button");
const queryButton = document.getElementById("querybutton-container");
const ctx = document.getElementById("dataChart").getContext("2d");

$(document).ready(async function () {
	//https://stackoverflow.com/questions/9045868/javascript-date-getweek
	Date.prototype.getWeek = function () {
		var onejan = new Date(this.getFullYear(), 0, 1);
		var today = new Date(this.getFullYear(), this.getMonth(), this.getDate());
		var dayOfYear = (today - onejan + 86400000) / 86400000;
		return Math.ceil(dayOfYear / 7);
	};
	let date = new Date();
	var week = date.getWeek();
	var today = date.getDate();
	var month = date.getMonth() + 1; // Adding 1 to get the actual month number
	var year = date.getFullYear();
	//year data
	app.api.get("sensor-data/data?year=" + year, function (error, data) {
		//console.log(data);
	});
	//monthly data
	app.api.get("sensor-data/data?month=" + month, function (error, data) {
		//console.log(data);
	});
	//weekly data
	app.api.get(
		"sensor-data/data?month=" + month + "&week=" + week,
		function (error, data) {
			//console.log(data);
		}
	);
	//daily data
	app.api.get(
		"sensor-data/data?month=" + month + "&week=" + week + "&day=" + today,
		function (error, data) {
			for (let rows of data) {
                console.log(rows);
                getDate(rows.CreatedAt);

			}
		}
	);
});

function getDate(date){
    console.log(date);

}

/*

(async function() {
  const data = [
    { year: 2010, count: 10 },
    { year: 2011, count: 20 },
    { year: 2012, count: 15 },
    { year: 2013, count: 25 },
    { year: 2014, count: 22 },
    { year: 2015, count: 30 },
    { year: 2016, count: 28 },
  ];

  new Chart(
    document.getElementById('acquisitions'),
    {
      type: 'bar',
      data: {
        labels: data.map(row => row.year),
        datasets: [
          {
            label: 'Acquisitions by year',
            data: data.map(row => row.count)
          }
        ]
      }
    }
  );
})();
*/
// Initial dataset (AQI)
const initialData = {
	//date and time
    labels: [ date.map(row => row.CreatedAt)],
	datasets:[
		{
			//data like psi
			label: "Average PSI Data",
			data: [],
			backgroundColor: "green",
			borderColor: "green",
		},
	],
};

//setting chart
const chart = new Chart(ctx, {
	type: "bar",
	data: initialData,
	options: {
		responsive: true,
		title: {
			display: true,
			text: "HISTORICAL",
		},
		subtitle: {
			display: true,
			text: "Historic air quality graph for Singapore",
		},
		legend: {
			display: false,
		},
		tooltips: {
			mode: "index",
			intersect: false,
			callbacks: {
				label: function (tooltipItem, data) {
					const label = data.labels[tooltipItem.index];
					return label + ": " + data.datasets[0].data[tooltipItem.index];
				},
			},
		},
		scales: {
			xAxes: [
				{
					barPercentage: 0.6,
					categoryPercentage: 0.7,
					ticks: {
						autoSkip: true,
					},
					maxRotation: 0,
					minRotation: 0,
				},
			],
			yAxes: [
				{
					title: {
						display: true,
						text: "Value",
					},
				},
			],
		},
	},
});

queryButton.addEventListener("click", (event) => {
	const clickedButton = event.target;
	//console.log(clickedButton.id);

	//make it switch bar chart based on query button
});

