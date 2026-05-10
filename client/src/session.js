window.userSession = undefined

async function checkSession() {
    // Are we logged into an account form this ip?
    try {
        const response = await axios.get(`${window.API_URL}/get-session`)
        if (response.status === 200) {
            console.log("You are logged in as:", response.data.username)
            document.querySelector("#dropdown").classList.remove("d-none")
            document.querySelector("#dropdown-header-text").textContent =
                response.data.email
            window.userSession = response.data
            window.dispatchEvent(new Event("userSessionReady"))
        } else if (response.status === 204) {
            console.log("Not logged in")
            document.querySelectorAll(".header-button").forEach((element) => {
                element.classList.remove("d-none")
            })
            window.dispatchEvent(new Event("notLoggedIn"))
        }
    } catch (err) {
        console.error("Unexpected error:", err)
        document.querySelectorAll(".header-button").forEach((element) => {
            element.classList.remove("d-none")
        })
    }
}

if (window.API_URL) {
    checkSession()
} else {
    window.addEventListener("backendReady", checkSession)
}

document.querySelector("#logOutItem").addEventListener("click", async () => {
    try {
        const response = await axios.post(`${window.API_URL}/close-session`, {
            email: window.userSession.email,
        })
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
