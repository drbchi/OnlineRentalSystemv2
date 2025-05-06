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

// Function to fetch and render room types
async function fetchRoomTypes() {
    try {
        const response = await fetch('http://localhost:3000/api/room-types');
        const roomTypes = await response.json();

        const propertySlider = document.querySelector('.property-slider');
        propertySlider.innerHTML = ''; // Clear existing content

        roomTypes.forEach(room => {
            const slide = document.createElement('div');
            slide.classList.add('property-slide');
            slide.innerHTML = `
                <img src="http://localhost:3000${room.image}" alt="${room.type}">
                <p>${room.type}</p>
            `;
            propertySlider.appendChild(slide);
        });
    } catch (error) {
        console.error('Error fetching room types:', error);
    }
}

async function fetchBestBookedPlaces() {
    try {
        const response = await fetch('http://localhost:3000/api/best-booked-places');
        const bestBookedPlaces = await response.json();

        const bestBookedSlider = document.querySelector('.bestbooked-slider');
        bestBookedSlider.innerHTML = ''; // Clear existing content

        bestBookedPlaces.forEach(place => {
            const slide = document.createElement('div');
            slide.classList.add('bestbooked-slide');
            slide.innerHTML = `
                <img src="http://localhost:3000${place.image}" alt="${place.type}">
                <p>${place.type} - ${place.location} ($${place.price}/night)</p>
            `;
            bestBookedSlider.appendChild(slide);
        });
    } catch (error) {
        console.error('Error fetching best booked places:', error);
    }
}

// Initialize sliders and fetch data on page load
document.addEventListener("DOMContentLoaded", () => {
    // Fetch and render room types
    fetchRoomTypes();

    // Fetch and render best booked places
    fetchBestBookedPlaces();

    // Horizontal Scroll for Best Booked Places
    const bestBookedSlider = document.querySelector(".bestbooked-slider");
    const bestBookedLeftButton = document.querySelector(".bestbooked-slide-button.left");
    const bestBookedRightButton = document.querySelector(".bestbooked-slide-button.right");

    bestBookedRightButton.addEventListener("click", () => {
        bestBookedSlider.scrollBy({ left: 220, behavior: "smooth" });
    });

    bestBookedLeftButton.addEventListener("click", () => {
        bestBookedSlider.scrollBy({ left: -220, behavior: "smooth" });
    });

    // Horizontal Scroll for Property Types (if needed)
    const propertySlider = document.querySelector(".property-slider");
    const propertyLeftButton = document.querySelector(".property-slide-button.left");
    const propertyRightButton = document.querySelector(".property-slide-button.right");

    propertyRightButton.addEventListener("click", () => {
        propertySlider.scrollBy({ left: 220, behavior: "smooth" });
    });

    propertyLeftButton.addEventListener("click", () => {
        propertySlider.scrollBy({ left: -220, behavior: "smooth" });
    });

    // Optional: Add click event for profile picture
    const profilePic = document.querySelector(".profile-pic");
    if (profilePic) {
        profilePic.addEventListener("click", () => {
            console.log("Profile picture clicked!");
            // window.location.href = "../user-profile/user-profile.html"; // Uncomment if you want to enforce redirection via JS
        });
    }
});