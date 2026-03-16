require("dotenv").config();
require("express-async-errors");

const express = require("express");
const connectDB = require("./db/connect");

let mongoURL = process.env.MONGO_URI;

if (process.env.NODE_ENV === "test") {
  mongoURL = process.env.MONGO_URI_TEST;
}


const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");


const authRoutes = require("./routes/authRoutes");
const pageRoutes = require("./routes/pageRoutes");

const kitRoutes = require("./routes/kitRoutes");


const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");



const app = express();

app.use((req, res, next) => {
  if (req.path == "/multiply") {
    res.set("Content-Type", "application/json");
  } else {
    res.set("Content-Type", "text/html");
  }
  next();
});



const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
});

app.set("view engine", "ejs");  
app.use(express.static("public"));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(helmet());
app.use(cors());
app.use(xss());
app.use(limiter);





app.use("/", pageRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/kits", kitRoutes);

app.get("/multiply", (req, res) => {
  const result = req.query.first * req.query.second;
  if (result.isNaN) {
    result = "NaN";
  } else if (result == null) {
    result = "null";
  }
  res.json({ result: result });
});


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;
const start = () => {
  try {
    require("./db/connect")(mongoURL);
    return app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`),
    );
  } catch (error) {
    console.log(error);
  }
};

start();

module.exports = { app };