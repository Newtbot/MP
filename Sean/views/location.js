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

$(document).ready(function () {
    // Function to fetch and display locations
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
                // Clear existing table rows
                $('#locationTableBody').empty();
                locationArray = [];

                // Populate the table with location information
                locations.forEach(location => {
                    locationArray.push({
                        id: location.id,
                        name: location.name,
                        description: location.description
                    });

                    $('#locationTableBody').append(`
                        <tr>
                            <td>${location.id}</td>
                            <td>${location.name}</td>
                            <td>${location.description}</td>
                        </tr>
                    `);
                });
            })
            .catch(error => {
                console.error('Error fetching locations:', error);
                // Handle error as needed
            });
    }
    // Call the fetchLocations function when the page loads
    fetchLocations();
});

$('#locationForm').on('submit', function (e) {
    e.preventDefault();

    const location= DOMPurify.sanitize($('#location').val().trim());
    // Validate if the sanitized value is empty
    if (location === '') {
        alert('Location name cannot be empty');
        return;
    }
    const user = req.session.jobTitle
    const description= DOMPurify.sanitize($('#description').val().trim());
    // Validate if the sanitized value is empty
    if (description === '') {
        alert('description name cannot be empty');
        return;
    }
    fetch('/api/v0/location/new', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': '2-eb0c08b0-250a-4249-8a87-11141e2ff8fb'
      },
      body: JSON.stringify({
          name: location,
          added_by: user,
          description: description
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
    const selectedLocationId = DOMPurify.sanitize($('#locationDropdown').val().trim());

    // Validate if the selected location ID is empty
    if (selectedLocationId === '') {
        alert('Please select a location to update');
        return;
    }
    const location= DOMPurify.sanitize($('#location').val().trim());
    // Validate if the sanitized value is empty
    if (location === '') {
        alert('Location name cannot be empty');
        return;
    }
    const user = req.session.jobTitle
    const description= DOMPurify.sanitize($('#description').val().trim());
    // Validate if the sanitized value is empty
    if (description === '') {
        alert('description name cannot be empty');
        return;
    }
    fetch('/api/v0/location/update', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': '1-1ec4ce9d-bcff-46c4-a023-c34171b9ca51'
      },
      body: JSON.stringify({
          id:selectedLocationId,
          name: location,
          added_by: user,
          description: description
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
