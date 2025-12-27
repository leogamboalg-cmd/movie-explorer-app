document.addEventListener("DOMContentLoaded", loadFavorites);
//favorite.js
async function loadFavorites() {
    const grid = document.getElementById("favoritesGrid");
    const emptyState = document.getElementById("emptyFavorites");

    // clear previous content
    grid.innerHTML = "";

    try {
        // favorites are movie TITLES (strings)
        const favoriteTitles = await getFavorites();

        // empty state
        if (!favoriteTitles || favoriteTitles.length === 0) {
            emptyState.style.display = "block";
            return;
        }

        emptyState.style.display = "none";

        // load each favorite movie by title
        for (const title of favoriteTitles) {
            try {
                const movie = await getMovieData(title); // OMDb ?t=title
                const card = createMovieCard(movie);
                grid.appendChild(card);
            } catch (movieErr) {
                console.warn(`Failed to load movie: ${title}`, movieErr);
            }
        }

    } catch (err) {
        console.error("Failed to load favorites", err);
    }
}

function createMovieCard(movie) {
    const card = document.createElement("div");
    card.className = "movieCard";

    const poster = document.createElement("div");
    poster.className = "moviePoster";

    if (movie.Poster && movie.Poster !== "N/A") {
        poster.innerHTML = `<img src="${movie.Poster}" alt="${movie.Title}">`;
    } else {
        poster.textContent = "No Poster";
    }

    const title = document.createElement("div");
    title.className = "movieTitle";
    title.textContent = movie.Title;

    const year = document.createElement("div");
    year.className = "movieYear";
    year.textContent = `(${movie.Year})`;

    card.appendChild(poster);
    card.appendChild(title);
    card.appendChild(year);

    // Click → go to movie page
    card.addEventListener("click", () => {
        sessionStorage.setItem("movieData", JSON.stringify(movie));
        window.location.href = "movie.html";
    });

    return card;
}
