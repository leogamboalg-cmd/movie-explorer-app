//userRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// controllers (logic lives there)
const {
	getMyProfile,
	getMyFavorites,
	addFavorite,
	removeFavorite
} = require("../controllers/userController");

// get logged-in user's profile
router.get("/me", authMiddleware, getMyProfile);

// get logged-in user's favorite movies
router.get("/me/favorites", authMiddleware, getMyFavorites);

// add a movie to favorites
router.post("/me/favorites", authMiddleware, addFavorite);

// remove a movie from favorites
router.delete("/me/favorites", authMiddleware, removeFavorite);

module.exports = router;
