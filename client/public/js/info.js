const primaryText = document.getElementById("primary-text")
const secondaryText = document.getElementById("secondary-text")
const actionButton = document.getElementById("action-button")

const urlParams = new URLSearchParams(window.location.search)
const type = urlParams.get("type")
if (type === "download") {
    download()
}
else if (type === "subscribed") {
    subscribed()
}
else if (type === "unsubscribed") {
    unsubscribed()
}
else if (type === "submitted") {
    submitted()
}
else if (type === "deleted-question") {
    deletedQuestion()
}
else if (type === "password-updated") {
    passwordUpdated()
}
function deletedQuestion() {
    primaryText.textContent = "Your question has been succesfully deleted."
    secondaryText.textContent = "You can now ask another one if you wish."
    actionButton.textContent = "Ask another question"
    actionButton.href = "question.html"
}
function subscribed() {
    primaryText.textContent = "You have succesfully subscribed to our newsletter!"
    secondaryText.textContent = "You can now download chrome by clicking the button below."
    actionButton.textContent = "Download"
    actionButton.href = "download.html"
}

function unsubscribed() {

}
function passwordUpdated() {
    primaryText.textContent = "Your password has been succesfully changed!"
    secondaryText.textContent = "You now need to relogin on all of your devices."
    actionButton.textContent = "Back to home page"
    actionButton.href = "index.html#home"
}

function submitted() {
    primaryText.textContent = "Your question has been succesfully submitted!"
    secondaryText.textContent = "You can now see it in your profile."
    actionButton.textContent = "Back to home page"
    actionButton.href = "index.html#home"
}

function download() {
    primaryText.textContent = "Your download will start shortly"
    secondaryText.textContent = "If it doesn't, click the button below"
    const platform = urlParams.get("platform")
    let fileName = "chrome."
    if (platform === "win") {
        fileName += "exe"
    } else if (platform == "linux") {
        fileName += "deb"
    } else if (platform == "mac") {
        fileName += "dmg"
    } else if (platform == "android") {
        fileName += "apk"
    } else if (platform == "ios") {
        fileName += "amd64"
    } else {
        // Unknown platform
        fileName += "deb"
    }
    const filePath = `${window.VITE_BASE}/files/${fileName}`
    actionButton.textContent = "Download"
    document.addEventListener("DOMContentLoaded", () => {
        actionButton.href = filePath
        window.location.href = filePath
    })
}
