const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");
const auth = require("../middleware/authentication");

router.get("/test", (req, res) => {
  res.json({ msg: "auth route works" });
});

router.post("/register", register);
router.post("/login", login);

router.get("/protected", auth, (req, res) => {
  res.json({ 
    msg: "You have accessed a protected route",
    user: req.user });
});

module.exports = router;
