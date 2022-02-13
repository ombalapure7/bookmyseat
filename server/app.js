require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const cors = require("cors");

// Db connection
const connectDb = require("./db/connect");

// Auth middleware
const authMiddleware = require("./middleware/authentication");

// Routers
const authRouter = require("./routes/auth");
const theaterRouter = require("./routes/theaters");
const movieRouter = require("./routes/movies");

// Error handlers
const notFoundMiddleware = require("./middleware/not-found");
app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("<h1>Login Registration.</h1>");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/theaters", authMiddleware, theaterRouter);
app.use("/api/v1/movies", movieRouter);
app.use(notFoundMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
