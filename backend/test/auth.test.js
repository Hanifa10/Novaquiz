const request = require("supertest");
const app = require("../server");

describe("Auth API", () => {

  let token;

  it("register user", async () => {

    const res = await request(app)
      .post("/api/auth/register")
      .send({
        lastName: "Test User",
        firstName: "use",
        email: "test@mail.com",
        password: "123456000"
      });

    if (res.statusCode !== 200) {
      console.log("Register error:", res.body.error);
    }
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("jwt");
  });

  it("login user", async () => {

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@mail.com",
        password: "123456000"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("jwt");

    token = res.body.jwt;
  });

});