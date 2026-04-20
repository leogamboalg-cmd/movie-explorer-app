//userController.js
const User = require("../models/User");

/**
 * GET MY PROFILE
 * GET /api/users/me
 */
exports.getMyProfile = async (req, res) => {
    try {
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

exports.getUserProfile = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username })
            .select("username bio friendsList favoriteMovies createdAt")
            .populate("friendsList", "username");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user._id === req.user.id) {
            return res.status(500).json({ message: "Cannot search yourself" });
        }

        res.status(200).json(user);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.setDisplayName = async (req, res) => {
    try {

        const userId = req.user.id;
        const { displayName } = req.body;

        if (!displayName || !displayName.trim()) {
            return res.status(400).json({ message: "Display name required" });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { displayName },
            { new: true, runValidators: true }
        ).select("username displayName");

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.setBio = async (req, res) => {
    try {

        const userId = req.user.id;
        const { bio } = req.body;

        if (bio && bio.length > 200) {
            return res.status(400).json({ message: "Bio too long" });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { bio },
            { new: true, runValidators: true }
        ).select("username bio");

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

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

        const result = await User.updateOne(
            { _id: req.user.id, favoriteMovies: { $ne: cleanTitle } }, // Only match if title is NOT there
            { $push: { favoriteMovies: cleanTitle } }
        );

        if (result.matchedCount === 0) {
            // This means the title was already in the array OR the user doesn't exist
            const userExists = await User.exists({ _id: req.user.id });
            if (!userExists) return res.status(404).json({ message: "User not found" });

            return res.status(400).json({ reason: "ALREADY_EXISTS", message: "Movie already in favorites" });
        }

        res.status(200).json({ message: "Added successfully" });
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