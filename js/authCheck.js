const API_BASE =
    window.location.hostname === "localhost"
        ? "http://localhost:3000/api"
        : "https://movie-explorer-app-yy9h.onrender.com/api";

async function requireAuth() {
    try {
        const res = await fetch(`${API_BASE}/users/me`, {
            credentials: "include"
        });

        if (!res.ok) {
            window.location.href = "login.html";
        }
    } catch {
        window.location.href = "login.html";
    }
}
