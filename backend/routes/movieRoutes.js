//movieRoutes.js
const express = require("express");
const router = express.Router();
const { searchMovie } = require("../controllers/movieController");

// public route (no auth needed)
router.get("/search", searchMovie);

module.exports = router;