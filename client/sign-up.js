(() => {
    "use strict";
    let redirectLocation = "account.html"
    const form = document.querySelector(".needs-validation");
    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get("source");
    if (source == "login") {
        document.querySelector("#title-text").textContent = "Such account doesn't exist! Register first!"
    }
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        event.stopPropagation();

        // Get elements and values
        const usernameInput = document.querySelector("#floatingUsername");
        const emailInput = document.querySelector("#floatingEmail");
        const passwordInput = document.querySelector("#floatingPassword");
        const checkbox = document.getElementById("checkDefault");

        const usernameFeedback = document.querySelector("#usernameFeedback");
        const emailFeedback = document.querySelector("#emailFeedback");
        const passwordFeedback = document.querySelector("#passwordFeedback");

        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const rememberMe = checkbox.checked;

        let isValid = true;

        // Reset previous errors
        usernameInput.classList.remove("is-invalid");
        emailInput.classList.remove("is-invalid");
        passwordInput.classList.remove("is-invalid");

        // Username: 4-31 characters
        if (username.length < 3 || username.length > 32) {
            usernameInput.classList.remove("is-valid");
            usernameInput.classList.add("is-invalid");
            usernameFeedback.textContent = "Username must be between 4 and 31 characters including both.";
            isValid = false;
        }

        // Password: 9-31 characters
        if (password.length < 8 || password.length > 32) {
            passwordInput.classList.remove("is-valid");
            passwordInput.classList.add("is-invalid");
            passwordFeedback.textContent = "Password must be between 7 and 31 characters including both.";
            isValid = false;
        }

        // Email: simple check
        if (
            email.length < 6 ||
            email.length > 64 ||
            !email.includes("@") ||
            !email.includes(".") ||
            email.indexOf("@") === 0 ||
            email.lastIndexOf(".") < email.indexOf("@") // There must be "." after "@" sign
        ) {
            // Invalid email
            emailInput.classList.remove("is-valid");
            emailInput.classList.add("is-invalid");
            emailFeedback.textContent = "Please enter a valid email address.";
            isValid = false;
        }

        if (!isValid) {
            form.classList.add("was-validated");
            return; // stop submit
        }

        form.classList.add("was-validated");

        try {
            const response = await axios.post("http://localhost:3000/register", {
                username,
                email,
                password,
                rememberMe
            });

            console.log("Account created:", response.data);
            location.href = redirectLocation;

        } catch (err) {
            if (err.response && err.response.status === 409) {
                usernameInput.classList.add("is-invalid");
                usernameFeedback.textContent = "This username is already taken.";

                emailInput.classList.add("is-invalid");
                emailFeedback.textContent = "This email is already used.";
            } else {
                console.error("Unexpected error:", err);
                alert("There was an error while creating your account. Please try again later.");
            }
        }
    });
})();
