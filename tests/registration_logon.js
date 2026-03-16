const { app } = require("../app");
const { factory } = require("../util/seed_db");
const faker = require("@faker-js/faker").fakerEN_US;
const get_chai = require("../util/get_chai");
const User = require("../models/User");

describe("tests for registration and logon", function () {
  it("should get the registration page", async () => {
    const { expect, request } = await get_chai();
    const req = request.execute(app).get("/register").send();
    const res = await req;

    expect(res).to.have.status(200);
    expect(res).to.have.property("text");
    expect(res.text).to.include("Register");
  });

  it("should register the user", async () => {
    const { expect, request } = await get_chai();

    this.password = faker.internet.password();
    this.user = await factory.build("user", { password: this.password });

    const dataToPost = {
      name: this.user.name,
      email: this.user.email,
      password: this.password,
    };

    const req = request
      .execute(app)
      .post("/register")
      .set("content-type", "application/x-www-form-urlencoded")
      .send(dataToPost);

    const res = await req;

    expect(res).to.have.status(200);
    expect(res).to.have.property("redirects");
    expect(res.redirects[0]).to.include("/login");

    const newUser = await User.findOne({ email: this.user.email });
    expect(newUser).to.not.be.null;
  });

  it("should log the user on", async () => {
    const { expect, request } = await get_chai();

    const dataToPost = {
      email: this.user.email,
      password: this.password,
    };

    const req = request
      .execute(app)
      .post("/login")
      .set("content-type", "application/x-www-form-urlencoded")
      .redirects(0)
      .send(dataToPost);

    const res = await req;

    expect(res).to.have.status(302);
    expect(res.headers.location).to.equal("/dashboard");
  });

  it("should log the user off", async () => {
    const { expect, request } = await get_chai();

    const req = request
      .execute(app)
      .get("/logout")
      .redirects(0)
      .send();

    const res = await req;

    expect(res).to.have.status(302);
    expect(res.headers.location).to.equal("/login");
  });
});