const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/create-user", async (req, res) => {
    try {
        const user = new User({
            username: "testuser",
            email: "test@email.com",
            passwordHash: "fakehash123",
            favoriteMovies: [],
            friendsList: []
        });

        await user.save();

        res.json({ message: "User saved", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/delete-user/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted", deletedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
