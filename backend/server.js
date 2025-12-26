const express = require("express");
require("dotenv").config();

// connect to database
require("./config/db");

const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// 🔐 middleware
app.use(cookieParser());

app.use(cors({
  origin: "http://127.0.0.1:5500", // your frontend URL
  credentials: true               // REQUIRED for cookies
}));

app.use(express.json());

// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/friends", require("./routes/friendRoutes"));
app.use("/api/movies", require("./routes/movieRoutes"));
app.use("/api/test", require("./routes/testRoutes"));

// health check
app.get("/", (req, res) => {
  res.send("Movie API backend is running");
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
