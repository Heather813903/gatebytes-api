require("dotenv").config();
require("express-async-errors");

const express = require("express");
const connectDB = require("./db/connect");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

const authRoutes = require("./routes/authRoutes");

const kitRoutes = require("./routes/kitRoutes");

const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");


const app = express();


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
});

app.set("view engine", "ejs");  
app.use(express.static("public"));

// Middleware
app.use(express.json());

app.use(helmet());
app.use(cors());
app.use(xss());
app.use(limiter);



// Routes
app.get("/", (req, res) => {
  res.render("layout", { title: "GateBytes" });
});

app.get("/login", (req, res) => {
  res.render("login", { title: "Login - GateBytes" });
});

app.get("/register", (req, res) => {
  res.render("register", { title: "Register - GateBytes" });
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard", { title: "Dashboard - GateBytes" });
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