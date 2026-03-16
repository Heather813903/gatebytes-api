const { app } = require("../app");
const get_chai = require("../util/get_chai");
const KitItem = require("../models/KitItem");

const TEMP_USER_ID = "699f6182e47fcd21d2ee2dbe";

describe("crud operations", function () {
  before(async () => {
    await KitItem.deleteMany({});

    const items = [];

    for (let i = 1; i <= 20; i++) {
      items.push({
        name: `Test Item ${i}`,
        quantity: i,
        lowStockThreshold: 1,
        category: "snack",
        notes: `Seed item ${i}`,
        user: TEMP_USER_ID,
      });
    }

    await KitItem.insertMany(items);
  });

  it("should get the dashboard page", async () => {
    const { expect, request } = await get_chai();

    const req = request.execute(app).get("/dashboard").send();
    const res = await req;

    expect(res).to.have.status(200);
    expect(res).to.have.property("text");
    expect(res.text).to.include("Your Meal Kit Dashboard");
  });

  it("should show 20 seeded items on the dashboard", async () => {
    const { expect, request } = await get_chai();

    const req = request.execute(app).get("/dashboard").send();
    const res = await req;

    expect(res).to.have.status(200);

    const pageParts = res.text.split('class="item-card"');
    expect(pageParts.length).to.equal(21);
  });

  it("should get the add item page", async () => {
    const { expect, request } = await get_chai();

    const req = request.execute(app).get("/add-item").send();
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
      .set("content-type", "application/x-www-form-urlencoded")
      .send(dataToPost);

    const res = await req;

    expect(res).to.have.status(200);
    expect(res).to.have.property("redirects");
    expect(res.redirects[0]).to.include("/dashboard");

    const items = await KitItem.find({ user: TEMP_USER_ID });
    expect(items.length).to.equal(21);

    const newItem = await KitItem.findOne({
      user: TEMP_USER_ID,
      name: "Protein Bars",
    });

    expect(newItem).to.not.be.null;
    expect(newItem.quantity).to.equal(3);
    expect(newItem.category).to.equal("snack");
  });
});