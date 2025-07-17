(() => {
    "use strict";

    const form = document.querySelector(".needs-validation");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return; // Don't send the request
        }

        form.classList.add("was-validated");

        // Get data
        const username = document.querySelector("#floatingUsername").value;
        const email = document.querySelector("#floatingEmail").value;
        const password = document.querySelector("#floatingPassword").value;

        try {
            const response = await axios.post("http://localhost:3000/accounts", {
                username,
                email,
                password
            });

            console.log("Account created:", response.data);
            // User redirection here on success

        } catch (err) {
            if (err.response && err.response.status === 409) {
                // User already exists
                const usernameInput = document.querySelector("#floatingUsername");
                const usernameFeedback = document.querySelector("#usernameFeedback");
                usernameInput.classList.add("is-invalid");
                usernameFeedback.textContent = "This username is already taken.";

                const emailInput = document.querySelector("#floatingEmail");
                const emailFeedback = document.querySelector("#emailFeedback");
                emailInput.classList.add("is-invalid");
                emailFeedback.textContent = "This email is already used.";

            } else {
                console.error("Unexpected error:", err);
                alert("There was an error while creating your account. Please try again later.");
            }
        }
    });
})();
