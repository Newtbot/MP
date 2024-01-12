

$(document).ready(function () {
  $('#resetPasswordLink').on('click', function () {
    $('#resetPasswordFormContainer').show();
    $('#createUserForm').hide();
    $('#userDataContainer').hide();
    $('#downloadButtonContainer').hide();
    $('#deleteUserContainer').hide();
    $('#logsContainer').hide();
  });

  $('#addUserLink').on('click', function () {
    $('#resetPasswordFormContainer').hide();
    $('#createUserForm').show();
    $('#userDataContainer').hide();
    $('#downloadButtonContainer').hide();
    $('#deleteUserContainer').hide();
    $('#logsContainer').hide();
  });

  $('#userDataLink').on('click', function () {
    $('#resetPasswordFormContainer').hide();
    $('#createUserForm').hide();
    $('#userDataContainer').show();
    $('#downloadButtonContainer').show();
    $('#deleteUserContainer').hide();
    $('#logsContainer').hide();
  });

  $('#searchUserButton').on('click', function () {
  console.log('Search button clicked');
  const searchUsername = $('#searchUserInput').val();
  // Call the function to search for the user
  searchUser(searchUsername);
});

$('#deleteUserLink').on('click', function () {
$('#deleteUserContainer').show();
  $('#resetPasswordFormContainer').hide();
    $('#createUserForm').hide();
    $('#userDataContainer').hide();
    $('#downloadButtonContainer').hide();
    $('#logsContainer').hide();
});

$('#downloadButton').on('click', function () {
  // Call the downloadExcel function with the allUsers data
  downloadExcel(allUsers);
});
$('#logsLink').on('click', function () {
  // Hide other containers
  $('#resetPasswordFormContainer').hide();
  $('#createUserForm').hide();
  $('#userDataContainer').hide();
  $('#downloadButtonContainer').hide();
  $('#deleteUserContainer').hide();

  // Show logs container
  $('#logsContainer').show();

  fetchLogs();
});
function fetchLogs() {
  // Make a fetch request to your server endpoint for logs
  fetch('/api/getLogs')
    .then(response => response.json())
    .then(logs => {
      // Process and display logs in the logs container
      displayLogs(logs);
    })
    .catch(error => {
      console.error('Error fetching logs:', error);
      // Handle errors, e.g., display an alert
    });
}

// Update the displayLogs function to generate a table
function displayLogs(logs) {
  const logsContainer = $('#logsContainer');

  // Clear previous logs
  logsContainer.empty();

  if (logs && logs.length > 0) {
    // Create the table and header row
    const table = $('<table>').addClass('logs-table');
    const headerRow = '<tr><th>ID</th><th>Username</th><th>Activity</th><th>Timestamp</th></tr>';
    table.append(headerRow);

    // Add each log as a row in the table
    logs.forEach(log => {
      const row = `<tr><td>${log.id}</td><td>${log.username}</td><td>${log.activity}</td><td>${log.timestamp}</td></tr>`;
      table.append(row);
    });

    // Append the table to the logsContainer
    logsContainer.append(table);

    // Add a download button at the top with the current date and time in the file name
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    const formattedTime = currentDate.toTimeString().split(' ')[0].replace(/:/g, '-');
    const downloadButton = $('<button>').text('Download Log').on('click', function () {
      downloadLogs(logs, `log_${formattedDate}_${formattedTime}.csv`);
    });

    // Prepend the download button to the logsContainer
    logsContainer.prepend(downloadButton);
  } else {
    // Display a message if no logs are available
    logsContainer.html('<p>No logs available.</p>');
  }
}

function downloadLogs(logs, filename) {
  if (logs && logs.length > 0) {
    const csvContent = 'data:text/csv;charset=utf-8,';
    const header = 'ID,Username,Activity,Timestamp\n';
    const rows = logs.map(log => `${log.id},${log.username},${log.activity},"${log.timestamp}"`).join('\n');
    const data = header + rows;
    const encodedData = encodeURI(csvContent + data);

    // Create a hidden anchor element to trigger the download
    const link = document.createElement('a');
    link.setAttribute('href', encodedData);
    link.setAttribute('download', 'logs.csv');
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Remove the link from the DOM
    document.body.removeChild(link);
  } else {
    console.error('No logs available for download.');
  }
}
});

function searchUser(username) {
  fetch(`/api/searchUser?username=${username}`)  // Add the /api prefix here
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    })
    .then(users => {
      // Display search results
      displaySearchResults(users);
    })
    .catch(error => {
      console.error('Search error:', error);
      // Handle errors, e.g., display an alert
    });
}

// Function to display search results
function displaySearchResults(users) {
  const searchResultsList = $('#searchResultsList');

  // Clear previous results
  searchResultsList.empty();

  if (users && users.length > 0) {
    users.forEach(user => {
      const listItem = `<li>${user.username} - <button class="deleteUserButton" data-username="${user.username}">Delete</button></li>`;
      searchResultsList.append(listItem);
    });

    // Show the search results container
    $('#searchResultsContainer').show();
  } else {
    // Hide the search results container if no results
    $('#searchResultsContainer').hide();
  }
}
// Event listener for delete user button in search results
$('#searchResultsList').on('click', '.deleteUserButton', function () {
  const usernameToDelete = $(this).data('username');
  console.log('Before fetch for user deletion');
  // Make a fetch request to delete the user
  fetch(`/api/deleteUser/${usernameToDelete}`, {
    method: 'DELETE',
  })
  .then(response => {
    console.log('Inside fetch response handler');
    if (response.ok) {
      // Assuming your server sends a JSON response
      return response.json();
    } else {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  })
  .then(data => {
    console.log('User deletion success:', data);
    alert('User deleted successfully');
    $('#searchResultsContainer').hide();
  })
  .catch(error => {
    console.error('User deletion error:', error);
    alert('Failed to delete user. Please try again.');
    // Handle errors, e.g., display an alert
  });
});


function downloadExcel(allUsers) {
  if (allUsers && allUsers.length > 0) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('All Users');
    const headers = ['Name', 'Username', 'Email', 'Last Login', 'Job Title'];
    worksheet.addRow(headers);
    allUsers.forEach(user => {
      const rowData = [
        user.name || '',
        user.username || '',
        user.email || '',
        user.lastLogin ? new Date(user.lastLogin).toLocaleString('en-US', { timeZone: 'Asia/Singapore' }) : '',
        user.jobTitle || ''
      ];
      worksheet.addRow(rowData);
    });
    workbook.xlsx.writeBuffer().then(buffer => {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];
      const formattedTime = currentDate.toTimeString().split(' ')[0].replace(/:/g, '-');
      const fileName = `user_data_${formattedDate}_${formattedTime}.xlsx`;
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs(blob, fileName);
    });
  } else {
    console.error('No data available for download.');
  }
}

function isStrongPassword(password) {
  // Password must be at least 10 characters long
  if (password.length < 10) {
    return false;
  }

  // Password must contain at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return false;
  }

  // Password must contain at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return false;
  }

  // Password must contain at least one digit
  if (!/\d/.test(password)) {
    return false;
  }

  // Password must contain at least one symbol
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return false;
  }

  return true;
}



function resetFormFields() {
        $('#name').val('');
        $('#username').val('');
        $('#email').val('');
        $('#password').val('');
        $('#confirmPassword').val('');
        $('#jobTitle').val('');
      }


      $('#userForm').on('submit', function (e) {
      e.preventDefault();

      const name = $('#name').val();
      const username = $('#username').val();
      const email = $('#email').val();
      const password = $('#password').val();
      const confirmPassword = $('#confirmPassword').val();
      const jobTitle = $('#jobTitle').val();

      if (password !== confirmPassword) {
        alert('Passwords do not match. Please enter the same password in both fields.');
        return;
      }

      if (!isStrongPassword(password)) {
        alert('Password does not meet complexity requirements. It must be at least 10 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one symbol.');
        return;
      }

      fetch('/createUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          username: username,
          email: email,
          password: password,
          jobTitle: jobTitle,
        }),
      })
        .then(response => {
          if (response.status === 201) {
            // Status 201 indicates successful creation
            return response.json();
          } else {
            return response.json().then(data => {
              throw new Error(data.error || `HTTP error! Status: ${response.status}`);
            });
          }
        })
        .then(data => {
          console.log('User registration success:', data);
          alert('User registered successfully!');
          resetFormFields();
        })
        .catch(error => {
          console.error('User registration error:', error);
          handleRegistrationError(error);
        });
    });

function handleRegistrationError(error) {
  console.error('Registration error:', error); // Log the full error object for debugging

  let errorMessage;

  if (typeof error === 'string') {
    errorMessage = error;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (error.response && error.response.data && error.response.data.error) {
    errorMessage = error.response.data.error;
  } else {
    errorMessage = 'Unknown error';
  }

  if (errorMessage.includes('Username is already taken')) {
    alert('Username is already taken. Please choose a different username.');
  } else if (errorMessage.includes('Email is already in use')) {
    alert('Email is already in use. Please choose a different email.');
  } else if (errorMessage.includes('Password does not meet complexity requirements')) {
    alert('Password does not meet complexity requirements. It must be at least 10 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one symbol.');
  } else if (errorMessage.includes('User registration failed')) {
    alert('User registration failed. Please try again.');
  } else {
    alert(`Unknown error: ${errorMessage}`);
  }
}

$('#resetPasswordForm').on('submit', function (e) {
  e.preventDefault();

  // Get values from the form
  const username = $('#resetUsername').val();
  const password = $('#resetPassword').val();
  const confirmPassword = $('#resetConfirmPassword').val();

  console.log('Username:', username);
  console.log('New Password:', password);

  // Validate passwords
  if (password !== confirmPassword) {
    alert('Error: Passwords do not match. Please enter the same password in both fields.');
    return;
  }

  // Check if the new password meets complexity requirements
  if (!isStrongPassword(password)) {
    alert('Error: Password does not meet complexity requirements. It must be at least 10 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one symbol.');
    return;
  }

  // Make a fetch request
  fetch('/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
        confirmPassword: confirmPassword,
      }),
    })
    .then(response => {
      if (!response.ok) {
        return response.text().then(errorText => {
          throw new Error(`HTTP error! Status: ${response.status}, Error: ${errorText}`);
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);

      // Show an alert with the received data
      alert(data.success || data.error || 'Password change status unknown');

      // Optionally, you can clear the form or take other actions after the password change
      $('#resetUsername').val('');
      $('#resetPassword').val('');
      $('#resetConfirmPassword').val('');

      // You might want to hide the reset password form after submission
      $('#resetPasswordFormContainer').hide();
    })
    .catch(error => {
      // Handle 404 error separately to show an alert
      if (error.message.includes('HTTP error! Status: 404')) {
        alert('Error: User not found. Please enter a valid username.');
      } else {
        console.error('Fetch Error:', error);
      }
    });
});



  

