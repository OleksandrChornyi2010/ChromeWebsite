document.querySelector("#download").addEventListener("click", () => {
    location.href = "download.html"
})
document.querySelector("#download_lg").addEventListener("click", () => {
    location.href = "download.html"
})
document.querySelector("#FAQs").addEventListener("click", () => {
    location.href = "FAQs.html"
})
form.addEventListener("submit", async (event) => {
    event.preventDefault()
    event.stopPropagation()
    const emailInput = document.querySelector("#floatingEmail")
    const emailFeedback = document.querySelector("#emailFeedback")
    const email = emailInput.value.trim()
    let isValid = true
    // Email: simple check
    if (
        email.length < 6 ||
        email.length > 64 ||
        !email.includes("@") ||
        !email.includes(".") ||
        email.indexOf("@") === 0 ||
        email.lastIndexOf(".") < email.indexOf("@") // There must be "." after the "@" sign
    ) {
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
        const response = await axios.post(`${window.API_URL}/newsletter-subscribe`, {
            email,
        })
        const params = new URLSearchParams({
            type: "subscribed"
        })
        window.location.href = "info.html?" + params.toString()
    } catch (err) {
        if (err.response && err.response.status === 409) {
            emailFeedback.textContent = "This email is already used."
            emailInput.classList.remove("is-valid")
            emailInput.classList.add("is-invalid")
        } else {
            console.error("Unexpected error:", err)
            alert(
                "There was an error subscribing you to the newsletter. Please try again later.",
            )
        }
    }
})
