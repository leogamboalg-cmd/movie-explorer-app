//userRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// controllers (logic lives there)
const {
	getMyProfile,
	getMyFavorites,
	addFavorite,
	removeFavorite,
	setBio,
	setDisplayName,
	getUserProfile,
} = require("../controllers/userController");

// get logged-in user's profile
router.get("/me", authMiddleware, getMyProfile);

router.get("/:username", authMiddleware, getUserProfile);

// get logged-in user's favorite movies
router.get("/me/favorites", authMiddleware, getMyFavorites);

// add a movie to favorites
router.post("/me/favorites", authMiddleware, addFavorite);

// add or set displayName
router.put("/me/setDisplayName", authMiddleware, setDisplayName);

// add or update bio
router.put("/me/setBio", authMiddleware, setBio);

// remove a movie from favorites
router.delete("/me/favorites", authMiddleware, removeFavorite);

module.exports = router;
