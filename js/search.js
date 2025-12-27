// search.js

const API_BASE =
    window.location.hostname === "localhost"
        ? "http://localhost:3000/api"
        : "https://movie-explorer-app.onrender.com/api";

document.getElementById("searchForm").addEventListener("submit", searchForMovie);

async function searchForMovie(e) {
    e.preventDefault();

    const movie = document.getElementById("searchBar").value;

    if (movie.trim() === "") {
        showToast("Please enter a movie", 2000);
        return;
    }

    const res = await fetch(
        `${API_BASE}/movies/search?title=${encodeURIComponent(movie)}`,
        { credentials: "include" }
    );

    const data = await res.json();

    if (!res.ok) {
        showToast(data.message || "Movie not found", 2000);
        return;
    }

    sessionStorage.setItem("movieData", JSON.stringify(data));
    window.location.href = "movie.html";
}