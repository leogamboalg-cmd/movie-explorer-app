const User = require("../models/User");

/**
 * GET MY PROFILE
 * GET /api/users/me
 */
exports.getMyProfile = async (req, res) => {
    try {
        // 1. get user id (later from JWT middleware)
        // const userId = req.user.id;
        const userId = req.user.id;
        // 2. find user by id
        const user = await User.findById(userId).select("-passwordHash");
        // 3. if user not found → error
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // 4. return profile info (exclude passwordHash)
        return res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * GET MY FAVORITES
 * GET /api/users/me/favorites
 */
exports.getMyFavorites = async (req, res) => {
    try {
        // 1. get user id
        const userId = req.user.id;

        // 2. find user
        const user = await User.findById(userId).select("favoriteMovies");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 3. check is user has favorite movies 
        if (user.favoriteMovies.length === 0) {
            // no favorites yet
            return res.status(200).json([]);
        }


        // 4. return favoriteMovies array
        return res.status(200).json(user.favoriteMovies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * ADD FAVORITE MOVIE
 * POST /api/users/me/favorites
 */
exports.addFavorite = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Movie title required" });
        }

        const cleanTitle = title.trim();

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $addToSet: { favoriteMovies: cleanTitle } },
            { new: true }
        ).select("favoriteMovies");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(updatedUser.favoriteMovies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * REMOVE FAVORITE MOVIE
 * DELETE /api/users/me/favorites/:movieId
 */
exports.removeFavorite = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Movie title required" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $pull: { favoriteMovies: title.trim() } },
            { new: true }
        ).select("favoriteMovies");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(updatedUser.favoriteMovies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};