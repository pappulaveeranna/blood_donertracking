import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import donorRoutes from "./routes/donors.js";

// Load env vars
dotenv.config();

// Express app
const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001", 
    "https://blood-donor-frontend.netlify.app",
    "https://your-netlify-url.netlify.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Database connection
connectDB();

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Blood Donor Management API running..." });
});

app.use("/api/donors", donorRoutes);

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
