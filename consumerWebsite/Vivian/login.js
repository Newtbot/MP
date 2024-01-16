function validateForm() {
    var username = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    // Perform basic validation
    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }

    // If validation passes, send data to the server
    sendDataToServer(email, password);
}

function sendDataToServer(email, password) {
    // Use AJAX or fetch to send data to the server
    // Example using fetch:
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response from the server
        console.log(data);
        if (data.success) {
            // Redirect or perform other actions for successful login
            alert('Login successful');
        } else {
            alert('Login failed. Please check your credentials.');
        }
    })
    .catch(error => console.error('Error:', error));
}
