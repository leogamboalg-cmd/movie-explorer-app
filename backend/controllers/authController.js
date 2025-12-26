const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * REGISTER
 * POST /api/auth/register
 */
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUserEmail = await User.findOne({ email });
        const existingUsername = await User.findOne({ username });

        if (existingUserEmail) {
            return res.status(400).json({ message: "Email already in use" });
        } else if (existingUsername) {
            return res.status(400).json({ message: "Username already in use" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            passwordHash,
            favoriteMovies: [],
            friendsList: [],
        });

        res.status(201).json({
            message: "User registered successfully",
            userId: user._id
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * LOGIN
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, existingUser.passwordHash);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: existingUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,        // true in production
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // token REMOVED from response
        return res.status(200).json({
            message: "Login successful"
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
