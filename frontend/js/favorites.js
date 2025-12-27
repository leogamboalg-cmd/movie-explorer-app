document.addEventListener("DOMContentLoaded", loadFavorites);

async function loadFavorites() {
    const grid = document.getElementById("favoritesGrid");
    const emptyState = document.getElementById("emptyFavorites");

    grid.innerHTML = "";

    try {
        const favoriteIDs = await getFavorites(); // from api.js

        if (favoriteIDs.length === 0) {
            emptyState.style.display = "block";
            return;
        }

        emptyState.style.display = "none";

        for (const imdbID of favoriteIDs) {
            const movie = await getMovieData(imdbID); // OMDb or cache
            const card = createMovieCard(movie);
            grid.appendChild(card);
        }

    } catch (err) {
        console.error("Failed to load favorites", err);
    }
}
