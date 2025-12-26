const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        // READ TOKEN FROM COOKIE
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // same as before
        req.user = { id: decoded.id };

        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
