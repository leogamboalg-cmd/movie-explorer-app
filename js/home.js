// =========================
// HOME PAGE LIMITS
// =========================
const RECENT_LIMIT = 8;
const TRENDING_LIMIT = 8;


document.addEventListener("DOMContentLoaded", () => {
    loadRecentlyViewed();
    loadTrending();
});

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
        JSON.parse(sessionStorage.getItem("recentMovies")) || [];

    if (recent.length === 0) return;

    section.classList.remove("hidden");

    // APPLY LIMIT
    recent.slice(0, RECENT_LIMIT).forEach(movie => {
        row.appendChild(createPoster(movie));
    });
}

/* ===============================
   TRENDING (static for now)
================================ */

const TRENDING = [
    "Inception",
    "Interstellar",
    "The Dark Knight",
    "Fight Club",
    "Parasite",
    "The Matrix",
    "Anyone but you",
    "Superman",
];

async function loadTrending() {
    const row = document.getElementById("trendingRow");

    for (const title of TRENDING.slice(0, TRENDING_LIMIT)) {
        let movie = getCachedMovie(title);

        if (!movie) {
            movie = await getMovieData(title);
            setCachedMovie(title, movie);
        }

        row.appendChild(createPoster(movie));
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