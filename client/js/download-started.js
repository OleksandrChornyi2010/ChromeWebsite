const urlParams = new URLSearchParams(window.location.search)
const platform = urlParams.get("platform")
let fileName
if (platform == "win") {
    fileName = "chrome.exe"
} else if (platform == "linux") {
    fileName = "chrome.deb"
} else if (platform == "mac") {
    fileName = "chrome.dmg"
} else if (platform == "android") {
    fileName = "chrome.apk"
} else if (platform == "ios") {
    fileName = "chrome.amd64"
} else {
    // Unknown platform
    fileName = "chrome.deb"
}
document.addEventListener("DOMContentLoaded", () => {
    window.location.href = `../files/${fileName}`
    document.querySelector("#clickHere").href = `../files/${fileName}`
})
