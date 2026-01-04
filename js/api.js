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

    const data = await res.json();

    if (!res.ok) {
        return {
            ok: false,
            reason: data.reason || "UNKNOWN_ERROR",
            message: data.message
        };
    }

    return { ok: true };
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

function addToRecentlyViewed(movie) {
    if (!movie || !movie.imdbID) return;

    let recent = JSON.parse(sessionStorage.getItem("recentMovies")) || [];

    // remove duplicates
    recent = recent.filter(m => m.imdbID !== movie.imdbID);

    // add to front
    recent.unshift(movie);

    // limit (Letterboxd-style)
    recent = recent.slice(0, 10);

    sessionStorage.setItem("recentMovies", JSON.stringify(recent));
}