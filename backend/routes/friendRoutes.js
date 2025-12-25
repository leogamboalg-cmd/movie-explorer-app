const express = require("express");
const router = express.Router();

// import controller functions
const {
    addFriend,
    removeFriend,
    getFriendList
} = require("../controllers/friendController");

// get my friends list
router.get("/", getFriendList);

// add a friend
router.post("/:friendId", addFriend);

// remove a friend
router.delete("/:friendId", removeFriend);

module.exports = router;
