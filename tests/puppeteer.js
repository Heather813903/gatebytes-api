const puppeteer = require("puppeteer");
require("../app");

const { seed_db, testUserPassword } = require("../util/seed_db");
const User = require("../models/User");
const KitItem = require("../models/KitItem");

let testUser = null;
let page = null;
let browser = null;

describe("gatebytes puppeteer test", function () {
  before(async function () {
    this.timeout(10000);

    await User.deleteMany({});
    await KitItem.deleteMany({});

    testUser = await seed_db();

    

    browser = await puppeteer.launch();
    page = await browser.newPage();

    await page.goto("http://localhost:3000");
  });

  after(async function () {
    this.timeout(5000);
    await browser.close();
  });

  describe("index page test", function () {
    this.timeout(10000);

    it("finds the login link", async () => {
      this.loginLink = await page.waitForSelector('a[href="/login"]');
    });

    it("gets to the login page", async () => {
      await this.loginLink.click();
      await page.waitForNavigation();
      await page.waitForSelector('input[name="email"]');
    });
  });

  describe("login page test", function () {
    this.timeout(20000);

    it("resolves all the fields", async () => {
      this.email = await page.waitForSelector('input[name="email"]');
      this.password = await page.waitForSelector('input[name="password"]');
      this.submit = await page.waitForSelector('button[type="submit"]');
    });

    it("sends the login", async () => {
      await this.email.type(testUser.email);
      await this.password.type(testUserPassword);

      await this.submit.click();
      await page.waitForNavigation();

      await page.waitForSelector("h2");

      const pageContent = await page.content();

      if (!pageContent.includes("Your Meal Kit Dashboard")) {
        throw new Error("Dashboard page did not load after login");
      }
    });
  });

  describe("puppeteer kit item operations", function () {
    this.timeout(20000);

    it("gets to the dashboard and shows seeded items", async () => {
      await page.goto("http://localhost:3000/dashboard");

      await page.waitForSelector("h2");

      const pageContent = await page.content();

      if (!pageContent.includes("Your Meal Kit Dashboard")) {
        throw new Error("Dashboard page did not load");
      }

      const itemCards = pageContent.split('class="item-card"');

      if (itemCards.length !== 21) {
        throw new Error(`Expected 20 items but found ${itemCards.length - 1}`);
      }
    });

    it("gets to the add item page", async () => {
      await page.goto("http://localhost:3000/add-item");

      await page.waitForSelector('input[name="name"]');

      const pageContent = await page.content();

      if (!pageContent.includes("Add New Item")) {
        throw new Error("Add item page did not load");
      }
    });

    it("fills out and submits the add item form", async () => {
      await page.goto("http://localhost:3000/add-item");

      const name = await page.waitForSelector('input[name="name"]');
      const quantity = await page.waitForSelector('input[name="quantity"]');
      const threshold = await page.waitForSelector('input[name="lowStockThreshold"]');
      const category = await page.waitForSelector('select[name="category"]');
      const notes = await page.waitForSelector('input[name="notes"]');
      const submit = await page.waitForSelector('button[type="submit"]');

      await name.type("Puppeteer Snack Pack");
      await quantity.type("4");
      await threshold.type("1");
      await category.select("snack");
      await notes.type("Added by puppeteer test");

      await submit.click();
      await page.waitForNavigation();

      const pageContent = await page.content();

      if (!pageContent.includes("Your Meal Kit Dashboard")) {
        throw new Error("Did not return to dashboard after adding item");
      }
    });

    it("verifies the new item exists in the database", async () => {
      const item = await KitItem.findOne({
        user: testUser._id,
        name: "Puppeteer Snack Pack",
      });

      if (!item) {
        throw new Error("New item was not found in the database");
      }
    });
  });
});