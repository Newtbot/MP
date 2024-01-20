require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') }) 


document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');

    // Set the new value for the access_key input field
    form.querySelector('input[name="access_key"]').value = process.env.emailKey;

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        // Create a FormData object to include the key
        const formData = new FormData(form);

        // Submit the form using fetch API
        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            // Handle the API response
            console.log(result);

            if (result.success) {
                // Form submitted successfully, display notification
                alert('Form submitted successfully!');
                location.reload()
            } else {
                // Form submission failed, display error notification
                alert('Form submission failed. Please try again.');
            }

        } catch (error) {
            //console.error('Error:', error);
        }
    });
});

