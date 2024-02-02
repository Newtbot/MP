$(document).ready(function () {
    $('#allSensorLink').on('click', function () {
      $('#sensorContainer').show();
      $('#createSensorForm').hide();
      $('#additional-text4').hide();
      $('#updateSensorForm').hide();
      $('#deleteSensorForm').hide();
      $('#additional-text5').hide();
      $('#additional-text6').hide();
    });
    $('#addSensorLink').on('click', function () {
        $('#sensorContainer').hide();
        $('#createSensorForm').show();
        $('#additional-text4').show();
        $('#updateSensorForm').hide();
        $('#deleteSensorForm').hide();
        $('#additional-text5').hide();
        $('#additional-text6').hide();
      });
      $('#updateSensorLink').on('click', function () {
        $('#sensorContainer').hide();
        $('#createSensorForm').hide();
        $('#additional-text4').hide();
        $('#updateSensorForm').show();
        $('#deleteSensorForm').hide();
        $('#additional-text5').show();
        $('#additional-text6').hide();
      });
      $('#deleteSensorLink').on('click', function () {
        $('#sensorContainer').hide();
        $('#createSensorForm').hide();
        $('#additional-text4').hide();
        $('#updateSensorForm').hide();
        $('#deleteSensorForm').show();
        $('#additional-text5').hide();
        $('#additional-text6').show();
      });  

    
  });
  let locationArray = [];
  let sensorArray = [];
  populateLocationDropdown();

  function populateTableAndArray(data, locationsArray) {
    const tableBody = document.getElementById("sensorTableBody");
    // Clear existing rows and array
    tableBody.innerHTML = "";
    sensorArray.length = 0;
    // Loop through the data and create table rows
    data.forEach(sensor => {
      const location = locationsArray.find(loc => loc.id === sensor.locationid);
  
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${sensor.id}</td>
        <td>${sensor.name}</td>
        <td>${sensor.added_by}</td>
        <td>${sensor.mac_address}</td>
        <td>${sensor.description}</td>
        <td>${location ? location.name : 'Unknown Location'}</td>
      `;
      tableBody.appendChild(row);
      // Push sensor data to the array
      sensorArray.push(sensor);
    });
  }
  // Assuming locationsArray is defined elsewhere in your code
  populateTableAndArray(sensorData, locationsArray);

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
        option.text = location.name;
        option.value = location.id;
        locationDropdown.add(option);
    });
}


function populateSensorDropdown() {
  const sensorDropdown = document.getElementById('sensorDropdown');

  // Clear existing options
  sensorDropdown.innerHTML = '';

  // Add a default option
  const defaultOption = document.createElement('option');
  defaultOption.text = 'Select a Sensor';
  defaultOption.value = '';
  sensorDropdown.add(defaultOption);

  // Add locations as options
  sensorArray.forEach(sensor => {
      const option = document.createElement('option');
      option.text = sensor.name;
      option.value = sensor.id;
      sensorDropdown.add(option);
  });
}
populateSensorDropdown();


$('#sensorForm').on('submit', function (e) {
    e.preventDefault();
       const sensor = $('#sensor').val();
       const mac_address = $('#macAddress').val();
       const description = $('#description').val();
       const location = $('#locationDropdown').val();
       const csrf_token = $('#sensorForm input[name="csrf_token"]').val();
   
    fetch('/sensor/new', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          sensorname: sensor,
          added_by: user,
          mac_address: mac_address,
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
    alert('Sensor added successfully!');
})
.catch(error => {
    alert('Sensor not added successfully! Please ensure inputs are correctly entered');
});
  });

  function populateLocationDropdown2() {
    const locationDropdown = document.getElementById('locationDropdown2');
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
        option.text = location.name;
        option.value = location.id;
        locationDropdown.add(option);
    });
}
populateLocationDropdown2()
  $('#updateForm').on('submit', function (e) {
    e.preventDefault();
       const id = $('#sensorDropdown').val();
       const sensorname = $('#sensorname').val();
       const mac_address = $('#macAddress1').val();
       const description = $('#description1').val();
       const location = $('#locationDropdown2').val();
       const csrf_token = $('#updateForm input[name="csrf_token"]').val();
   
       console.log(csrf_token);
    fetch('/sensor/update', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          id: id,
          sensorname: sensorname,
          added_by: user,
          mac_address: mac_address,
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
    alert('Sensor updated successfully! ');
})
.catch(error => {
  alert('Sensor not updated successfully! Please ensure inputs are correctly entered');
    // Handle error as needed
});
  });

  function populateSensorDropdown2() {
    const sensorDropdown = document.getElementById('sensorDropdown2');
  
    // Clear existing options
    sensorDropdown.innerHTML = '';
  
    // Add a default option
    const defaultOption = document.createElement('option');
    defaultOption.text = 'Select a Sensor';
    defaultOption.value = '';
    sensorDropdown.add(defaultOption);
  
    // Add locations as options
    sensorArray.forEach(sensor => {
        const option = document.createElement('option');
        option.text = sensor.name;
        option.value = sensor.id;
        sensorDropdown.add(option);
    });
  }
  populateSensorDropdown2();
  $('#deleteForm').on('submit', function (e) {
    e.preventDefault();
    const selectedSensorId = $('#sensorDropdown2').val();
    const csrf_token = $('#deleteForm input[name="csrf_token"]').val();

    fetch('/sensor/delete', {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          id:selectedSensorId,
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
    alert('Sensor deleted successfully!');
})
.catch(error => {
    alert('Sensor not deleted successfully!');
});
  });

  function handleUserRoleAccess() {
    // Disable user creation, deletion, and password reset for non-admin users
    if (user !== 'admin') {
      document.getElementById('addSensorLink').style.display = 'none';
      document.getElementById('updateSensorLink').style.display = 'none';
      document.getElementById('deleteSensorLink').style.display = 'none';
      
    }
  
  }
  
  // Call the function to handle user role access when the page loads
  handleUserRoleAccess();