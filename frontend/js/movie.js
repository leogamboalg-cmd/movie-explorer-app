// movie.js
function loadMoviePage() {
    const movieData = sessionStorage.getItem("movieData");

    if (!movieData) {
        console.log("No movie data yet — leaving placeholders");
        return;
    }

    const movie = JSON.parse(movieData);

    // Poster
    const poster = document.getElementById("posterImg");
    if (movie.Poster && movie.Poster !== "N/A") {
        poster.innerHTML = `
            <img src="${movie.Poster}"
                 style="width:100%;height:100%;object-fit:cover;">
        `;
    }

    // Title + year
    document.getElementById("movieTitle").textContent = movie.Title;
    document.getElementById("movieYear").textContent = `(${movie.Year})`;

    // Plot
    document.getElementById("moviePlot").textContent = movie.Plot;

    // Ratings
    document.getElementById("imdbRating").innerHTML =
        movie.imdbRating !== "N/A"
            ? `<span class="gold">${movie.imdbRating}</span>/10`
            : "—";

    document.getElementById("metaScore").textContent =
        movie.Metascore !== "N/A" ? `${movie.Metascore}/100` : "—";

    document.getElementById("director").textContent = movie.Director;
    document.getElementById("writers").textContent = movie.Writer;
    document.getElementById("stars").textContent = movie.Actors;
    document.getElementById("release").textContent = movie.Released;
    document.getElementById("boxOffice").textContent =
        movie.BoxOffice !== "N/A" ? movie.BoxOffice : "—";
    document.getElementById("awards").textContent =
        movie.Awards !== "N/A" ? movie.Awards : "—";

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
// ADD TO FAVORITES BUTTON
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

            await addFavorite(movie.Title);

            showToast("Added to favorites ⭐", 2000);
        } catch (err) {
            console.error(err);
            showToast("Failed to add favorite", 2000);
        }
    });
}
