// movieRoutes.js
const express = require("express");
const router = express.Router();

const { searchMovie } = require("../controllers/movieController");
const { getTrendingMovies } = require("../controllers/trendingController");

// routes
router.get("/search", searchMovie);
router.get("/trending", getTrendingMovies);

module.exports = router;