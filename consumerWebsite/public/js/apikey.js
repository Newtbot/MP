function generateKey() {
    // Create the overlay dynamically
    var overlay = document.createElement('div');
    overlay.className = 'overlay';

    // Create the small screen dynamically
    var generateKeyScreen = document.createElement('div');
    generateKeyScreen.className = 'generate-key-screen';

    // Generate random public and private keys
    var publicKey = generateRandomKey();
    var privateKey = generateRandomKey();

    // Add input fields for Name, Public Key, Private Key, Key Type, and Created
    generateKeyScreen.innerHTML = `
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required><br>

        <label for="publicKey">Public Key:</label>
        <input type="text" id="publicKey" name="publicKey" value="${publicKey}" readonly>
        <button onclick="copyToClipboard('publicKey')">Copy</button><br>

        <label for="privateKey">Private Key:</label>
        <input type="text" id="privateKey" name="privateKey" value="${privateKey}" readonly>
        <button onclick="copyToClipboard('privateKey')">Copy</button><br>

        <label for="created">Created:</label>
        <input type="text" id="created" name="created" value="${getCurrentDate()}" readonly><br>

        <button onclick="saveKey()">Save Key</button>
        <button onclick="closeGenerateKey()">Close</button>
    `;

    // Append the overlay and small screen to the body
    document.body.appendChild(overlay);
    document.body.appendChild(generateKeyScreen);

    // Display the overlay and small screen
    overlay.style.display = 'block';
    generateKeyScreen.style.display = 'block';
}

function generateRandomKey() {
    // Generate a random string as a key (you might want to use a more robust key generation method)
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function getCurrentDate() {
    // Get the current date and format it as 'YYYY-MM-DD'
    return new Date().toISOString().split('T')[0];
}

function copyToClipboard(elementId) {
    // Copy the text from the specified input field to the clipboard
    var element = document.getElementById(elementId);
    element.select();
    document.execCommand('copy');

    // Optionally, you can provide feedback to the user (e.g., display a tooltip)
    alert('Copied to clipboard: ' + element.value);
}


function saveKey() {
    // Retrieve values from input fields
    var name = document.getElementById('name').value;
    var publicKey = document.getElementById('publicKey').value;
    var privateKey = document.getElementById('privateKey').value;
    var created = document.getElementById('created').value;

    // Create a new table row with the key information
    var newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${name}</td>
        <td>${publicKey}</td>
        <td>${privateKey}</td>
        <td>${created}</td>
    `;

    // Append the new row to the table body
    var tableBody = document.querySelector('#content-get-api tbody');
    tableBody.appendChild(newRow);

    // Optionally, you can close the small screen
    closeGenerateKey();
}


function closeGenerateKey() {
    var overlay = document.querySelector('.overlay');
    var generateKeyScreen = document.querySelector('.generate-key-screen');

    // Hide and remove the overlay and small screen from the DOM
    overlay.style.display = 'none';
    generateKeyScreen.style.display = 'none';
    document.body.removeChild(overlay);
    document.body.removeChild(generateKeyScreen);
}
