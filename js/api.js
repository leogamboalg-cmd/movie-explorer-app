const API_BASE =
    window.location.hostname === "localhost"
        ? "http://localhost:3000/api"
        : "https://movie-explorer-app-yy9h.onrender.com/api";
//api.js

/**
 * =========================
 * FAVORITES (titles only)
 * Cookie-based auth
 * =========================
 */

// GET /api/users/me/favorites
async function getFavorites() {
    const res = await fetch(`${API_BASE}/users/me/favorites`, {
        method: "GET",
        credentials: "include" // Send cookie
    });

    if (!res.ok) {
        throw new Error("Failed to fetch favorites");
    }

    return res.json();
}

// POST /api/users/me/favorites
async function addFavorite(title) {
    const res = await fetch(`${API_BASE}/users/me/favorites`, {
        method: "POST",
        credentials: "include", // Send cookie
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

// DELETE /api/users/me/favorites
async function removeFavorite(title) {
    const res = await fetch(`${API_BASE}/users/me/favorites`, {
        method: "DELETE",
        credentials: "include", // Send cookie
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

/**
 * =========================
 * MOVIES (server → OMDb)
 * =========================
 */

// GET /api/movies?title=Interstellar
async function getMovieData(title) {
    const res = await fetch(
        `${API_BASE}/movies/search?title=${encodeURIComponent(title)}`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch movie data");
    }

    return res.json();
}
