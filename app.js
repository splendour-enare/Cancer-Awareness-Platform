// app.js
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// ---------------- MIDDLEWARE ----------------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const session = require("express-session");

app.use(session({
  secret: "Chixxing!23@5",  // change this to something secure
  resave: false,
  saveUninitialized: false,
}));


// ---------------- VIEW ENGINE ----------------
app.set("view engine", "ejs");

// ---------------- DATABASE CONNECTION ----------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

const fs = require("fs");

const uploadDir = path.join(__dirname, "public/uploads/resources");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ---------------- ROUTES ----------------
const authRoutes = require("./routes/authRoutes");
app.use("/", authRoutes);

app.use("/uploads", express.static("uploads"));

// ---------------- SERVER ----------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);