// favorites.js

loadFavorites(); // call immediately

async function loadFavorites() {
    const grid = document.getElementById("favoritesGrid");
    const emptyState = document.getElementById("emptyFavorites");

    grid.innerHTML = "";
    emptyState.style.display = "none";

    try {
        const favoriteTitles = await getFavorites();

        if (!favoriteTitles || favoriteTitles.length === 0) {
            emptyState.style.display = "block";
            return;
        }

        for (const title of favoriteTitles) {
            try {
                const movie = await getMovieData(title);
                const card = createMovieCard(movie);
                grid.appendChild(card);
            } catch (movieErr) {
                console.warn(`Failed to load movie: ${title}`, movieErr);
            }
        }

    } catch (err) {
        console.error("Failed to load favorites", err);
        emptyState.style.display = "block";
    }
}

function createMovieCard(movie) {
    const card = document.createElement("div");
    card.className = "movieCard";

    const poster = document.createElement("div");
    poster.className = "moviePoster";

    if (movie.Poster && movie.Poster !== "N/A") {
        const img = document.createElement("img");
        img.src = movie.Poster;
        img.alt = movie.Title;
        poster.appendChild(img);
    } else {
        poster.textContent = "No Poster";
    }

    const title = document.createElement("div");
    title.className = "movieTitle";
    title.textContent = movie.Title;

    const year = document.createElement("div");
    year.className = "movieYear";
    year.textContent = `(${movie.Year || "—"})`;

    card.appendChild(poster);
    card.appendChild(title);
    card.appendChild(year);

    card.addEventListener("click", () => {
        sessionStorage.setItem("movieData", JSON.stringify(movie));
        window.location.href = "movie.html";
    });

    return card;
}