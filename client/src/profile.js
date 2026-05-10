import { checkPassword } from "./utils/checks"

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
        const sidebarMenu = document.getElementById("sidebarMenu");
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(sidebarMenu);

        if (sidebarMenu.classList.contains("collapsing")) {
            sidebarMenu.addEventListener("shown.bs.collapse", () => {
                bsCollapse.hide()
            }, { once: true })
        } else if (sidebarMenu.classList.contains("show")) {
            bsCollapse.hide()
        }
    })
})

window.addEventListener("userSessionReady", () => {
    console.log("UserSession:", window.userSession)
    const headerText = document.getElementById("header-text")
    headerText.textContent = window.userSession.username
    headerText.classList.remove("invisible")
})

async function loadQuestions() {
    let questions
    try {
        const response = await axios.get(
            `${window.API_URL}/get-all-questions`,
            {},
        )
        questions = response.data
    } catch (err) {
        console.error("Unexpected error:", err)
        alert(
            "There was an error while getting your questions. Please try again later.",
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
        const params = new URLSearchParams({
            type: "overview",
            id: question.id
        })
        row.innerHTML = `
            <th scope="row">${question.id}</th>
            <td class="text-truncate" style="max-width: 10.42vw;">${preview}</td>
            <td >${formatted}</td>
            <td><a href="question.html?${params.toString()}" class="btn btn-sm btn-primary" data-id="${question.id}">View</a></td>
        `

        tbody.appendChild(row)
    })
}

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

    if (checkPassword(newPassword)) {
        newPasswordInput.classList.remove("is-valid")
        newPasswordInput.classList.add("is-invalid")
        newPasswordFeedback.textContent =
            "Password must be between 8 and 31 characters including both."
        isValid = false
    }
    if (!isValid) {
        form.classList.add("was-validated")
        return // stop submit
    }

    form.classList.add("was-validated")

    try {
        const response = await axios.post(
            `${window.API_URL}/change-password`,
            {
                newPassword,
            },
        )
        const params = new URLSearchParams({
            type: "password-updated"
        })
        window.location.href = "info.html?" + params.toString()
    } catch (err) {
        console.error("Unexpected error:", err)
        alert(
            "There was an error while changing your password. Please try again later.",
        )
    }
})

document
    .getElementById("togglePassword")
    .addEventListener("click", function () {
        const newPasswordInput = document.getElementById("newPassword-input")
        const icon = document.getElementById("toggleIcon")
        const isHidden = newPasswordInput.type === "password"
        newPasswordInput.type = isHidden ? "text" : "password"
        icon.className = isHidden ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"
    })
