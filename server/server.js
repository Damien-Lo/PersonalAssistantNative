const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config({ path: "./.env" });
console.log("MONGO_URI:", process.env.MONGO_URI);

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

//=========================================
//              Routes
//=========================================
app.get("/", (req, res) => {
  console.log("✅ GET / route was hit");
  res.send("API is running...");
});

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

const ingredientRoutes = require("./routes/ingredientRoutes.js");
app.use("/api/ingredients", ingredientRoutes);

const dishRoutes = require("./routes/dishRoutes.js");
app.use("/api/dishes", dishRoutes);

const calendarEventRoutes = require("./routes/calendarEventRoutes.js");
app.use("/api/calendarEvents", calendarEventRoutes);

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
