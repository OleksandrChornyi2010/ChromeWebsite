import { checkName, checkQuestion } from "./utils/checks"

// Get elements and values
const firstNameInput = document.querySelector("#firstName")
const lastNameInput = document.querySelector("#lastName")
const languageInput = document.querySelector("#language")
const questionInput = document.querySelector("#question")
const titleText = document.querySelector("#title-text")
const secondaryText = document.querySelector("#secondary-text")
const actionButton = document.getElementById("action-button")

const firstNameFeedback = document.querySelector("#firstName-feedback")
const lastNameFeedback = document.querySelector("#lastName-feedback")
const languageFeedback = document.querySelector("#language-feedback")
const questionFeedback = document.querySelector("#question-feedback")

const firstName = firstNameInput.value.trim()
const lastName = lastNameInput.value.trim()
const language = languageInput.value
const question = questionInput.value.trim()

const urlParams = new URLSearchParams(window.location.search)
const type = urlParams.get("type")

if (type === "overview") {
    await initOverview(urlParams.get("id"))
}
else {
    init()
}

function init() {

    const form = document.querySelector(".needs-validation")
    form.addEventListener("submit", async (event) => {
        const firstName = firstNameInput.value.trim()
        const lastName = lastNameInput.value.trim()
        const language = languageInput.value
        const question = questionInput.value.trim()
        event.preventDefault()
        event.stopPropagation()

        let isValid = true

        // Reset previous errors
        firstNameInput.classList.remove("is-invalid")
        lastNameInput.classList.remove("is-invalid")
        languageInput.classList.remove("is-invalid")
        questionInput.classList.remove("is-invalid")

        if (checkName(firstName)) {
            firstNameInput.classList.remove("is-valid")
            firstNameInput.classList.add("is-invalid")
            firstNameFeedback.textContent =
                "First name must be between 2 and 32 characters including both."
            isValid = false
        }

        if (checkName(lastName)) {
            lastNameInput.classList.remove("is-valid")
            lastNameInput.classList.add("is-invalid")
            lastNameFeedback.textContent =
                "Last name must be between 2 and 32 characters including both."
            isValid = false
        }
        // Language must be not 0:
        if (language === 0) {
            languageInput.classList.remove("is-valid")
            languageInput.classList.add("is-invalid")
            isValid = false
        }

        if (checkQuestion(question)) {
            questionInput.classList.remove("is-valid")
            questionInput.classList.add("is-invalid")
            questionFeedback.textContent =
                "Question must be between 6 and 350 characters including both."
            isValid = false
        }
        if (!isValid) {
            form.classList.add("was-validated")
            return // stop submit
        }

        form.classList.add("was-validated")

        try {
            const response = await axios.post(
                `${window.API_URL}/submit-question`,
                {
                    firstName,
                    lastName,
                    language,
                    question,
                },
            )
            if (response.status === 403) {
                const params = new URLSearchParams({
                    type: "login",
                    source: "question"
                })
                window.location.href = "auth.html?" + params.toString()
            }
            console.log("Question has been submitted succesfully")
            const params = new URLSearchParams({
                type: "submitted"
            })
            window.location.href = "info.html?" + params.toString()
        } catch (err) {
            console.error("Unexpected error:", err)
            alert(
                "There was an error while submitting your question. Please try again later.",
            )
        }
    })
}

async function initOverview(id) {

    actionButton.addEventListener("click", deleteQuestion)

    try {
        const response = await axios.get(`${window.API_URL}/get-question`, {
            params: { id },
        })
        if (response.status === 403) {
            const params = new URLSearchParams({
                type: "login",
                source: "question"
            })
            window.location.href = "auth.html?" + params.toString()
        }
        firstNameInput.value = response.data[0].first_name
        lastNameInput.value = response.data[0].last_name

        for (const option of languageInput.options) {
            if (
                option.textContent.trim() === response.data[0].language.trim()
            ) {
                option.selected = true
                break
            }
        }
        questionInput.textContent = response.data[0].question
    } catch (err) {
        console.error("Unexpected error:", err)
        alert(
            "There was an error while viewing your question. Please try again later.",
        )
    }
}

async function deleteQuestion() {
    const id = urlParams.get("id")
    try {
        const response = await axios.delete(
            `${window.API_URL}/delete-question`,
            {
                params: { id },
            },
        )
        const params = new URLSearchParams({
            type: "deleted-question"
        });
        window.location.href = "info.html?" + params.toString()
    } catch (err) {
        if (err.response && err.response.status === 403) {
            const params = new URLSearchParams({
                type: "login"
            })
            window.location.href = "auth.html?" + params.toString()
        }
        console.error("Unexpected error:", err)
        alert(
            "There was an error while viewing your question. Please try again later.",
        )
    }
}

