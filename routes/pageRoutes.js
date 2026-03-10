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
  res.render("login", {
    title: "Login - GateBytes",
    error: null,
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).render("login", {
        title: "Login - GateBytes",
        error: "Invalid email or password. Please try again.",
      });
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).render("login", {
        title: "Login - GateBytes",
        error: "Invalid email or password. Please try again.",
      });
    }

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    return res.status(500).render("login", {
      title: "Login - GateBytes",
      error: "Error logging in. Please try again.",
    });
  }
});

router.get("/register", (req, res) => {
  res.render("register", {
    title: "Register - GateBytes",
    error: null,
  });
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    await User.create({ name, email, password });
    res.redirect("/login");
  } catch (error) {
    console.log(error);

    let message = "Error registering user. Please try again.";

    if (error.code === 11000) {
      message = "Email already exists. Please use a different email.";
    }

    return res.status(400).render("register", {
      title: "Register - GateBytes",
      error: message,
    });
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
    res.send("Something went wrong. Please try again.");
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
    res.status(500).send("Error adding item. Please try again.");
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
    res.send("Error deleting item. Please try again.");
  }
});

router.get("/edit-item/:id", async (req, res) => {
  try {
    const item = await KitItem.findOne({
      _id: req.params.id,
      user: TEMP_USER_ID,
    });

    if (!item) {
      return res.send("Item not found. Please try again.");
    }

    res.render("edit-item", {
      title: "Edit Item - GateBytes",
      item,
    });
  } catch (error) {
    console.log(error);
    res.send("Error loading item. Please try again.");
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
    res.send("Error updating item. Please try again.");
  }
});

router.get("/logout", (req, res) => {
  res.redirect("/login");
});

module.exports = router;