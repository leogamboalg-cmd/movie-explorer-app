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
            max: 10,
            required: true
        },

        text: {
            type: String,
            trim: true,
            maxlength: 500
        }
    },
    { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;