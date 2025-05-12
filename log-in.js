document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(loginForm);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "login.php", true);

        xhr.onload = function () {
            if (xhr.status === 200) {
                const response = xhr.responseText.trim();

                if (response === "admin") {
                    Swal.fire("Welcome Admin!", "Redirecting to dashboard...", "success").then(() => {
                        window.location.href = "../admin/admin/admin.html";
                    });
                } else if (response === "owner") {
                    Swal.fire("Welcome Owner!", "Redirecting to property page...", "success").then(() => {
                        window.location.href = "../PropertyManagement/prop.html";
                    });
                } else if (response === "user") {
                    Swal.fire("Login Successful!", "Redirecting to your client area...", "success").then(() => {
                        window.location.href = "../Client/client.html";
                    });
                } else if (response === "incorrect_password") {
                    Swal.fire("Incorrect Password", "Please try again.", "error");
                } else if (response === "user_not_found") {
                    Swal.fire("User Not Found", "Please check your email or sign up.", "warning");
                } else {
                    Swal.fire("Error", "Something went wrong. Try again later.", "error");
                }
            }
        };

        xhr.send(formData);
    });
});
 
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const eyeIcon = document.getElementById(`eye-${inputId}`);

    if (input.type === "password") {
        input.type = "text";
        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");
    } else {
        input.type = "password";
        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");
    }
}
