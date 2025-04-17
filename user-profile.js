// Load user profile data
async function loadProfileData() {
    try {
        const response = await fetch("http://localhost:3000/api/user", {
            credentials: "include" // For session cookies
        });
        if (!response.ok) throw new Error("Not authenticated");
        const user = await response.json();

        // Update header
        document.getElementById("username").textContent = user.username || "User";
        document.getElementById("profile-pic").src = user.profilePic || "../images/default-profile.png";

        // Update profile section
        document.getElementById("profile-username").textContent = user.username || "User";
        document.getElementById("large-profile-pic").src = user.profilePic || "../images/default-profile.png";
        document.getElementById("profile-email").textContent = user.email || "Not provided";
        document.getElementById("profile-joined").textContent = user.joinedDate || "Unknown";
    } catch (error) {
        console.error("Error loading profile data:", error);
        window.location.href = "../login.html"; // Redirect to login if not authenticated
    }
}

// Load user bookings (example)
async function loadBookings() {
    try {
        const response = await fetch("http://localhost:3000/api/bookings", {
            credentials: "include"
        });
        if (!response.ok) throw new Error("Failed to fetch bookings");
        const bookings = await response.json();

        const bookingsList = document.getElementById("bookings-list");
        bookingsList.innerHTML = "";

        bookings.forEach(booking => {
            const item = document.createElement("div");
            item.classList.add("booking-item");
            item.innerHTML = `
                <img src="${booking.image || '../images/default-room.jpg'}" alt="${booking.roomType}">
                <p>${booking.roomType} - ${booking.location} (Booked: ${booking.date})</p>
            `;
            bookingsList.appendChild(item);
        });
    } catch (error) {
        console.error("Error loading bookings:", error);
        document.getElementById("bookings-list").innerHTML = "<p>No bookings found.</p>";
    }
}

// Handle edit profile button (placeholder)
function setupEditProfile() {
    const editBtn = document.querySelector(".edit-profile-btn");
    editBtn.addEventListener("click", () => {
        alert("Edit Profile functionality coming soon!"); // Replace with actual edit logic
    });
}

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
    loadProfileData();
    loadBookings();
    setupEditProfile();
});