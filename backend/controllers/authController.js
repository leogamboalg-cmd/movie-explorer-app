const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// later: const jwt = require("jsonwebtoken");

/**
 * REGISTER
 * POST /api/auth/register
 */
exports.register = async (req, res) => {
    try {
        // 1. destructure data from req.body
        // const { username, email, password } = req.body;
        const { username, email, password } = req.body;
        // 2. validate input (missing fields?)
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // 3. check if user already exists (email or username)
        const existingUserEmail = await User.findOne({ email });
        const existingUsername = await User.findOne({ username });

        if (existingUserEmail) {
            return res.status(400).json({ message: "Email already in use" });
        } else if (existingUsername) {
            return res.status(400).json({ message: "Username already in use" });
        }

        // 4. hash password with bcrypt
        const passwordHash = await bcrypt.hash(password, 10);

        // 5. create new user in database
        const user = await User.create({
            username,
            email,
            passwordHash,
            favoriteMovies: [],
            friendsList: [],
        })

        // 6. send success response
        res.status(201).json({
            message: "User registered successfully",
            userId: user._id
        })

    } catch (err) {
        // error handling
        res.status(500).json({ message: err.message });
    }
};

/**
 * LOGIN
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
    try {

        // 1. destructure email & password from req.body
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        // 2. find user by email
        const existingUser = await User.findOne({ email });
        // 3. if no user → invalid credentials
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // 4. compare password with passwordHash using bcrypt
        const isMatch = await bcrypt.compare(password, existingUser.passwordHash);
        // 5. if mismatch → invalid credentials
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // 6. (later) generate JWT
        const token = jwt.sign(
            { id: existingUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        // 7. send success response
        return res.status(200).json({
            message: "Login successful",
            token,
        })
    } catch (err) {
        // error handling
        res.status(500).json({ message: err.message });
    }
};
