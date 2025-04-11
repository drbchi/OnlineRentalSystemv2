function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    input.type = input.type === "password" ? "text" : "password";
}

document.getElementById("signup-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirm_password");

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "sign-up.php", true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const response = xhr.responseText.trim();
            const role = formData.get("role");

            if (response === "success") {
                if (role === "owner") {
                    Swal.fire({
                        title: "Owner Account Created!",
                        text: "Would you like to list your property now?",
                        icon: "success",
                        showCancelButton: true,
                        confirmButtonText: "Yes, let's go!",
                        cancelButtonText: "Not now"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = "../PropertyManagement/prop.html"; // Adjust as needed
                        } else {
                            Swal.fire("No problem!", "You can list your property anytime from your dashboard.", "info");
                        }
                    });
                } else if(role =="user"){
                    Swal.fire("Welcome!", "Account created successfully!", "success").then(() => {
                        window.location.href = "../Client/client.html"; 
                    });

                } else if (role === "admin") {
                    Swal.fire("Admin Created!", "Redirecting to admin dashboard...", "success").then(() => {
                        window.location.href = "../admin/admin/admin.html"; 
                    });

                } else {
                    Swal.fire("Success", "Account created successfully!", "success").then(() => location.reload());
                }
                                    
            } else if (response === "email_exists") {
                Swal.fire("Oops!", "Your email has already been used!", "warning");
            } else if (response === "invalid_email") {
                Swal.fire("Invalid Email", "Please enter a valid email format.", "error");
            } else if (response === "weak_password") {
                Swal.fire("Weak Password", "Password must be at least 6 characters.", "error");
            } else {
                Swal.fire("Error", response, "error");
            }
        }
    };

    xhr.send(formData);
});
