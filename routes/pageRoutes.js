const express = require("express");
const router = express.Router();

const KitItem = require("../models/KitItem");
const User = require("../models/User");

// Temporary user ID for testing purposes
const TEMP_USER_ID = "699f6182e47fcd21d2ee2dbe";

router.get("/", (req, res) => {
  res.render("layout", { title: "GateBytes" });
});

router.get("/login", (req, res) => {
  res.render("login", { title: "Login - GateBytes" });
});

router.post("/login", async (req, res) => {
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

router.get("/register", (req, res) => {
  res.render("register", { title: "Register - GateBytes" });
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    await User.create({ name, email, password });
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.send("Error registering user");
  }
});

router.get("/dashboard", async (req, res) => {
  try {
    const items = await KitItem.find({
      user: TEMP_USER_ID,
    });

    res.render("dashboard", {
      title: "Dashboard - GateBytes",
      items,
    });
  } catch (error) {
    console.log(error);
    res.send("Error loading dashboard");
  }
});

router.get("/add-item", (req, res) => {
  res.render("add-item", { title: "Add Item - GateBytes" });
});

router.post("/add-item", async (req, res) => {
  const { name, quantity, lowStockThreshold, category, notes } = req.body;

  try {
    await KitItem.create({
      name,
      quantity,
      lowStockThreshold,
      category,
      notes,
      user: TEMP_USER_ID,
    });

    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding item");
  }
});

router.post("/delete-item/:id", async (req, res) => {
  try {
    await KitItem.findOneAndDelete({
      _id: req.params.id,
      user: TEMP_USER_ID,
    });

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res.send("Error deleting item");
  }
});

router.get("/edit-item/:id", async (req, res) => {
  try {
    const item = await KitItem.findOne({
      _id: req.params.id,
      user: TEMP_USER_ID,
    });

    if (!item) {
      return res.send("Item not found");
    }

    res.render("edit-item", {
      title: "Edit Item - GateBytes",
      item,
    });
  } catch (error) {
    console.log(error);
    res.send("Error loading item");
  }
});

router.post("/edit-item/:id", async (req, res) => {
  const { name, quantity, lowStockThreshold, category, notes } = req.body;

  try {
    await KitItem.findOneAndUpdate(
      {
        _id: req.params.id,
        user: TEMP_USER_ID,
      },
      {
        name,
        quantity,
        lowStockThreshold,
        category,
        notes,
      },
      { new: true, runValidators: true }
    );

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res.send("Error updating item");
  }
});

router.get("/logout", (req, res) => {
  res.redirect("/login");
});

module.exports = router;