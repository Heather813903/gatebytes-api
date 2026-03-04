const express = require("express");
const router = express.Router();

const auth = require("../middleware/authentication");
const {
  createKitItem,
  getAllKitItems,
  getKitItem,
  updateKitItem,
  deleteKitItem,
} = require("../controllers/kitController");  

router.use(auth);

router.route("/").post(createKitItem).get(getAllKitItems);
router.route("/:id").get(getKitItem).patch(updateKitItem).delete(deleteKitItem);

module.exports = router;