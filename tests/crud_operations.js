const { app } = require("../app");
const get_chai = require("../util/get_chai");
const KitItem = require("../models/KitItem");
const { seed_db, testUserPassword } = require("../util/seed_db");

describe("crud operations", function () {
  before(async () => {
    const { request } = await get_chai();

    this.test_user = await seed_db();

    const loginData = {
      email: this.test_user.email,
      password: testUserPassword,
    };

    const req = request
      .execute(app)
      .post("/login")
      .set("content-type", "application/x-www-form-urlencoded")
      .redirects(0)
      .send(loginData);

    const res = await req;

    const cookies = res.headers["set-cookie"];
    this.sessionCookie = cookies.find((element) =>
      element.startsWith("connect.sid")
    );
  });

  it("should get the dashboard page", async () => {
    const { expect, request } = await get_chai();

    const req = request
      .execute(app)
      .get("/dashboard")
      .set("Cookie", this.sessionCookie)
      .send();

    const res = await req;

    expect(res).to.have.status(200);
    expect(res).to.have.property("text");
    expect(res.text).to.include("Your Meal Kit Dashboard");
  });

  it("should show 20 seeded items on the dashboard", async () => {
    const { expect, request } = await get_chai();

    const req = request
      .execute(app)
      .get("/dashboard")
      .set("Cookie", this.sessionCookie)
      .send();

    const res = await req;

    expect(res).to.have.status(200);

    const pageParts = res.text.split('class="item-card"');
    expect(pageParts.length).to.equal(21);
  });

  it("should get the add item page", async () => {
    const { expect, request } = await get_chai();

    const req = request
      .execute(app)
      .get("/add-item")
      .set("Cookie", this.sessionCookie)
      .send();

    const res = await req;

    expect(res).to.have.status(200);
    expect(res).to.have.property("text");
    expect(res.text).to.include("Add New Item");
    expect(res.text).to.include("Save Item");
  });

  it("should add a new item", async () => {
    const { expect, request } = await get_chai();

    const dataToPost = {
      name: "Protein Bars",
      quantity: 3,
      lowStockThreshold: 1,
      category: "snack",
      notes: "For next trip",
    };

    const req = request
      .execute(app)
      .post("/add-item")
      .set("Cookie", this.sessionCookie)
      .set("content-type", "application/x-www-form-urlencoded")
      .send(dataToPost);

    const res = await req;

    expect(res).to.have.status(200);
    expect(res).to.have.property("redirects");
    expect(res.redirects[0]).to.include("/dashboard");

    const items = await KitItem.find({ user: this.test_user._id });
    expect(items.length).to.equal(21);

    const newItem = await KitItem.findOne({
      user: this.test_user._id,
      name: "Protein Bars",
    });

    expect(newItem).to.not.be.null;
    expect(newItem.quantity).to.equal(3);
    expect(newItem.category).to.equal("snack");
  });
});