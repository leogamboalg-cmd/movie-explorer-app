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
        // 1. get user id
        const userId = req.user.id;
        // 2. get movie data from req.body
        const favoriteMovie = req.body;
        // 3. validate movie data
        if (!favoriteMovie) {
            return res.status(400).json({ message: "No movie" });
        }

        // check if user exists and adds movie
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { favoriteMovies: favoriteMovie } },
            { new: true, runValidators: true } // 'new: true' returns the document AFTER the push
        ).select("favoriteMovies");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // 8. return updated favorites
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
        // 1. get user id
        const userId = req.user.id;
        // 2. get movieId from req.params
        const { movieId } = req.params;
        // 3. find user
        if (!movieId) {
            return res.status(400).json({ message: "Movie ID is required" });
        }
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { favoriteMovies: movieId } },
            { new: true }
        ).select("favoriteMovies");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // 6. return updated favorites
        return res.status(200).json(updatedUser.favoriteMovies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};