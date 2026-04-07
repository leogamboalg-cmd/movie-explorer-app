const Review = require("../models/Review");
const User = require("../models/User");
const mongoose = require("mongoose");

const formatReview = (review, viewerId) => {
    if (!review) return review;

    const reviewObject = review.toObject ? review.toObject() : review;
    const likes = reviewObject.likes || [];

    return {
        ...reviewObject,
        likesCount: likes.length,
        likedByMe: viewerId ? likes.some((id) => id.toString() === viewerId) : false,
        likes: undefined
    };
};

/**
 * Create a new review OR update an existing one
 * - One review per user per movie
 * - Handles:
 *   - first time rating
 *   - updating rating
 *   - adding/editing review text
 */
const createOrUpdateReview = async (req, res) => {
    try {
        // 1. Get logged-in user id
        const userId = req.user.id;

        // 2. Get data from request
        const { movieId, rating, reviewText } = req.body;

        if (!movieId) {
            return res.status(400).json({ message: "movieId is required" });
        }

        // 3. Build filter (MUST match schema)
        const filter = { user: userId, movieId };

        // 4. Build update object safely
        const updateFields = {};
        if (rating !== undefined) updateFields.rating = rating;
        if (reviewText !== undefined) updateFields.reviewText = reviewText;

        const update = { $set: updateFields };

        // 5. Options
        const options = {
            new: true,
            upsert: true,
            runValidators: true
        };

        // 6. Create or update review
        const review = await Review.findOneAndUpdate(filter, update, options);

        // 7. Respond
        return res.status(200).json(formatReview(review, userId));

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

/**
 * Get the logged-in user's review for a specific movie
 * - Used to pre-fill stars and review text
 */
const getMyReviewForMovie = async (req, res) => {
    try {
        // 1. Get logged-in user id
        const userId = req.user.id;

        // 2. Get movieId from URL params
        const { movieId } = req.params;

        if (!movieId) {
            return res.status(400).json({ message: "movieId is required" });
        }

        // 3. Find review (read-only)
        const review = await Review.findOne({
            user: userId,
            movieId
        });

        // 4. Return review (can be null)
        return res.status(200).json(formatReview(review, userId));

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getUserReviews = async (req, res) => {
    try {
        const { username } = req.params;

        if (!username) {
            return res.status(400).json({ message: "username required" });
        }

        // find user
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // find reviews written by user
        const reviews = await Review.find({ user: user._id })
            .sort({ createdAt: -1 });

        return res.status(200).json(reviews.map((review) => formatReview(review, req.user.id)));

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

/**
 * Get all reviews for a specific movie
 * - Public endpoint
 * - Used to display reviews on movie page
 */
const getReviewsForMovie = async (req, res) => {
    try {
        // 1. Get movieId from req.params
        const { movieId } = req.params;

        if (!movieId) {
            return res.status(400).json({ message: "movieId is required" });
        }

        // 2. Find all reviews for this movie
        // 3. Populate user info (username only)
        // 4. Sort by newest first
        const reviews = await Review.find({ movieId })
            .populate("user", "username")
            .sort({ createdAt: -1 });

        // 5. Return list of reviews
        return res.status(200).json(reviews.map((review) => formatReview(review, req.user?.id)));

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


/**
 * Delete the logged-in user's review for a movie
 * - Allows user to remove rating/review entirely
 */
const deleteMyReview = async (req, res) => {
    try {
        // 1. Get logged-in user id
        const userId = req.user.id;

        // 2. Get movieId from params
        const { movieId } = req.params;

        if (!movieId) {
            return res.status(400).json({ message: "movieId is required" });
        }

        // 3. Delete the review belonging to this user + movie
        const result = await Review.deleteOne({
            user: userId,
            movieId
        });

        // 4. If no review was deleted
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Review not found" });
        }

        // 5. Success response
        return res.status(200).json({ message: "Review deleted successfully" });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const likeReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const { reviewId } = req.params;

        if (!mongoose.isValidObjectId(reviewId)) {
            return res.status(400).json({ message: "Valid reviewId is required" });
        }

        const review = await Review.findByIdAndUpdate(
            reviewId,
            { $addToSet: { likes: userId } },
            { new: true, runValidators: true }
        );

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        return res.status(200).json(formatReview(review, userId));
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const unlikeReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const { reviewId } = req.params;

        if (!mongoose.isValidObjectId(reviewId)) {
            return res.status(400).json({ message: "Valid reviewId is required" });
        }

        const review = await Review.findByIdAndUpdate(
            reviewId,
            { $pull: { likes: userId } },
            { new: true, runValidators: true }
        );

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        return res.status(200).json(formatReview(review, userId));
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


module.exports = {
    createOrUpdateReview,
    getMyReviewForMovie,
    getUserReviews,
    getReviewsForMovie,
    likeReview,
    unlikeReview,
    deleteMyReview,
};
