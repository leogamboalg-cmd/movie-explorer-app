// logout.js

document.getElementById("logoutBtn")?.addEventListener("click", async () => {
    try {
        // Optional: notify backend (for logging / future token revocation)
        await apiFetch("/auth/logout", {
            method: "POST"
        });

    } catch (err) {
        console.error("Logout request failed", err);
    } finally {
        // Always clear client-side auth
        clearAuthToken();
        window.location.href = "login.html";
    }
});