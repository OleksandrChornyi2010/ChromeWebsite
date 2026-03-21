;(async () => {
    "use strict"

    const form = document.querySelector(".needs-validation")
    document
        .querySelector("#delete-button")
        .addEventListener("click", deleteQuestion)
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get("id")
    // Get elements and values
    const firstNameInput = document.querySelector("#firstName")
    const lastNameInput = document.querySelector("#lastName")
    const languageInput = document.querySelector("#language")
    const questionInput = document.querySelector("#question")

    try {
        const response = await axios.get("http://localhost:3000/get-question", {
            params: { id },
        })
        if (response.status === 204) {
            window.location.href = "sign-in.html?source=question"
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
})()

async function deleteQuestion() {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get("id")
    try {
        const response = await axios.delete(
            "http://localhost:3000/delete-question",
            {
                params: { id },
            },
        )
        window.location.href = "deleted.html"
    } catch (err) {
        if (response.status === 403) {
            window.location.href = "sign-in.html"
        }
        console.error("Unexpected error:", err)
        alert(
            "There was an error while viewing your question. Please try again later.",
        )
    }
}
