const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

window.API_BASE = isLocal
    ? "http://localhost:3000/api"
    : "https://movie-explorer-app-yw9h.onrender.com/api";

// =========================
// AUTH TOKEN HELPERS
// =========================
function setAuthToken(token) {
    localStorage.setItem("authToken", token);
}

function getAuthToken() {
    return localStorage.getItem("authToken");
}

function clearAuthToken() {
    localStorage.removeItem("authToken");
}

// =========================
// CENTRAL API FETCH WRAPPER
// =========================
async function apiFetch(path, options = {}) {
    const token = getAuthToken();

    const headers = {
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers
    });

    return res;
}

// =========================
// AUTH CHECK (PROTECTED PAGES)
// =========================
async function requireAuth() {
    const token = getAuthToken();
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const res = await apiFetch("/users/me");
    if (!res.ok) {
        clearAuthToken();
        window.location.href = "login.html";
    }
}

// =========================
// FAVORITES
// =========================
async function getFavorites() {
    const res = await apiFetch("/users/me/favorites");
    if (!res.ok) {
        throw new Error("Failed to fetch favorites");
    }
    return res.json();
}

async function addFavorite(title) {
    const res = await apiFetch("/users/me/favorites", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title })
    });

    if (!res.ok) {
        throw new Error("Failed to add favorite");
    }

    return res.json();
}

async function removeFavorite(title) {
    const res = await apiFetch("/users/me/favorites", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title })
    });

    if (!res.ok) {
        throw new Error("Failed to remove favorite");
    }

    return res.json();
}

// =========================
// MOVIES (SERVER -> OMDb)
// =========================
async function getMovieData(title) {
    const res = await apiFetch(
        `/movies/search?title=${encodeURIComponent(title)}`
    );

    if (!res.ok) {
        throw new Error("Failed to fetch movie data");
    }

    return res.json();
}