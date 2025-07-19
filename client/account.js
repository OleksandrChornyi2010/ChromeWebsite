document.querySelectorAll('#sidebar a').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.dataset.target;

        // Remove active class from all links
        document.querySelectorAll('#sidebar a').forEach(l => l.classList.remove('active'));
        this.classList.add('active');

        // Hide all sections
        document.querySelectorAll('section').forEach(sec => sec.classList.add('d-none'));

        // Show needed section
        document.getElementById(targetId).classList.remove('d-none');
    });
});

window.addEventListener('userSessionReady', () => {
    console.log("UserSession:", window.userSession);
    document.querySelector("#header-text").textContent = window.userSession.username
});

(() => {
    "use strict";

    const form = document.querySelector(".needs-validation");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        event.stopPropagation();

        // Get elements and values
        const newPasswordInput = document.querySelector("#newPassword-input");

        const newPasswordFeedback = document.querySelector("#newPassword-feedback");

        const newPassword = newPasswordInput.value.trim();

        let isValid = true;

        // Reset previous errors
        newPasswordInput.classList.remove("is-invalid");

        // Password: 7-31 characters
        if (newPassword.length < 8 || newPassword.length > 32) {
            newPasswordInput.classList.remove("is-valid");
            newPasswordInput.classList.add("is-invalid");
            newPasswordFeedback.textContent = "Password must be between 7 and 31 characters including both.";
            isValid = false;
        }
        if (!isValid) {
            form.classList.add("was-validated");
            return; // stop submit
        }

        form.classList.add("was-validated");

        try {
            const response = await axios.post("http://localhost:3000/change-password", {
                newPassword
            });
            console.log("Password has been changed succesfully");
            location.href = "password-update.html"

        } catch (err) {
            console.error("Unexpected error:", err);
            alert("There was an error while changing your password. Please try again later.");
        }
    });
})();