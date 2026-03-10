require("dotenv").config();
require("express-async-errors");

const express = require("express");
const connectDB = require("./db/connect");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

const authRoutes = require("./routes/authRoutes");

const kitRoutes = require("./routes/kitRoutes");
const KitItem = require("./models/KitItem");

const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

const User = require("./models/User");

const TEMP_USER_ID = "699f6182e47fcd21d2ee2dbe";


const app = express();


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
});

app.set("view engine", "ejs");  
app.use(express.static("public"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

app.post("/login", async (req, res) => {
  const { email, password } = req.body;   
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("Invalid email or password");
    } 
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).send("Invalid email or password");
    }   
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res.send("Error logging in");
  }
});

app.get("/register", (req, res) => {
  res.render("register", { title: "Register - GateBytes" });
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    await User.create({ name, email, password });
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.send("Error registering user");
  }
});

app.get("/dashboard", async (req, res) => {
  try {
    const items = await KitItem.find({
      user: TEMP_USER_ID
    });

    res.render("dashboard", {
      title: "Dashboard - GateBytes",
      items
    });
  } catch (error) {
    console.log(error);
    res.send("Error loading dashboard");
  }
});

app.get("/add-item", (req, res) => {
  res.render("add-item", { title: "Add Item - GateBytes" });
});

app.post("/add-item", async (req, res) => {
  const { name, quantity, lowStockThreshold, category, notes } = req.body;

  try {
    await KitItem.create({ name, quantity, lowStockThreshold, category, notes, user: TEMP_USER_ID });
    
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding item");
  }
});
app.post("/delete-item/:id", async (req, res) => {
  try {
    await KitItem.findOneAndDelete({
      _id: req.params.id,
      user: TEMP_USER_ID
    });

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res.send("Error deleting item");
  }
});
app.get("/edit-item/:id", async (req, res) => {
  try {
    const item = await KitItem.findOne({
      _id: req.params.id,
      user: TEMP_USER_ID
    });

    if (!item) {
      return res.send("Item not found");
    }

    res.render("edit-item", {
      title: "Edit Item - GateBytes",
      item
    });
  } catch (error) {
    console.log(error);
    res.send("Error loading item");
  }
});
app.post("/edit-item/:id", async (req, res) => {
  const { name, quantity, lowStockThreshold, category, notes } = req.body;

  try {
    await KitItem.findOneAndUpdate(
      {
        _id: req.params.id,
        user: TEMP_USER_ID
      },
      {
        name,
        quantity,
        lowStockThreshold,
        category,
        notes
      },
      { new: true, runValidators: true }
    );

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res.send("Error updating item");
  }
});

app.get("/logout", (req, res) => {
  console.log("logout route hit");
  res.redirect("/login");
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