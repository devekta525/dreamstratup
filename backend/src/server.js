require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// ─── Unhandled Promise Rejections ────────────────────────────────────────────
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  console.error(err.stack);
  // Gracefully shut down the server
  server.close(() => {
    process.exit(1);
  });
});

// ─── Uncaught Exceptions ─────────────────────────────────────────────────────
process.on("uncaughtException", (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});

// ─── Connect to Database then Start Server ───────────────────────────────────
const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  });

  // Handle SIGTERM for graceful shutdown (e.g., in Docker / cloud environments)
  process.on("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down gracefully...");
    server.close(() => {
      console.log("Server closed.");
      process.exit(0);
    });
  });
};

startServer();
