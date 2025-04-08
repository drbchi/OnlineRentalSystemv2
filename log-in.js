document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.querySelector(".login-btn");
    const emailLoginBtn = document.querySelector(".email-login-btn");
    
    loginBtn.addEventListener("click", function () {
        loginBtn.style.transform = "scale(0.95)";
        setTimeout(() => loginBtn.style.transform = "scale(1)", 150);
    });

    emailLoginBtn.addEventListener("click", function () {
        emailLoginBtn.style.transform = "scale(0.95)";
        setTimeout(() => emailLoginBtn.style.transform = "scale(1)", 150);
    });
});
