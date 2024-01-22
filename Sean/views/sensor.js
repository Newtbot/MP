$(document).ready(function () {
    $('#allSensorLink').on('click', function () {
      $('#sensorContainer').show();
      $('#createSensorForm').hide();
    });
    $('#addSensorLink').on('click', function () {
        $('#sensorContainer').hide();
        $('#createSensorForm').show();
      });
  });
    let locationsArray = [];

    // Function to fetch and store locations in the array
    function fetchLocations() {
        // Make a GET request to retrieve all locations
        fetch('/api/v0/location', {
            method: 'GET',
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            })
            .then(locations => {
                // Reset the array
                locationsArray = [];

                // Populate the array with location information
                locations.forEach(location => {
                    // Store in the array
                    locationsArray.push({
                        id: location.id,
                        location: location.name,
                    });
                });
            })
            .catch(error => {
                console.error('Error fetching locations:', error);
                // Handle error as needed
            });
    }
    // Call the fetchLocations function when the page loads
    fetchLocations();

    // Function to fetch sensor data and populate the table
    function fetchAndPopulateSensorTable() {
        // Fetch sensor data from the API
        fetch('/api/v0/sensor', {
            method: 'GET',
            headers: {
                'Authorization': '1-1ec4ce9d-bcff-46c4-a023-c34171b9ca51'
            },
        })
            .then(response => response.json())
            .then(sensorData => {
                // Get the table body
                const tableBody = document.getElementById('sensorTableBody');

                // Clear existing rows
                tableBody.innerHTML = '';

                // Iterate through each sensor data
                sensorData.forEach(sensor => {
                    // Find the corresponding location object
                    const location = locationsArray.find(loc => loc.id === sensor.location);

                    // Create a new row
                    const row = tableBody.insertRow();

                    // Insert cells with sensor data
                    row.insertCell(0).textContent = sensor.id;
                    row.insertCell(1).textContent = sensor.sensorname;
                    row.insertCell(2).textContent = sensor.added_by;
                    row.insertCell(3).textContent = sensor.mac_address;
                    row.insertCell(4).textContent = sensor.description;

                    // Insert location cell with corresponding location name
                    const locationCell = row.insertCell(5);
                    locationCell.textContent = location ? location.location : 'Unknown';
                });
            })
            .catch(error => {
                console.error('Error fetching sensor data:', error);
            });
    }

    // Call the function to fetch and populate the table
    fetchAndPopulateSensorTable();

$('#sensorForm').on('submit', function (e) {
    e.preventDefault();

    const id = $('#id').val();
    const sensor = $('#sensor').val();
    const user = req.session.jobTitle
    const macAddress = $('#macAddress').val();
    const description = $('#description').val();
    const location = $('#location').val();
   
    fetch('/api/v0/location/new', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': '2-eb0c08b0-250a-4249-8a87-11141e2ff8fb'
      },
      body: JSON.stringify({
          id: id,
          sensorname: sensor,
          added_by: user,
          mac_address: macAddress,
          description: description,
          location: location
      }),
  })
  .then(response => {
    if (response.ok) {
        // Status 201 indicates successful creation
        return response.json();
    } else {
        return response.json().then(data => {
            throw new Error(data.message || `HTTP error! Status: ${response.status}`);
        });
    }
})
.then(data => {
    console.log(`Sensor added successfully. Message: ${data.message}`);
    alert('Sensor added successfully!');
    resetFormFields();
})
.catch(error => {
    console.error('Location not added successfully', error);
    // Handle error as needed
});
  });

  function populateLocationDropdown() {
    const locationDropdown = document.getElementById('locationDropdown');

    // Clear existing options
    locationDropdown.innerHTML = '';

    // Add a default option
    const defaultOption = document.createElement('option');
    defaultOption.text = 'Select a Location';
    defaultOption.value = '';
    locationDropdown.add(defaultOption);

    // Add locations as options
    locationsArray.forEach(location => {
        const option = document.createElement('option');
        option.text = location.location;
        option.value = location.id;
        locationDropdown.add(option);
    });
}

// Call the function to populate the dropdown when the page loads
populateLocationDropdown();