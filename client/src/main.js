if (!window.API_URL) {
    window.API_URL =
        (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) || "http://localhost:3000";
}
window.dispatchEvent(new Event("backendReady"))