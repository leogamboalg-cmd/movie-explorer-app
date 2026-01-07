// trendingController.js
const getTrendingMovies = async (req, res) => {
    try {
        const response = await fetch(
            "https://api.themoviedb.org/3/trending/movie/day",
            {
                headers: {
                    Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const data = await response.json();

        // normalize for frontend
        const movies = data.results.map(m => ({
            id: m.id,
            title: m.title,
            year: m.release_date?.split("-")[0] || null,
            poster: m.poster_path
                ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
                : null,
            rating: m.vote_average || null,
            overview: m.overview || null
        }));

        res.json(movies);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch trending movies" });
    }
};

module.exports = { getTrendingMovies };