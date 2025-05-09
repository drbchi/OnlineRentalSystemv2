
document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const fromParam = urlParams.get('from');
    if (fromParam) {
        document.getElementById("redirect_to").value = fromParam;
    }

    // Function to toggle password visibility
    function togglePasswordVisibility(inputId) {
        var inputField = document.getElementById(inputId);
        var type = inputField.type === "password" ? "text" : "password";
        inputField.type = type;
    }

    // Expose togglePasswordVisibility to the global scope
    window.togglePasswordVisibility = togglePasswordVisibility;

    // Handle form submission via AJAX
    document.getElementById("signup-form").addEventListener("submit", function(event) {
        event.preventDefault();

        var formData = new FormData(this);
        var password = formData.get('password');
        var confirmPassword = formData.get('confirm_password');

        // Validate password match
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        console.log("Submitting form data:", Object.fromEntries(formData));

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "sign-up.php", true);
        xhr.onload = function() {
            console.log("Response status:", xhr.status);
            console.log("Response text:", xhr.responseText);
            if (xhr.status === 200) {
                if (xhr.responseText.startsWith("success:")) {
                    const redirectUrl = xhr.responseText.split(':')[1];
                    alert("Account created successfully! Redirecting to login...");
                    setTimeout(function() {
                        window.location.href = redirectUrl;
                    }, 500);
                } else if (xhr.responseText === "email_exists") {
                    alert("Your email has already been used!");
                } else if (xhr.responseText.startsWith("sql_error")) {
                    alert("SQL error: " + xhr.responseText);
                } else if (xhr.responseText.startsWith("db_error")) {
                    alert("Database error: " + xhr.responseText);
                } else {
                    alert("Error: Could not create account. Response: " + xhr.responseText);
                }
            } else {
                alert("HTTP Error: " + xhr.status + " - " + xhr.statusText);
            }
        };
        xhr.onerror = function() {
            console.error("Request failed. Network error.");
            alert("Request failed. Please check your network connection.");
        };
        xhr.send(formData);
    });
});
=======
>>>>>>> main
