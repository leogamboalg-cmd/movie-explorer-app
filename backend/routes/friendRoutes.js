const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

// import controller functions
const {
    addFriend,
    removeFriend,
    getFriendList
} = require("../controllers/friendController");

// get my friends list
router.get("/", auth, getFriendList);

// add a friend
router.post("/:friendId", auth, addFriend);

// remove a friend
router.delete("/:friendId", auth, removeFriend);

module.exports = router;
