import request from "supertest";
import faker from "faker";

import { app } from "../app";

export const signUp = async () => {
  const testEmail = faker.internet.email();
  const testPass = faker.internet.password();
  // signup
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: testEmail,
      password: testPass,
    })
    .expect(201);
  const cookie = response.get("Set-Cookie");
  return Promise.resolve({ testEmail, testPass, cookie });
};
