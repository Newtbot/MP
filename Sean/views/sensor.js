$(document).ready(function () {
    $('#allSensorLink').on('click', function () {
      $('#sensorContainer').show();
      $('#createSensorForm').hide();
      $('#additional-text4').hide();
    });
    $('#addSensorLink').on('click', function () {
        $('#sensorContainer').hide();
        $('#createSensorForm').show();
        $('#additional-text4').show();
      });
  });
  function populateTableAndArray(data, locationsArray) {
    const tableBody = document.getElementById("sensorTableBody");
    // Clear existing rows and array
    tableBody.innerHTML = "";
    sensorArray.length = 0;
    // Loop through the data and create table rows
    data.forEach(sensor => {
      const location = locationsArray.find(loc => loc.id === sensor.location);
  
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${sensor.id}</td>
        <td>${sensor.sensorname}</td>
        <td>${sensor.added_by}</td>
        <td>${sensor.description}</td>
        <td>${location ? location.name : 'Unknown Location'}</td>
      `;
      tableBody.appendChild(row);
      // Push sensor data to the array
      sensorArray.push(sensor);
    });
  }
  // Assuming locationsArray is defined elsewhere in your code
  populateTableAndArray(sensorData);
  console.log(sensorArray);

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
populateLocationDropdown();

$('#sensorForm').on('submit', function (e) {
    e.preventDefault();
       const sensor = $('#sensor').val();
       const user = req.session.jobTitle;
       const macAddress = $('#macAddress').val();
       const description = $('#description').val();
       const location = $('#location').val();
       const csrf_token = $('#userForm input[name="csrf_token"]').val();
   
    fetch('sensor/new', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          id: id,
          sensorname: sensor,
          added_by: user,
          mac_address: macAddress,
          description: description,
          location: location,
          csrf_token: csrf_token
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
