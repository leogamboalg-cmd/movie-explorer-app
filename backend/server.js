const express = require("express");
require("dotenv").config();
require("./config/db");

const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());

const allowedOrigins = [
	"http://localhost:5500",
	"http://127.0.0.1:5500",
	"https://leogamboalg-cmd.github.io"
];


app.use(cors({
	origin: (origin, callback) => {
		if (!origin) return callback(null, true);

		if (allowedOrigins.includes(origin)) {
			return callback(null, origin); // 
		}

		return callback(new Error("CORS blocked"));
	},
	credentials: true
}));


app.use(express.json());

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 min
	max: 200, // max requests per IP
	message: "Too many requests, try again later."
});

// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/friends", require("./routes/friendRoutes"));
app.use("/api/movies", require("./routes/movieRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));

app.get("/", (req, res) => {
	res.send("Movie API backend is running");
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
