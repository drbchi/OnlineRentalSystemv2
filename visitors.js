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

// Rest of your existing code (openDatePicker, sliders, etc.) remains unchanged

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
});


document.addEventListener("DOMContentLoaded", () => {
    const authButtons = document.querySelector(".auth-buttons");
    const userEmail = localStorage.getItem("userEmail");

    if (userEmail && authButtons) {
        // Clear the existing Register and Sign In buttons
        authButtons.innerHTML = "";

        // Get first letter of email
        const firstLetter = userEmail.charAt(0).toUpperCase();

        // Create a profile circle
        const profileCircle = document.createElement("div");
        profileCircle.textContent = firstLetter;
        profileCircle.style.width = "35px";
        profileCircle.style.height = "35px";
        profileCircle.style.borderRadius = "50%";
        profileCircle.style.backgroundColor = "purple";
        profileCircle.style.color = "white";
        profileCircle.style.display = "flex";
        profileCircle.style.justifyContent = "center";
        profileCircle.style.alignItems = "center";
        profileCircle.style.fontWeight = "bold";
        profileCircle.style.fontSize = "16px";
        profileCircle.style.cursor = "pointer";
        profileCircle.title = "Click to log out";

        profileCircle.addEventListener("click", () => {
            const modal = document.getElementById("profileModal");
            if (modal) {
                modal.style.display = "block";
            }
        });
        
        authButtons.appendChild(profileCircle);
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("search-btn");
    if (searchButton) {
        searchButton.addEventListener("click", function () {
            const location = document.getElementById("location-input").value.trim();
            const checkin = document.getElementById("checkin").value;
            const checkout = document.getElementById("checkout").value;
            const people = document.getElementById("people-input").value;

            // ✅ Validate date order
            if (checkin && checkout) {
                const checkinDate = new Date(checkin);
                const checkoutDate = new Date(checkout);

                if (checkinDate >= checkoutDate) {
                    alert("❌ Check-in date should be before check-out date.");
                    return; // Stop redirect if invalid
                }
            }

            const query = new URLSearchParams({
                location: location,
                checkin: checkin,
                checkout: checkout,
                people: people
            });

            // Redirect to stays.html with parameters
            window.location.href = `../staysSection/stays.html?${query.toString()}`;
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("profileModal");
    const closeBtn = document.querySelector(".close-profile-modal");

    if (modal && closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });

        window.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });
    }
});


  document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("profileModal");
    const closeBtn = document.querySelector(".close-profile-modal");

    if (modal && closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });

        window.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });
    }
});

  



// ✅ 1. Define the function
async function checkBookingNotification() {
    console.log("🔍 Checking for booking notification...");

    try {
        // Bust cache and fetch notification.json
        const response = await fetch("../bookingpage/notification.json?" + new Date().getTime(), {
            cache: "no-cache"
        });

        if (!response.ok) {
            console.log("❌ Failed to fetch notification.json");
            return;
        }

        const data = await response.json();
        console.log("✅ Notification data fetched:", data);

        // Get timestamp from localStorage or default to 0
        const lastShown = Number(localStorage.getItem("lastNotificationTime")) || 0;
        console.log("🕒 lastShown:", lastShown, "| data.timestamp:", data.timestamp);

        // Only show alert if new notification is found
        if (lastShown < data.timestamp) {
            alert(`🎉 Booking Successful!\n\nRoom: ${data.room_title}\nCheck-in: ${data.checkin}\nCheck-out: ${data.checkout}`);
            localStorage.setItem("lastNotificationTime", data.timestamp);
        } else {
            console.log("ℹ️ No new booking notification to show.");
        }
    } catch (error) {
        console.log("❌ Error fetching notification:", error);
    }
}

// ✅ 2. Call it once DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    checkBookingNotification();
});






