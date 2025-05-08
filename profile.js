document.querySelector('.edit-profile-btn').addEventListener('click', function() {
    window.location.href = '../update-profile/edit-profile.html'; 
});

document.querySelector('.logout-btn').addEventListener('click', function() {
    alert('Logged out! Implement your logout logic here.');
});

document.querySelectorAll('.info-row').forEach(row => {
    row.addEventListener('click', function() {
        const text = this.querySelector('span:first-child').textContent;
        if (text === 'Privacy Policy') {
            window.location.href = '../update-profile/privacy-policy.html'; // Redirect to Privacy Policy page
        } else if (text === 'Terms and Conditions') {
            window.location.href = '../update-profile/terms-and-conditions.html'; // Redirect to Terms and Conditions page
        }
    });
});