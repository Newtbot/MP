$(document).ready(function () {
    $('#allLocationLink').on('click', function () {
      $('#locationContainer').show();
      $('#createLocationForm').hide();
      $('#updateLocationForm').hide();
    });
    $('#addLocationLink').on('click', function () {
        $('#locationContainer').hide();
        $('#createLocationForm').show();
        $('#updateLocationForm').hide();
      });
      $('#updateLocationLink').on('click', function () {
        $('#locationContainer').hide();
        $('#createLocationForm').hide();
        $('#updateLocationForm').show();
        populateLocationDropdown();
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
        <td>${location.location}</td>
        <td>${location.description}</td>
      `;
      tableBody.appendChild(row);

      // Push location data to the array
      locationArray.push(location);
    });
  }
  populateTableAndArray(locationsData);
  console.log(locationArray);

$('#locationForm').on('submit', function (e) {
    e.preventDefault();

    const location= $('#location').val();
    const user = req.session.jobTitle
    const description= $('#description').val();
    const csrf_token = $('#userForm input[name="csrf_token"]').val();
   
    fetch('/location/new', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
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
    console.log(`Location added successfully. Message: ${data.message}`);
    alert('Location added successfully!');
    resetFormFields();
})
.catch(error => {
    console.error('Location not added successfully', error);
    // Handle error as needed
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

  $('#updateForm').on('submit', function (e) {
    e.preventDefault();
    const selectedLocationId = $('#locationDropdown').val();
    const location= $('#location').val();
    const user = req.session.jobTitle
    const description=$('#description').val();
    const csrf_token = $('#userForm input[name="csrf_token"]').val();

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
    console.log(`Location uppdated successfully. Message: ${data.message}`);
    alert('Location updated successfully!');
    resetFormFields();
})
.catch(error => {
    console.error('Location not updated successfully', error);
    // Handle error as needed
});
  });
