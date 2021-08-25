import request from "supertest";
import faker from "faker";

import { app } from "../../app";
import { signUp } from "../../test/auth.helper";

describe("SIGNUP", () => {
  it("should return 201 on signup success", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        email: faker.internet.email(),
        password: faker.internet.password(),
      })
      .expect(201);
  });

  it("should return 400 on invalid email", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        email: "",
        password: faker.internet.password(),
      })
      .expect(400);
  });

  it("should return 400 on invalid password", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        email: faker.internet.email(),
        password: "",
      })
      .expect(400);
  });

  it("should return 400 on invalid password and email", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        email: "",
        password: "",
      })
      .expect(400);
  });

  it("disallows duplicate emails", async () => {
    const testEmail = faker.internet.email();
    await request(app)
      .post("/api/users/signup")
      .send({
        email: testEmail,
        password: faker.internet.password(),
      })
      .expect(201);

    await request(app)
      .post("/api/users/signup")
      .send({
        email: testEmail,
        password: faker.internet.password(),
      })
      .expect(400);
  });

  it("sets a cookie after successful signup", async () => {
    const response = await request(app)
      .post("/api/users/signup")
      .send({
        email: faker.internet.email(),
        password: faker.internet.password(),
      })
      .expect(201);

    expect(response.get("Set-Cookie")).toBeDefined();
  });
});

describe("SIGIN", () => {
  it("fails when an invalid email is supplied", async () => {
    const { testPass } = await signUp();

    await request(app)
      .post("/api/users/signin")
      .send({
        email: "fail@email.com",
        password: testPass,
      })
      .expect(400);
  });

  it("fails when an invalid password is supplied", async () => {
    const { testEmail } = await signUp();

    await request(app)
      .post("/api/users/signin")
      .send({
        email: testEmail,
        password: "failpassword",
      })
      .expect(400);
  });

  it("sets a cookie after successful signin", async () => {
    const { testPass, testEmail } = await signUp();

    const response = await request(app)
      .post("/api/users/signin")
      .send({
        email: testEmail,
        password: testPass,
      })
      .expect(200);

    expect(response.get("Set-Cookie")).toBeDefined();
  });
});

describe("SIGNOUT", () => {
  it("clears a cookie after signing out", async () => {
    const response = await request(app)
      .post("/api/users/signout")
      .send({})
      .expect(200);

    expect(response.get("Set-Cookie")[0]).toEqual(
      "express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
    );
  });
});

describe("CURRENTUSER", () => {
  it("returns details of the current user", async () => {
    const { cookie } = await signUp();

    const response = await request(app)
      .get("/api/users/currentuser")
      .set("Cookie", cookie)
      .expect(200);
    expect(response.body.currentUser).toBeDefined();
  });

  it("returns current user as null if nobody is signed-in", async () => {
    const response = await request(app)
      .get("/api/users/currentuser")
      .expect(200);
    expect(response.body.currentUser).toBeNull();
  });
});
