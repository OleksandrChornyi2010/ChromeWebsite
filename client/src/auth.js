import { checkEmail, checkPassword, checkUsername } from "./utils/checks.js"

let redirectLocation = "profile.html"
const form = document.querySelector(".needs-validation")
const urlParams = new URLSearchParams(window.location.search)
const source = urlParams.get("source")
const type = urlParams.get("type")
if (source === "question") {
    redirectLocation = "question.html"
}
let requestUrl = `${window.API_URL}/${type}`
form.addEventListener("submit", async (event) => {
    event.preventDefault()
    event.stopPropagation()

    // Get elements and values
    const usernameInput = document.querySelector("#floatingUsername")
    const emailInput = document.querySelector("#floatingEmail")
    const passwordInput = document.querySelector("#floatingPassword")
    const checkbox = document.getElementById("checkDefault")

    const usernameFeedback = document.querySelector("#usernameFeedback")
    const emailFeedback = document.querySelector("#emailFeedback")
    const passwordFeedback = document.querySelector("#passwordFeedback")

    const username = usernameInput.value.trim()
    const email = emailInput.value.trim()
    const password = passwordInput.value
    const rememberMe = checkbox.checked

    let isValid = true

    // Reset previous errors
    usernameInput.classList.remove("is-valid", "is-invalid")
    emailInput.classList.remove("is-valid", "is-invalid")
    passwordInput.classList.remove("is-valid", "is-invalid")

    // Username: 3-31 characters
    if (checkUsername(username)) {
        usernameInput.classList.remove("is-valid")
        usernameInput.classList.add("is-invalid")
        usernameFeedback.textContent =
            "Username must be between 3 and 31 characters including both."
        isValid = false
    }

    // Password: 8-31 characters
    if (checkPassword(password)) {
        passwordInput.classList.remove("is-valid")
        passwordInput.classList.add("is-invalid")
        passwordFeedback.textContent =
            "Password must be between 8 and 31 characters including both."
        isValid = false
    }

    // Email: simple check
    if (checkEmail(email)) {
        // Invalid email
        emailInput.classList.remove("is-valid")
        emailInput.classList.add("is-invalid")
        emailFeedback.textContent = "Please enter a valid email address."
        isValid = false
    }

    if (!isValid) {
        form.classList.add("was-validated")
        return // stop submit
    }
    form.classList.add("was-validated")

    try {
        const response = await axios.post(requestUrl, {
            username,
            email,
            password,
            rememberMe,
        })
        window.location.href = redirectLocation
    } catch (err) {
        if (err.response && err.response.status === 404) {
            const params = new URLSearchParams({
                type: "register",
                source: "login"
            })
            window.location.href = "auth.html?" + params.toString()
        } else if (err.response && err.response.status === 401) {
            passwordInput.classList.remove("is-valid")
            passwordInput.classList.add("is-invalid")
            passwordFeedback.textContent = "Passwords do not match."
        } else if (err.response && err.response.status === 409) {
            if (type === "register") {
                usernameInput.classList.add("is-invalid")
                usernameFeedback.textContent = "This username is already taken."

                emailInput.classList.add("is-invalid")
                emailFeedback.textContent = "This email is already used."
            }
            else if (type === "login") {
                window.location.href = redirectLocation
            }
        }
        else {
            console.error("Unexpected error:", err)
            alert(
                "There was an error while performing an action with your account. Please try again later.",
            )
        }
    }
})

document
    .getElementById("togglePassword")
    .addEventListener("click", function () {
        const passwordInput = document.getElementById("floatingPassword")
        const icon = document.getElementById("toggleIcon")
        const isHidden = passwordInput.type === "password"
        passwordInput.type = isHidden ? "text" : "password"
        icon.className = isHidden ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"
    })
