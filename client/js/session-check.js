window.userSession = undefined
themeButtons = document.querySelectorAll(".theme-button")

const savedTheme = localStorage.getItem("theme")
if (savedTheme) {
    setTheme(savedTheme)
}

;(async () => {
    // Are we logged into an account form this ip?
    try {
        const response = await axios.get("http://localhost:3000/get-session")
        console.log(response.data)
        if (response.status === 200) {
            console.log("You are still logged in as:", response.data.username)
            document.querySelector("#dropdown").classList.remove("d-none")
            document.querySelector("#dropdown-header-text").textContent =
                response.data.email
            window.userSession = response.data
            window.dispatchEvent(new Event("userSessionReady"))
        } else if (response.status === 204) {
            console.log("Not logged in")
            document.querySelectorAll("#header-button").forEach((element) => {
                element.classList.remove("d-none")
            })
            // Optionally redirect to login
        }
    } catch (err) {
        console.error("Unexpected error:", err)
        document.querySelectorAll("#header-button").forEach((element) => {
            element.classList.remove("d-none")
        })
    }
})()

document.querySelector("#logOutItem").addEventListener("click", async () => {
    try {
        const response = await axios.post(
            "http://localhost:3000/close-session",
            {
                email: window.userSession.email,
            },
        )
        if (response.status === 200) {
            console.log("Your session has been succesfully closed.")
        } else if (response.status === 204) {
            console.log("Your session is already closed!")
        }
        location.href = "index.html#home"
    } catch (err) {
        console.error("Unexpected error:", err)
    }
})

themeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        setTheme(btn.getAttribute("data-bs-theme-value"))
    })
})

function setTheme(theme) {
    document.body.setAttribute("data-bs-theme", theme)
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
