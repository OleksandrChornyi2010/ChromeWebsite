document.querySelectorAll("#sidebar a").forEach((link) => {
    link.addEventListener("click", function (e) {
        e.preventDefault()

        const targetId = this.dataset.target

        // Remove active class from all links
        document
            .querySelectorAll("#sidebar a")
            .forEach((l) => l.classList.remove("active"))
        this.classList.add("active")

        // Hide all sections
        document
            .querySelectorAll("section")
            .forEach((sec) => sec.classList.add("d-none"))

        // Show needed section
        document.getElementById(targetId).classList.remove("d-none")
        if (targetId === "section2") {
            loadQuestions()
        }
    })
})

window.addEventListener("userSessionReady", () => {
    console.log("UserSession:", window.userSession)
    document.querySelector("#header-text").textContent =
        window.userSession.username
})

async function loadQuestions() {
    let questions
    try {
        const response = await axios.get(
            "http://localhost:3000/get-all-questions",
            {},
        )
        questions = response.data
    } catch (err) {
        console.error("Unexpected error:", err)
        alert(
            "There was an error while changing your password. Please try again later.",
        )
    }
    const tbody = document.querySelector("#section2 tbody")
    tbody.innerHTML = ""

    questions.forEach((question, index) => {
        const row = document.createElement("tr")
        let preview = question.question
        const dateObj = new Date(question.created_at)

        const hours = dateObj.getHours().toString().padStart(2, "0")
        const minutes = dateObj.getMinutes().toString().padStart(2, "0")
        const day = dateObj.getDate().toString().padStart(2, "0")
        const month = (dateObj.getMonth() + 1).toString().padStart(2, "0")
        const year = dateObj.getFullYear()

        const formatted = `${hours}:${minutes} ${day}.${month}.${year}`

        row.innerHTML = `
            <th scope="row">${question.id}</th>
            <td class="text-truncate" style="max-width: 200px;">${preview}</td>
            <td >${formatted}</td>
            <td><a href="question-overview.html?id=${question.id}" class="btn btn-sm btn-primary" data-id="${question.id}">View</a></td>
        `

        tbody.appendChild(row)
    })
}

;(() => {
    "use strict"

    const form = document.querySelector(".needs-validation")

    form.addEventListener("submit", async (event) => {
        event.preventDefault()
        event.stopPropagation()

        // Get elements and values
        const newPasswordInput = document.querySelector("#newPassword-input")

        const newPasswordFeedback = document.querySelector(
            "#newPassword-feedback",
        )

        const newPassword = newPasswordInput.value.trim()

        let isValid = true

        // Reset previous errors
        newPasswordInput.classList.remove("is-invalid")

        // Password: 7-31 characters
        if (newPassword.length < 8 || newPassword.length > 32) {
            newPasswordInput.classList.remove("is-valid")
            newPasswordInput.classList.add("is-invalid")
            newPasswordFeedback.textContent =
                "Password must be between 7 and 31 characters including both."
            isValid = false
        }
        if (!isValid) {
            form.classList.add("was-validated")
            return // stop submit
        }

        form.classList.add("was-validated")

        try {
            const response = await axios.post(
                "http://localhost:3000/change-password",
                {
                    newPassword,
                },
            )
            console.log("Password has been changed succesfully")
            location.href = "password-update.html"
        } catch (err) {
            console.error("Unexpected error:", err)
            alert(
                "There was an error while changing your password. Please try again later.",
            )
        }
    })
})()
