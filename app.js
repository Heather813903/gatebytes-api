require("dotenv").config();
require("express-async-errors");

const express = require("express");
const connectDB = require("./db/connect");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

const authRoutes = require("./routes/authRoutes");

const kitRoutes = require("./routes/kitRoutes");


const app = express();

// Middleware
app.use(express.json());



// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the GateBytes API!");
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/kits", kitRoutes);

//Error middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();  