const express = require("express");
const router = express.Router();

const {
    searchMovie,
    getNowPlayingMovies,
    getPopularMovies,
    getTopRatedMovies,
    getRecommendedMovies,
} = require("../controllers/movieController");

const { getTrendingMovies } = require("../controllers/trendingController");

// routes
router.get("/search", searchMovie);
router.get("/trending", getTrendingMovies);
router.get("/playingNow", getNowPlayingMovies);
router.get("/popular", getPopularMovies);
router.get("/topRated", getTopRatedMovies);
router.get("/recommended", getRecommendedMovies)

module.exports = router;
