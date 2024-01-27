const buttons = document.querySelectorAll('.button-container button');
const ctx = document.getElementById('dataChart').getContext('2d');

// Initial dataset (AQI)
const initialData = {
    labels: ['', 'Jan 22 11:00 PM', '', '', 'Jan 23 2:00 AM', '', '', 'Jan 23 5:00 AM', '', '', 'Jan 23 8:00 AM', '',],
    datasets: [{
        label: 'AQI',
        data: [50, 60, 60, 80, 30, 60, 54, 60, 43, 30, 60, 60],
        backgroundColor: 'green',
        borderColor: 'green',
    }]
};

const chart = new Chart(ctx, {
    type: 'bar',
    data: initialData,
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'HISTORICAL'
        },
        subtitle: {
            display: true,
            text: 'Historic air quality graph for Singapore'
        },
        legend: {
            display: false
        },
        tooltips: {
            mode: 'index',
            intersect: false,
            callbacks: {
                label: function (tooltipItem, data) {
                    const label = data.labels[tooltipItem.index];
                    return label + ': ' + data.datasets[0].data[tooltipItem.index];
                }
            }
        },
        scales: {
            xAxes: [{
                barPercentage: 0.6,
                categoryPercentage: 0.7,
                ticks: {
                    autoSkip: true,
                },
                maxRotation: 0,
                minRotation: 0
            }],
            yAxes: [{
                title: {
                    display: true,
                    text: 'Value'
                }
            }]
        }
    }
});

// Function to update chart data based on the selected button
const updateChart = (data) => {
    chart.data = data;
    chart.update();
};

// Event listener for button clicks
buttons.forEach(button => {
    button.addEventListener('click', () => {
        // Implement logic to switch data based on clicked button
        const buttonId = button.id.toLowerCase();
        let newData;

        // Example: Switch data based on button clicked
        switch (buttonId) {
            case 'aqibutton':
                newData = {
                    labels: ['', 'Jan 22 11:00 PM', '', '', 'Jan 23 2:00 AM', '', '', 'Jan 23 5:00 AM', '', '', 'Jan 23 8:00 AM', '',],
                    datasets: [{
                        label: 'AQI',
                        data: [50, 60, 60, 80, 30, 60, 54, 60, 43, 30, 60, 60],
                        backgroundColor: 'green',
                        borderColor: 'green',
                    }]
                };

                break;
            case 'tempbutton':
                newData = {
                    labels: ['Jan 22 11:00 PM', 'Jan 23 12:00 AM', 'Jan 23 1:00 AM', 'Jan 23 2:00 AM'],
                    datasets: [{
                        label: 'Temperature',
                        data: [25, 30, 40, 35],
                        backgroundColor: 'green',
                        borderColor: 'green',
                    }]
                };
                break;
            case 'humbutton':
                newData = {
                    labels: ['Jan 22 11:00 PM', 'Jan 23 12:00 AM', 'Jan 23 1:00 AM', 'Jan 23 2:00 AM'],
                    datasets: [{
                        label: 'Humidity',
                        data: [25, 30, 40, 35],
                        backgroundColor: 'green',
                        borderColor: 'green',
                    }]
                };
                break;
            case 'pm25button':
                newData = {
                    labels: ['Jan 22 11:00 PM', 'Jan 23 12:00 AM', 'Jan 23 1:00 AM', 'Jan 23 2:00 AM'],
                    datasets: [{
                        label: 'PM2.5',
                        data: [25, 30, 40, 35],
                        backgroundColor: 'green',
                        borderColor: 'green',
                    }]
                };
                break;
            case 'pm10button':
                newData = {
                    labels: ['Jan 22 11:00 PM', 'Jan 23 12:00 AM', 'Jan 23 1:00 AM', 'Jan 23 2:00 AM'],
                    datasets: [{
                        label: 'PM10',
                        data: [25, 30, 40, 35],
                        backgroundColor: 'green',
                        borderColor: 'green',
                    }]
                };
                break;
            case 'o3button':
                newData = {
                    labels: ['Jan 22 11:00 PM', 'Jan 23 12:00 AM', 'Jan 23 1:00 AM', 'Jan 23 2:00 AM'],
                    datasets: [{
                        label: 'O3',
                        data: [25, 30, 40, 35],
                        backgroundColor: 'green',
                        borderColor: 'green',
                    }]
                };
                break;
            case 'no2button':
                newData = {
                    labels: ['Jan 22 11:00 PM', 'Jan 23 12:00 AM', 'Jan 23 1:00 AM', 'Jan 23 2:00 AM'],
                    datasets: [{
                        label: 'NO2',
                        data: [25, 30, 40, 35],
                        backgroundColor: 'green',
                        borderColor: 'green',
                    }]
                };
                break;
            case 'so2button':
                newData = {
                    labels: ['Jan 22 11:00 PM', 'Jan 23 12:00 AM', 'Jan 23 1:00 AM', 'Jan 23 2:00 AM'],
                    datasets: [{
                        label: 'SO2',
                        data: [25, 30, 40, 35],
                        backgroundColor: 'green',
                        borderColor: 'green',
                    }]
                };
                break;
            case 'cobutton':
                newData = {
                    labels: ['Jan 22 11:00 PM', 'Jan 23 12:00 AM', 'Jan 23 1:00 AM', 'Jan 23 2:00 AM'],
                    datasets: [{
                        label: 'CO',
                        data: [25, 30, 40, 35],
                        backgroundColor: 'green',
                        borderColor: 'green',
                    }]
                };
                break;

            default:
                newData = initialData; // Default to initial data (AQI)
                break;
        }

        updateChart(newData);
    });
});