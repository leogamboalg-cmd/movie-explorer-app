// authMiddleware.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        //  Try cookie first (desktop, same-site)
        let token = req.cookies?.token;

        //  Fallback to Authorization header (mobile, incognito)
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            }
        }

        //  No token anywhere → unauthorized
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        //  Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 5 Attach user to request
        req.user = { id: decoded.id };

        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
