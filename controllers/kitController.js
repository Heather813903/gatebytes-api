const KitItem = require("../models/KitItem");

// CREATE
const createKitItem = async (req, res) => {
  const { name, quantity, lowStockThreshold, category, notes } = req.body;

  const item = await KitItem.create({
    name,
    quantity,
    lowStockThreshold,
    category,
    notes,
    user: req.user.userId,
  });

  res.status(201).json({ item });
};


const getAllKitItems = async (req, res) => {
  const items = await KitItem.find({ user: req.user.userId }).sort("createdAt");
  res.status(200).json({ count: items.length, items });
};


const getKitItem = async (req, res) => {
  const { id } = req.params;

  const item = await KitItem.findOne({ _id: id, user: req.user.userId });
  if (!item) {
    return res.status(404).json({ msg: "Kit item not found" });
  }

  res.status(200).json({ item });
};


const updateKitItem = async (req, res) => {
  const { id } = req.params;

  const item = await KitItem.findOneAndUpdate(
    { _id: id, user: req.user.userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!item) {
    return res.status(404).json({ msg: "Kit item not found" });
  }

  res.status(200).json({ item });
};


const deleteKitItem = async (req, res) => {
  const { id } = req.params;

  const item = await KitItem.findOneAndDelete({ _id: id, user: req.user.userId });

  if (!item) {
    return res.status(404).json({ msg: "Kit item not found" });
  }

  res.status(200).json({ msg: "Kit item deleted" });
};

module.exports = {
  createKitItem,
  getAllKitItems,
  getKitItem,
  updateKitItem,
  deleteKitItem,
};