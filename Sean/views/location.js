$(document).ready(function () {
    $('#allLocationLink').on('click', function () {
      $('#locationContainer').show();
      $('#createLocationForm').hide();
      $('#updateLocationForm').hide();
      $('#deleteLocationForm').hide();
      $('#additional-text7').hide();
      $('#additional-text8').hide();
      $('#additional-text9').hide();
    });
    $('#addLocationLink').on('click', function () {
        $('#locationContainer').hide();
        $('#createLocationForm').show();
        $('#updateLocationForm').hide();
        $('#deleteLocationForm').hide();
        $('#additional-text7').show();
        $('#additional-text8').hide();
      $('#additional-text9').hide();
      });
      $('#updateLocationLink').on('click', function () {
        $('#locationContainer').hide();
        $('#createLocationForm').hide();
        $('#updateLocationForm').show();
        $('#deleteLocationForm').hide();
        $('#additional-text7').hide();
        $('#additional-text8').show();
      $('#additional-text9').hide();
      });
      $('#deleteLocationLink').on('click', function () {
        $('#locationContainer').hide();
        $('#createLocationForm').hide();
        $('#updateLocationForm').hide();
        $('#deleteLocationForm').show();
        $('#additional-text7').hide();
        $('#additional-text8').hide();
      $('#additional-text9').show();
      }); 
  });

  let locationArray = [];

  function populateTableAndArray(data) {
    const tableBody = document.getElementById("locationTableBody");

    // Clear existing rows and array
    tableBody.innerHTML = "";
    locationArray.length = 0;

    // Loop through the data and create table rows
    data.forEach(location => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${location.id}</td>
        <td>${location.name}</td>
        <td>${location.description}</td>
      `;
      tableBody.appendChild(row);

      // Push location data to the array
      locationArray.push(location);
    });
  }
  populateTableAndArray(locationsData);
  populateLocationDropdown();
  $('#locationForm').on('submit', function (e) {
    e.preventDefault();

    const location = $('#location').val();
    const description = $('#description').val();
    const csrf_token = $('#locationForm input[name="csrf_token"]').val();
    console.log (csrf_token);

    fetch('/location/new', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: location,
            added_by: user,
            description: description,
            csrf_token: csrf_token,
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
        alert('Location added successfully!');
    })
    .catch(error => {
        alert('Location not added successfully! Please ensure all inputs are correct');
    });
});

  function populateLocationDropdown() {
    // Clear existing options
    $('#locationDropdown').empty();

    // Populate the dropdown with options from locationArray
    locationArray.forEach(location => {
        $('#locationDropdown').append(`<option value="${location.id}">${location.name}</option>`);
    });
}
populateLocationDropdown();

  $('#updateForm').on('submit', function (e) {
    e.preventDefault();
    const selectedLocationId = $('#locationDropdown').val();
    const location= $('#locationname').val();
    const description= $('#description2').val();
    const csrf_token = $('#updateForm input[name="csrf_token"]').val();

    fetch('/location/update', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          id:selectedLocationId,
          name: location,
          added_by: user,
          description: description,
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
   
    alert('Location updated successfully!');
    
})
.catch(error => {
    alert('Location not updated successfully! Please ensure all inputs are correct');
});
  });

  function populateLocationDropdown2() {
    // Clear existing options
    $('#locationDropdown2').empty();

    // Populate the dropdown with options from locationArray
    locationArray.forEach(location => {
        $('#locationDropdown2').append(`<option value="${location.id}">${location.name}</option>`);
    });
}
populateLocationDropdown2();

  $('#deleteForm').on('submit', function (e) {
    e.preventDefault();
    const selectedLocationId = $('#locationDropdown2').val();
    const csrf_token = $('#deleteForm input[name="csrf_token"]').val();

    fetch('/location/delete', {
      method: 'delete',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          id:selectedLocationId,
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
    alert('Location deleted successfully!');
})
.catch(error => {
    
    alert('Location not deleted successfully!');
});
  });

  // Function to enable/disable actions based on user role
function handleUserRoleAccess() {
    // Disable user creation, deletion, and password reset for non-admin users
    if (user !== 'admin') {
      document.getElementById('addLocationLink').style.display = 'none';
      document.getElementById('updateLocationLink').style.display = 'none';
      document.getElementById('deleteLocationLink').style.display = 'none';
      
    }
  
  }
  
  // Call the function to handle user role access when the page loads
  handleUserRoleAccess();
  