// reviewRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
    createOrUpdateReview,
    getMyReviewForMovie,
    getReviewsForMovie,
    deleteMyReview,
} = require("../controllers/reviewController");

// create or update review (rate / edit / write)
router.put("/", auth, createOrUpdateReview);

// get logged-in user's review for a movie
router.get("/me/:movieId", auth, getMyReviewForMovie);

// get all reviews for a movie
router.get("/movie/:movieId", getReviewsForMovie);

// delete logged-in user's review
router.delete("/:movieId", auth, deleteMyReview);

module.exports = router;