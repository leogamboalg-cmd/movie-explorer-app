const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const cors = require("cors");
app.use(cors());

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Movie API backend is running");
});

app.post("/addToFavorites", (req, res) => {
  console.log(req.body);
  res.json({ message: "Login received" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const testRoutes = require("./routes/testRoutes");
app.use("/api/test", testRoutes);
