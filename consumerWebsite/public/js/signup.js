function validateFormSignup() {
    var username = document.getElementById('username').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;


    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        alert("Username can only contain letters and numbers.");
        return false;
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        alert("Enter a valid email address.");
        return false;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
        alert("Password must be more than 8 characters and contain at least 1 upper and lower case letter and 1 special character.");
        return false;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    if (!signupCheck.checked) {
        alert("Please accept the terms & conditions to proceed.");
        return false;
    }

    // If validation passes, send data to the server
    sendDataToServer(username, email, password);
}

function sendDataToServer(username, password) {
    // Use AJAX or fetch to send data to the server
    // Example using fetch:
    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
    })
        .then(response => response.json())
        .then(data => {
            // Handle the response from the server
            console.log(data);
        })
        .catch(error => console.error('Error:', error));
}
