//authRoutes.js
const express = require("express");
const router = express.Router();

// import controller functions
const { register, login, logout } = require("../controllers/authController");

// ROUTES
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
