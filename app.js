require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const ratelimiter = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const margan = require("morgan");

const connectDB = require("./db/connect");
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authMiddleWare = require("./middleware/authentication");

const app = express();

// extra packages
app.use(
  ratelimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use(xss());
if (app.get("env") === "development") {
  app.use(margan("tiny"));
}

// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/jobs", authMiddleWare.auth, require("./routes/jobs"));

// error handler middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, async () => {
      console.log(`Server is listening on port ${port}...`);
      const user = require("./models/User");
      await user.find();
    });
  } catch (error) {
    console.log(error);
  }
};

start();
