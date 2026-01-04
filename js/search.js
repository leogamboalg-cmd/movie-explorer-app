// search.js

document.getElementById("searchForm").addEventListener("submit", searchForMovie);

async function searchForMovie(e) {
    e.preventDefault();

    const movie = document.getElementById("searchBar").value;

    if (movie.trim() === "") {
        showToast("Please enter a movie", 2000);
        return;
    }

    try {
        const res = await apiFetch(
            `/movies/search?title=${encodeURIComponent(movie)}`
        );

        const data = await res.json();

        if (!res.ok) {
            showToast(data.message || "Movie not found", 2000);
            return;
        }

        addToRecentlyViewed(data);
        sessionStorage.setItem("movieData", JSON.stringify(data));
        sessionStorage.setItem("lastSearch", movie);
        window.location.href = "movie.html";

    } catch (err) {
        console.error(err);
        showToast("Server error", 2000);
    }
}