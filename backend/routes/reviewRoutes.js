// reviewRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const jwt = require("jsonwebtoken");

const {
    createOrUpdateReview,
    getMyReviewForMovie,
    getUserReviews,
    getReviewsForMovie,
    likeReview,
    unlikeReview,
    deleteMyReview,
} = require("../controllers/reviewController");

const optionalAuth = (req, res, next) => {
    try {
        let token = req.cookies?.token;

        if (!token && req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = { id: decoded.id };
        }
    } catch (err) {
        req.user = undefined;
    }

    next();
};

// create or update review (rate / edit / write)
router.put("/", auth, createOrUpdateReview);

// get logged-in user's review for a movie
router.get("/me/:movieId", auth, getMyReviewForMovie);

router.get("/userReviews/:username", auth, getUserReviews);

// get all reviews for a movie
router.get("/movie/:movieId", optionalAuth, getReviewsForMovie);

// like / unlike a review
router.post("/:reviewId/like", auth, likeReview);
router.delete("/:reviewId/like", auth, unlikeReview);

// delete logged-in user's review
router.delete("/:movieId", auth, deleteMyReview);

module.exports = router;
