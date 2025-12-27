//search.js
document.getElementById("searchForm").addEventListener("submit", searchForMovie);

async function searchForMovie(e) {
    e.preventDefault();
    const movie = document.getElementById("searchBar").value;

    if (movie.trim() === "") {
        showToast("Please enter a movie", 2000);
        return;
    }

    const res = await fetch(`http://localhost:3000/api/movies/search?title=${encodeURIComponent(movie)}`,
        { credentials: "include" }
    );

    const data = await res.json();

    if (!res.ok) {
        showToast(data.message || "Movie not found", 2000);
        return;
    }

    // save movie data so movie.html can use it
    sessionStorage.setItem("movieData", JSON.stringify(data));

    window.location.href = "movie.html";
}