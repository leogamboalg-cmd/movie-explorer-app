// =========================
// HOME PAGE LIMITS
// =========================
const RECENT_LIMIT = 9;

function getCachedMovie(title) {
    const key = `movie:${title.toLowerCase()}`;
    const cached = sessionStorage.getItem(key);
    return cached ? JSON.parse(cached) : null;
}

function setCachedMovie(title, movieData) {
    const key = `movie:${title.toLowerCase()}`;
    sessionStorage.setItem(key, JSON.stringify(movieData));
}

/* ===============================
   RECENTLY VIEWED
================================ */

function loadRecentlyViewed() {
    const section = document.getElementById("recentSection");
    const row = document.getElementById("recentMoviesRow");

    const recent =
        JSON.parse(localStorage.getItem("recentMovies")) || [];

    if (recent.length === 0) return;

    section.classList.remove("hidden");

    // APPLY LIMIT
    row.innerHTML = "";
    recent.slice(0, RECENT_LIMIT).forEach(movie => {
        row.appendChild(createPoster(movie));
    });
}

/* ===============================
   TRENDING (static for now)
================================ */

// const TRENDING = [
//     "Inception",
//     "Interstellar",
//     "The Dark Knight",
//     "Fight Club",
//     "Parasite",
//     "The Matrix",
//     "Anyone but you",
//     "Superman",
// ];

async function loadMovieRow(endpoint, rowId, limit = 9) {
    try {
        const res = await apiFetch(endpoint);
        if (!res.ok) throw new Error("Fetch failed");

        const movies = await res.json();
        const row = document.getElementById(rowId);
        row.innerHTML = "";

        movies.slice(0, limit).forEach(m => {
            const poster = document.createElement("div");
            poster.className = "movie-poster";

            const img = document.createElement("img");
            img.src = m.poster || "images/placeholder.png";
            img.alt = m.title;

            poster.appendChild(img);

            poster.addEventListener("click", async () => {
                const movieData = await getMovieData(m.title);
                addToRecentlyViewed(movieData);
                sessionStorage.setItem(
                    "movieData",
                    JSON.stringify(movieData)
                );
                window.location.href = "movie.html";
            });

            row.appendChild(poster);
        });
    } catch (err) {
        console.error(err);
    }
}


/* ===============================
   POSTER ELEMENT
================================ */

function createPoster(movie) {
    const div = document.createElement("div");
    div.className = "movie-poster";

    const img = document.createElement("img");
    img.src =
        movie.Poster && movie.Poster !== "N/A"
            ? movie.Poster
            : "images/placeholder.png";

    img.alt = movie.Title;

    div.appendChild(img);

    div.addEventListener("click", () => {
        sessionStorage.setItem("movieData", JSON.stringify(movie));
        window.location.href = "movie.html";
    });

    return div;
}

document.addEventListener("DOMContentLoaded", () => {
    loadRecentlyViewed();
    loadMovieRow("/movies/trending", "trendingRow");
    loadMovieRow("/movies/playingNow", "nowPlayingRow");
    loadMovieRow("/movies/popular", "popularRow");
    loadMovieRow("/movies/topRated", "topRatedRow");
});
