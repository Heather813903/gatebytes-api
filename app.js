require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

// Middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the GateBytes API!");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});