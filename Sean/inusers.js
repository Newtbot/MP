const allUsers = <%- JSON.stringify(allUsers) %>;

document.getElementById('downloadButton').addEventListener('click', function () {
  console.log('Download button clicked');
  downloadExcel(allUsers);
});

document.getElementById('addUserLink').addEventListener('click', function () {
  document.getElementById('downloadButtonContainer').style.display = 'none';
  document.getElementById('userDataContainer').style.display = 'none';
  document.getElementById('createUserForm').style.display = 'block';
});

document.getElementById('userDataLink').addEventListener('click', function () {
  document.getElementById('downloadButtonContainer').style.display = 'block';
  document.getElementById('userDataContainer').style.display = 'block';
  document.getElementById('createUserForm').style.display = 'none';
});

document.getElementById('userForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Use FormData directly
    const formData = new FormData(document.getElementById('userForm'));

    // Check password complexity
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (!isStrongPassword(password)) {
      alert('Password does not meet complexity requirements. It must be at least 10 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one symbol.');
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match. Please enter the same password in both fields.');
      return;
    }

    // Make a fetch request
    fetch('/createUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.get('name'),
        username: formData.get('username'),
        email: formData.get('email'),
        password: password, // Use the validated password
        jobTitle: formData.get('jobTitle'),
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);

        // Show an alert with the received data
        alert(`User Registered!`);

        // Optionally, you can clear the form or take other actions after registration
        document.getElementById('userForm').reset();
      })
      .catch(error => {
        console.error('Fetch Error:', error);
      });
  });

  // Function to validate password complexity
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


    function downloadExcel(allUsers) {
      if (allUsers && allUsers.length > 0) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('All Users');
        const headers = ['Name', 'Username', 'Email', 'Password', 'Last Login', 'Job Title'];
        worksheet.addRow(headers);
        allUsers.forEach(user => {
          const rowData = [
            user.name || '',
            user.username || '',
            user.email || '',
            user.password || '',
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
