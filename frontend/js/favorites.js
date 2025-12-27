document.addEventListener("DOMContentLoaded", loadFavorites);

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