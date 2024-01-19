document.addEventListener("DOMContentLoaded", function () {
    function updateAdditionalInfo(region) {
        const infoContainer = document.getElementById("additional-info");
        // Replace the following with actual data retrieval based on the region
        const aqi = "15";
        const temperature = "25°C";
        const humidity = "60%";

        infoContainer.innerHTML = `
            <div class="additional-info-box">
                <h3>Additional Information - ${region}</h3>
                <div class="info-item">
                    <span class="info-label">Air Quality Index:</span>
                    <span class="info-value">${aqi}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Temperature:</span>
                    <span class="info-value">${temperature}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Humidity:</span>
                    <span class="info-value">${humidity}</span>
                </div>
            </div>
        `;

        // Remove the 'active' class from all info-box elements
        const infoBoxes = document.querySelectorAll('.info-box');
        infoBoxes.forEach(box => box.classList.remove('active'));

        // Add the 'active' class to the clicked info-box
        const clickedBox = document.getElementById(region.toLowerCase());
        clickedBox.classList.add('active');
    }

    const defaultRegion = "North";
    const defaultBox = document.getElementById(defaultRegion.toLowerCase());
    defaultBox.classList.add('active');
    const defaultAqi = "--"; // Replace with actual data retrieval
    updateAdditionalInfo(defaultRegion, defaultAqi);
    
    // Event listeners for each region's info-box
    document.getElementById("north").addEventListener("click", function () {
        const northAqi = "--"; // Replace with actual data retrieval
        updateAdditionalInfo("North", northAqi);
    });
    document.getElementById("south").addEventListener("click", function () {
        const southAqi = "--";
        updateAdditionalInfo("South", southAqi);
    });
    document.getElementById("east").addEventListener("click", function () {
        const eastAqi = "--";
        updateAdditionalInfo("East", eastAqi);
    });
    document.getElementById("west").addEventListener("click", function () {
        const westAqi = "--";
        updateAdditionalInfo("West", westAqi);
    });
    document.getElementById("central").addEventListener("click", function () {
        const centralAqi = "--";
        updateAdditionalInfo("Central", centralAqi);
    });

});


// Event listeners for each region's info-box
document.getElementById("north").addEventListener("click", function () {
    updateAdditionalInfo("North");
});

document.getElementById("south").addEventListener("click", function () {
    updateAdditionalInfo("South");
});

document.getElementById("east").addEventListener("click", function () {
    updateAdditionalInfo("East");
});

document.getElementById("west").addEventListener("click", function () {
    updateAdditionalInfo("West");
});

document.getElementById("central").addEventListener("click", function () {
    updateAdditionalInfo("Central");
});

