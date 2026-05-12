const path = window.location.pathname
const fileName = path.substring(path.lastIndexOf("/") + 1)

const urlParams = new URLSearchParams(window.location.search)
const type = urlParams.get("type")

if (fileName === "question.html") {
    redirectToLogin({ type: "login", source: "question" })
    const titleText = document.getElementById("title-text")
    const secondaryText = document.getElementById("secondary-text")
    const actionButton = document.getElementById("action-button")
    const firstNameInput = document.getElementById("firstName")
    const lastNameInput = document.getElementById("lastName")
    const languageInput = document.getElementById("language")
    const questionInput = document.getElementById("question")
    if (type === "overview") {
        actionButton.classList.add("btn-danger")
        actionButton.textContent = "Delete"
        titleText.textContent = `Question # ${urlParams.get("id")}`
        secondaryText.textContent = ""
        firstNameInput.setAttribute("disabled", "")
        lastNameInput.setAttribute("disabled", "")
        languageInput.setAttribute("disabled", "")
        questionInput.setAttribute("disabled", "")
    }
    else {
        titleText.textContent = "Ask a question"
        secondaryText.textContent = "Below is a form you need to fill in order to submit your question. You can cancel just by leaving the page."
        actionButton.classList.add("btn-primary")
        actionButton.textContent = "Submit"
    }
} else if (fileName === "auth.html") {
    const titleText = document.getElementById("title-text")
    const source = urlParams.get("source")
    if (type === "register") {
        titleText.textContent = "Create a free account"
    }
    else if (type === "login") {
        titleText.textContent = "Please log in"
    }
    if (source === "question") {
        titleText.textContent = "You need to log in to ask a question!"
    }
    else if (source === "login") {
        titleText.textContent = "Such account doesn't exist! Register first!"
    }
    else if (source === "profile") {
        titleText.textContent = "You need to log in to access your account!"
    }

} else if (fileName === "profile.html") {
    redirectToLogin({ type: "login", source: "profile" })
}

function redirectToLogin(params) {
    window.addEventListener("notLoggedIn", () => {
        const paramsObj = new URLSearchParams(params)
        window.location.href = "auth.html?" + paramsObj.toString()
    })
}