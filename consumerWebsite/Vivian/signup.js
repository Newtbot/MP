function validateForm() {
    var userid = document.getElementById('user_id').value;
    var username = document.getElementById('user_name').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
	var email = document.getElementById('email').value;

    // Perform basic validation
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
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
