// movie.js

// =========================
// LOAD MOVIE DATA
// =========================
function loadMoviePage() {
    const movieData = sessionStorage.getItem("movieData");
    const searchInput = document.getElementById("searchBar");
    const lastSearch = sessionStorage.getItem("lastSearch");

    if (searchInput && lastSearch) {
        searchInput.value = lastSearch;
    }

    if (!movieData) {
        console.log("No movie data yet");
        return;
    }

    const movie = JSON.parse(movieData);

    // Poster (avoid innerHTML when possible)
    const poster = document.getElementById("posterImg");
    poster.innerHTML = "";

    if (movie.Poster && movie.Poster !== "N/A") {
        const img = document.createElement("img");
        img.src = movie.Poster;
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "cover";
        poster.appendChild(img);
    }

    // Title + year
    document.getElementById("movieTitle").textContent = movie.Title;
    document.getElementById("movieYear").textContent = `(${movie.Year})`;

    // Plot
    document.getElementById("moviePlot").textContent = movie.Plot;

    // Ratings
    document.getElementById("imdbRating").textContent =
        movie.imdbRating !== "N/A" ? `${movie.imdbRating}/10` : "—";

    document.getElementById("metaScore").textContent =
        movie.Metascore !== "N/A" ? `${movie.Metascore}/100` : "—";

    // Details
    document.getElementById("director").textContent = movie.Director;
    document.getElementById("writers").textContent = movie.Writer;
    document.getElementById("stars").textContent = movie.Actors;
    document.getElementById("release").textContent = movie.Released;
    document.getElementById("boxOffice").textContent =
        movie.BoxOffice !== "N/A" ? movie.BoxOffice : "—";
    document.getElementById("awards").textContent =
        movie.Awards !== "N/A" ? movie.Awards : "—";

    // Cast chips
    const castRow = document.getElementById("castRow");
    castRow.innerHTML = "";

    movie.Actors.split(", ").forEach(actor => {
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.textContent = actor;
        castRow.appendChild(chip);
    });
}

loadMoviePage();

// =========================
// ADD TO FAVORITES
// =========================
const addToFavoritesBtn = document.getElementById("addToFavoritesBtn");

if (addToFavoritesBtn) {
    addToFavoritesBtn.addEventListener("click", async () => {
        try {
            const movieData = sessionStorage.getItem("movieData");

            if (!movieData) {
                showToast("No movie selected", 2000);
                return;
            }

            const movie = JSON.parse(movieData);

            const result = await addFavorite(movie.Title);

            if (!result.ok) {
                if (result.reason === "ALREADY_EXISTS") {
                    showToast("Already in favorites", 2000);
                    return;
                }

                showToast("Failed to add favorite", 2000);
                return;
            }

            showToast("Added to favorites", 2000);
        } catch (err) {
            console.error(err);
            showToast("Failed to add favorite", 2000);
        }
    });
}
