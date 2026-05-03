const savedTheme = localStorage.getItem("theme")
if (savedTheme) {
    setTheme(savedTheme)
} else {
    setTheme(
        window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light",
    )
}
document.addEventListener("DOMContentLoaded", () => {
    const themeButtons = document.querySelectorAll(".theme-button")

    themeButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            setTheme(btn.getAttribute("data-bs-theme-value"))
        })
    })
})

function updateThemeDropdown(theme) {
    localStorage.setItem("theme", theme)
    let themeDropdown = document.querySelector("#themeDropdown")

    if (theme == "light") {
        themeDropdown.innerHTML =
            '<i id="themeButtonIcon" class="bi bi-sun-fill me-2"></i>'
    } else if (theme == "dark") {
        themeDropdown.innerHTML = '<i class="bi bi-moon-stars-fill me-2"></i>'
    } else if (theme == "auto") {
        themeDropdown.innerHTML = '<i class="bi bi-circle-half me-2"></i>'
    }
}

function setTheme(theme) {
    document.documentElement.setAttribute("data-bs-theme", theme)
    if (document.readyState !== "loading") {
        updateThemeDropdown(theme)
    } else {
        document.addEventListener("DOMContentLoaded", () => {
            updateThemeDropdown(theme)
        })
    }
}
