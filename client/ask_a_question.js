(() => {
    "use strict";

    const form = document.querySelector(".needs-validation");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        event.stopPropagation();

        // Get elements and values
        const firstNameInput = document.querySelector("#firstName");
        const lastNameInput = document.querySelector("#lastName");
        const languageInput = document.querySelector("#language")
        const questionInput = document.querySelector("#question");

        const firstNameFeedback = document.querySelector("#firstName-feedback");
        const lastNameFeedback = document.querySelector("#lastName-feedback");
        const languageFeedback = document.querySelector("#language-feedback");
        const questionFeedback = document.querySelector("#question-feedback");

        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const language = languageInput.value;
        const question = questionInput.value.trim();

        let isValid = true;

        // Reset previous errors
        firstNameInput.classList.remove("is-invalid");
        lastNameInput.classList.remove("is-invalid");
        languageInput.classList.remove("is-invalid");
        questionInput.classList.remove("is-invalid");

        // First name: 3-31 characters
        if (firstName.length < 2 || firstName.length > 32) {
            firstNameInput.classList.remove("is-valid");
            firstNameInput.classList.add("is-invalid");
            firstNameFeedback.textContent = "First name must be between 3 and 31 characters including both.";
            isValid = false;
        }

        // Last name: 9-31 characters
        if (lastName.length < 2 || lastName.length > 32) {
            lastNameInput.classList.remove("is-valid");
            lastNameInput.classList.add("is-invalid");
            lastNameFeedback.textContent = "Last name must be between 3 and 31 characters including both.";
            isValid = false;
        }
        // Language must be not 0:
        if (language === 0) {
            languageInput.classList.remove("is-valid");
            languageInput.classList.add("is-invalid");
            isValid = false;
        }
        // Question: 6-350 characters
        if (question.length < 7 || question.length > 351) {
            questionInput.classList.remove("is-valid");
            questionInput.classList.add("is-invalid");
            questionFeedback.textContent = "Question must be between 6 and 350 characters including both.";
            isValid = false;
        }
        if (!isValid) {
            form.classList.add("was-validated");
            return; // stop submit
        }

        form.classList.add("was-validated");

        try {
            const response = await axios.post("http://localhost:3000/questions", {
                firstName,
                lastName,
                language,
                question
            });
            if (response.status === 204) {
                window.location.href = "sign-in.html?source=question";
            }
            console.log("Question has been submitted succesfully");
            location.href = "submitted.html"

        } catch (err) {
            console.error("Unexpected error:", err);
            alert("There was an error while submitting your question. Please try again later.");
        }
    });
})();
