const User = require("../models/User");

/**
 * GET FRIEND LIST
 * GET /api/friends
 */
exports.getFriendList = async (req, res) => {
    try {
        // 1. get logged-in user id
        const userId = req.user.id;

        // 2. find user and populate friendsList
        const user = await User.findById(userId)
            .populate("friendsList", "username email");

        // 3. if user not found → error
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        // 4. return friends list
        return res.status(200).json(user.friendsList);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * ADD FRIEND
 * POST /api/friends/:friendId
 */
exports.addFriend = async (req, res) => {
    try {
        // 1. get logged-in user id
        const userId = req.user.id;
        // 2. get friendId from req.params
        const { friendId } = req.params;
        // 3. prevent adding yourself
        if (userId === friendId) {
            return res.status(400).json({ message: "Cannot add yourself" })
        }

        // 4. check if the friend exists in the database
        const friendExists = await User.exists({ _id: friendId });

        if (!friendExists) {
            return res.status(404).json({ message: "The user you are trying to add does not exist." });
        }

        // 5. add friendId to friendsList using $addToSet (prevents duplicates)
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { friendsList: friendId } },
            { new: true } // returns the document AFTER the update
        ).select("friendsList");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // 6. return updated friends list
        res.status(200).json(updatedUser.friendsList);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * REMOVE FRIEND
 * DELETE /api/friends/:friendId
 */
exports.removeFriend = async (req, res) => {
    try {
        // 1. get logged-in user id
        const userId = req.user.id;
        // 2. get friendId from req.params
        const { friendId } = req.params;
        if (!friendId) {
            return res.status(400).json({ message: "Friend not found" });
        }

        // 3. remove friendId from friendsList ($pull)
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { friendsList: friendId } },
            { new: true } // returns the document AFTER the update
        ).select("friendsList");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // 4. return updated friends list
        res.status(200).json(updatedUser.friendsList);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
