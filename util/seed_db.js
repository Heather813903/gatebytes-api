const KitItem = require("../models/KitItem");
const User = require("../models/User");
const faker = require("@faker-js/faker").fakerEN_US;
require("dotenv").config();

const testUserPassword = faker.internet.password();

const factory = {
  build: async (type, overrides = {}) => {
    if (type === "user") {
      return {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        ...overrides,
      };
    }

    if (type === "kitItem") {
      const categories = [
        "snack",
        "meal",
        "drink",
        "other",
        "breakfast",
        "lunch",
        "dinner",
      ];

      return {
        name: faker.food.dish(),
        quantity: Math.floor(Math.random() * 5) + 1,
        lowStockThreshold: 1,
        category: categories[Math.floor(Math.random() * categories.length)],
        ...overrides,
      };
    }

    throw new Error(`Unknown factory type: ${type}`);
  },
};

const seed_db = async () => {
  let testUser = null;

  try {
    await KitItem.deleteMany({});
    await User.deleteMany({});

    testUser = await User.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: testUserPassword,
    });

    const items = [];
    const categories = [
      "snack",
      "meal",
      "drink",
      "other",
      "breakfast",
      "lunch",
      "dinner",
    ];

    for (let i = 0; i < 20; i++) {
      items.push({
        name: faker.food.dish(),
        quantity: Math.floor(Math.random() * 5) + 1,
        lowStockThreshold: 1,
        category: categories[Math.floor(Math.random() * categories.length)],
        user: testUser._id,
      });
    }

    await KitItem.insertMany(items);
  } catch (e) {
    console.log("database error");
    console.log(e.message);
    throw e;
  }

  return testUser;
};

module.exports = { testUserPassword, factory, seed_db };