const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        movieId: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            default: null
        },
        reviewText: {
            type: String,
            trim: true,
            maxlength: 500,
            default: ""
        }
    },
    { timestamps: true }
);

// prevent duplicate reviews
reviewSchema.index({ user: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);