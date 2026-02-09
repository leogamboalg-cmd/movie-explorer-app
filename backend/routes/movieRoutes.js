const express = require("express");
const router = express.Router();

const {
    searchMovie,
    getNowPlayingMovies,
    getPopularMovies,
    getTopRatedMovies
} = require("../controllers/movieController");

const { getTrendingMovies } = require("../controllers/trendingController");

// routes
router.get("/search", searchMovie);
router.get("/trending", getTrendingMovies);
router.get("/playingNow", getNowPlayingMovies);
router.get("/popular", getPopularMovies);
router.get("/topRated", getTopRatedMovies);

module.exports = router;
