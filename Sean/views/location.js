$(document).ready(function () {
    // Function to fetch and display locations
    function fetchLocations() {
        // Make a GET request to retrieve all locations
        fetch('/api/v0/location', {
            method: 'GET',
            headers: {
                'Authorization': '2-eb0c08b0-250a-4249-8a87-11141e2ff8fb'
            },
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

                // Populate the table with location information
                locations.forEach(location => {
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

$(document).ready(function () {
    $('#allLocationLink').on('click', function () {
      $('#locationContainer').show();
      $('#createLocationForm').hide();
    });
    $('#addLocationLink').on('click', function () {
        $('#locationContainer').hide();
        $('#createLocationForm').show();
      });
  });


$('#locationForm').on('submit', function (e) {
    e.preventDefault();

    const location = $('#location').val();
    const user = req.session.jobTitle
    const description = $('#description').val();
   
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
