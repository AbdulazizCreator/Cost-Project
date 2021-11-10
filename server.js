const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const colors = require("colors");

//routes
const auth = require("./routes/auth");
const costs = require("./routes/costs");
const users = require("./routes/users");

// Connect mongo
const connectDB = require("./config/db");

// Error handle
const errorHandler = require("./middleware/error");
dotenv.config({ path: "./config/config.env" });

const app = express();

connectDB();

app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Enable CORS
app.use(cors());

// Error handler
app.use(errorHandler);

app.use("/api/v1/auth", auth);
app.use("/api/v1/costs", costs);
app.use("/api/v1/users", users);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
