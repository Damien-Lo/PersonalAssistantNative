// server/server.js
require("dotenv").config(); // load .env once

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

const allowlist = [
  "http://localhost:19006", // Expo web dev
  "http://localhost:4000", // React dev (if you use it)
  // 'https://yourapp.com',  // add real domains for prod
];

//CORS - Need to double check what this does
app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      return cb(null, allowlist.includes(origin));
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);

app.use(express.json());
app.use((req, _res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// Routes (public)
app.get("/", (_req, res) => res.send("API is running..."));

app.use("/auth", require("./routes/authRoutes.js"));
app.use("/api", require("./middleware/requireAuth.js"));

// Routes (Authenticated)
const ingredientRoutes = require("./routes/ingredientRoutes.js");
app.use("/api/ingredients", ingredientRoutes);

const dishRoutes = require("./routes/dishRoutes.js");
app.use("/api/dishes", dishRoutes);

const calendarEventRoutes = require("./routes/calendarEventRoutes.js");
app.use("/api/calendarEvents", calendarEventRoutes);

//DB and Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
