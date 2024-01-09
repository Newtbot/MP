document.addEventListener("DOMContentLoaded", async function () {
    console.log("DOM Loaded");
  
    // Extract data from sensorData
    const sensorData = JSON.parse('<%- JSON.stringify(sensorData) %>');
    console.log("Sensor Data:", sensorData);
  
    // Fetch location names from the server
    const locationNames = await fetch('/api/locations') // Adjust the API endpoint
      .then(response => response.json())
      .then(data => data.map(location => ({ id: location.id, name: location.name })))
      .catch(error => console.error('Error fetching location names:', error));
  
    
  
    // Group sensorData by locationid
    const groupedData = groupBy(sensorData, 'locationid');
  
    // Get the content div
    const contentDiv = document.getElementById('content');
  
    // Create a chart for each location
    Object.keys(groupedData).forEach(locationId => {
      const locationData = groupedData[locationId];
  
      // Find the corresponding location name
      const locationName = locationNames.find(location => location.id === parseInt(locationId, 10))?.name || `Unknown Location ${locationId}`;
  
      // Create a container for the chart
      const container = document.createElement('div');
      container.className = 'chart-container';
  
      // Create a title for the container with location name
      const title = document.createElement('h4');
      title.textContent = `Location: ${locationName}`;
      container.appendChild(title);
  
      // Get labels (Location IDs)
      const labels = locationData.map(data => new Date(data.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Singapore' }));
  
      // Create datasets for each measurement
      const datasets = [
        {
          label: 'CO',
          data: locationData.map(data => data.measurement.co),
          backgroundColor: 'rgba(255, 99, 132, 0.5)', // Red color
        },
        {
          label: 'O3',
          data: locationData.map(data => data.measurement.o3),
          backgroundColor: 'rgba(54, 162, 235, 0.5)', // Blue color
        },
        {
          label: 'NO2',
          data: locationData.map(data => data.measurement.no2),
          backgroundColor: 'rgba(255, 206, 86, 0.5)', // Yellow color
        },
        {
          label: 'SO2',
          data: locationData.map(data => data.measurement.so2),
          backgroundColor: 'rgba(75, 192, 192, 0.5)', // Green color
        },
      ];
  
      // Create a canvas element for each location
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 200;
  
      // Append canvas to the container
      container.appendChild(canvas);
  
      // Append container to the content div
      contentDiv.appendChild(container);
  
      // Create a bar chart for each location
      const ctx = canvas.getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: datasets,
        },
        options: {
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    });
  
    // Helper function to group data by a specified key
    function groupBy(arr, key) {
      return arr.reduce((acc, obj) => {
        const groupKey = obj[key];
        acc[groupKey] = acc[groupKey] || [];
        acc[groupKey].push(obj);
        return acc;
      }, {});
    }
  });
  