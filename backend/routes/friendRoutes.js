//friendRoutes.js
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
router.post("/add", auth, addFriend);

// remove a friend
router.delete("/remove", auth, removeFriend);

module.exports = router;
