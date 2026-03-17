const KitItem = require("../models/KitItem");
const User = require("../models/User");
const faker = require("@faker-js/faker").fakerEN_US;
const FactoryBot = require("factory-bot");
require("dotenv").config();

const testUserPassword = faker.internet.password();

const factory = FactoryBot.factory;
const factoryAdapter = new FactoryBot.MongooseAdapter();
factory.setAdapter(factoryAdapter);

factory.define("kitItem", KitItem, {
  name: () => faker.food.dish(),
  quantity: () => Math.floor(Math.random() * 5) + 1,
  lowStockThreshold: () => 1,
  category: () =>
    ["snack", "meal", "drink", "other", "breakfast", "lunch", "dinner"][
      Math.floor(Math.random() * 7)
    ],
  notes: () => faker.lorem.words(3),
});

factory.define("user", User, {
  name: () => faker.person.fullName(),
  email: () => faker.internet.email(),
  password: () => faker.internet.password(),
});

const seed_db = async () => {
  let testUser = null;

  try {
    await KitItem.deleteMany({});
    await User.deleteMany({});

    testUser = await factory.create("user", { password: testUserPassword });
    await factory.createMany("kitItem", 20, { user: testUser._id });
  } catch (e) {
    console.log("database error");
    console.log(e.message);
    throw e;
  }

  return testUser;
};

module.exports = { testUserPassword, factory, seed_db };