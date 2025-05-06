document.getElementById('edit-profile-form').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Profile updated! Implement your save logic here.');
});

document.querySelector('.cancel-btn').addEventListener('click', function() {
    alert('Cancelled! Redirect to profile page if needed.');
});

// Assume the user ID is stored or retrieved (e.g., from a session or token)
// For this example, hardcode a user ID; in a real app, get this dynamically
const userId = '1'; // Replace with actual user ID (e.g., from session or auth token)

// Fetch user data to pre-fill the form
async function fetchUserData() {
    try {
        const response = await fetch(`http://localhost/your_project_folder/update_profile.php?id=${userId}`, {
            method: 'GET',
        });
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        if (data.user) {
            document.getElementById('fullName').value = data.user.full_name || '';
            document.getElementById('email').value = data.user.email || '';
        } else {
            alert('User not found');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        alert('Failed to load user data. Please try again.');
    }
}

// Call fetchUserData when the page loads
document.addEventListener('DOMContentLoaded', fetchUserData);

// Handle form submission to update profile
document.getElementById('edit-profile-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;

    try {
        const response = await fetch('http://localhost/your_project_folder/update_profile.php', {
            method: 'PUT', // or 'POST' depending on your testing setup
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: userId, fullName, email }),
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            // Optionally redirect back to profile page
            window.location.href = 'profile.html';
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.');
    }
});

// Cancel button functionality
document.querySelector('.cancel-btn').addEventListener('click', function() {
    window.location.href = 'profile.html'; // Redirect to profile page
});