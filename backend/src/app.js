const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");

// Route imports
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/products.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/orders.routes");
const startupKitRoutes = require("./routes/startupKits.routes");
const startupApplicationRoutes = require("./routes/startupApplications.routes");
const providerRoutes = require("./routes/providers.routes");
const jobRoutes = require("./routes/jobs.routes");
const enquiryRoutes = require("./routes/enquiries.routes");
const adminRoutes = require("./routes/admin.routes");

// Middleware imports
const errorHandler = require("./middleware/errorHandler");

const app = express();

// ─── Security Middleware ─────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ─── Request Logging ─────────────────────────────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// ─── Body Parsers ────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── Rate Limiting ───────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // limit each IP to 100 requests per windowMs
  standardHeaders: true,     // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,      // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: "Too many requests from this IP. Please try again after 15 minutes.",
  },
});

app.use("/api", limiter);

// ─── Static Files ────────────────────────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// ─── Health Check ────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DreamStartup API is up and running",
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/startup-kits", startupKitRoutes);
app.use("/api/startup-applications", startupApplicationRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/admin", adminRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ─── Centralized Error Handler (must be last) ─────────────────────────────────
app.use(errorHandler);

module.exports = app;
