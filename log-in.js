document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const fromParam = urlParams.get('from');
    if (fromParam) {
        document.getElementById("redirect_to").value = fromParam;
    }

    const loginBtn = document.querySelector(".login-btn");
    
    loginBtn.addEventListener("click", function () {
        loginBtn.style.transform = "scale(0.95)";
        setTimeout(() => loginBtn.style.transform = "scale(1)", 150);
    });
});