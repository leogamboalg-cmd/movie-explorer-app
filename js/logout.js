const API_BASE =
    window.location.hostname === "localhost"
        ? "http://localhost:3000/api"
        : "https://movie-explorer-app-yy9h.onrender.com/api";

document.getElementById("logoutBtn")?.addEventListener("click", async () => {
    try {
        await fetch(`${API_BASE}/auth/logout`, {
            method: "POST",
            credentials: "include"
        });

        window.location.href = "login.html";
    } catch (err) {
        console.error("Logout failed", err);
    }
});
