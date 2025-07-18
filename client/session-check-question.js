(async () => {
    // Are we logged into an account form this ip?
    try {
        const response = await axios.get("http://localhost:3000/session");
        console.log(response.data)
        if (response.status === 200) {
            console.log("You are still logged in as:", response.data.username);
            document.querySelector("#dropdown").classList.remove("d-none");
        } else if (response.status === 204) {
            console.log("Not logged in");
            document.querySelectorAll("#header-button").forEach((element) => {
                element.classList.remove("d-none")
            })
            location.href = "sign-in.html?source=question"
        }

    } catch (err) {
        console.error("Unexpected error:", err);
        document.querySelectorAll("#header-button").forEach((element) => {
            element.classList.remove("d-none")
        })
    }
})();