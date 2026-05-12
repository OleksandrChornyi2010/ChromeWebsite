const osSelect = document.querySelector("#osSelect")
const os = detectOS()
if (os != "Unknown") {
    osSelect.value = os
}
let platform = "linux"
document.querySelector("#downloadButton").addEventListener("click", () => {
    if (osSelect.selectedIndex === 1) {
        platform = "win"
    } else if (osSelect.selectedIndex === 2) {
        platform = "linux"
    } else if (osSelect.selectedIndex === 3) {
        platform = "mac"
    } else if (osSelect.selectedIndex === 4) {
        platform = "android"
    } else if (osSelect.selectedIndex === 5) {
        platform = "ios"
    }
    window.location.href = `game.html?platform=${platform}`
})

function detectOS() {
    const userAgent = navigator.userAgent
    console.log("navig: " + userAgent)
    if (/Android/.test(userAgent)) return "android"
    if (/iPhone|iPad|iPod/.test(userAgent)) return "ios"
    if (/Windows NT/.test(userAgent)) return "win"
    if (/Mac OS X/.test(userAgent)) return "mac"
    if (/Linux/.test(userAgent)) return "linux"

    return "Unknown"
}
