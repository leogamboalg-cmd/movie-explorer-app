const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  searchMovie,
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getRecommendedMovies,
} = require("../controllers/movieController");

const { getTrendingMovies } = require("../controllers/trendingController");

const geminiRecommendationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many recommendation requests. Try again later." },
});

// routes
router.get("/search", searchMovie);
router.get("/trending", getTrendingMovies);
router.get("/playingNow", getNowPlayingMovies);
router.get("/popular", getPopularMovies);
router.get("/topRated", getTopRatedMovies);
router.get("/recommended", auth, geminiRecommendationLimiter, getRecommendedMovies);

module.exports = router;
