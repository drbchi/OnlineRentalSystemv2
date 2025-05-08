// Function to open the date picker
function openDatePicker(id) {
    let inputField = document.getElementById(id);
    let rect = inputField.getBoundingClientRect(); // Get the position of the input field
    
    // Create a temporary date input
    let dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.style.position = "absolute";
    dateInput.style.opacity = 1;
    dateInput.style.zIndex = 1000;
    dateInput.style.background = "#fff";
    dateInput.style.border = "1px solid #ccc";
    dateInput.style.padding = "8px";
    dateInput.style.borderRadius = "5px";
    dateInput.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.1)";
    
    // Position below the input field
    dateInput.style.left = `${rect.left}px`;
    dateInput.style.top = `${rect.bottom + window.scrollY}px`;

    document.body.appendChild(dateInput);
    dateInput.focus(); // Focus on the date input

    // Update the input field when a date is selected
    dateInput.addEventListener("change", function () {
        inputField.value = dateInput.value;
        document.body.removeChild(dateInput);
    });

    // Clear input when using "Clear" button or manually deleting
    dateInput.addEventListener("input", function () {
        if (!dateInput.value) {
            inputField.value = ""; // Clear the main input field
        }
    });

    // Clear input when pressing Escape, Backspace, or Delete
    dateInput.addEventListener("keydown", function (event) {
        if (event.key === "Escape" || event.key === "Backspace" || event.key === "Delete") {
            inputField.value = ""; // Clear the main input field
        }
    });

    // Remove picker when clicking outside
    dateInput.addEventListener("blur", function () {
        if (!dateInput.value) {
            inputField.value = ""; // Ensure the main field is cleared when needed
        }
        document.body.removeChild(dateInput);
    });
}

// Function to handle search button click
function handleSearch() {
    const location = document.querySelector('.search-container input[type="text"]').value;
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const people = document.querySelector('.search-container input[type="number"]').value;

    // Basic validation
    if (!location || !checkin || !checkout || !people || PEOPLE < 1) {
        alert('Please fill in all fields and ensure the number of people is at least 1.');
        return;
    }

    // Validate dates
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today for comparison

    if (checkinDate < today) {
        alert('Check-in date cannot be in the past.');
        return;
    }

    if (checkoutDate <= checkinDate) {
        alert('Check-out date must be after check-in date.');
        return;
    }

    // Log search data (replace with actual logic, e.g., redirect or API call)
    console.log('Search Parameters:', {
        location,
        checkin,
        checkout,
        people
    });

    // Example: Redirect to stays page with query parameters (uncomment if needed)
    // window.location.href = `../staysSection/stays.html?location=${encodeURIComponent(location)}&checkin=${checkin}&checkout=${checkout}&people=${people}`;
}

// Initialize event listeners on page load
document.addEventListener("DOMContentLoaded", () => {
    // Attach search button event listener
    const searchButton = document.querySelector('.search-btn');
    if (searchButton) {
        searchButton.addEventListener('click', handleSearch);
    }
});