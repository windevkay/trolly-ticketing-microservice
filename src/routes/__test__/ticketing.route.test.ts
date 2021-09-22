import request from "supertest";
import faker from "faker";

import { Ticket } from "../../models/ticket.model";
import { app } from "../../app";
import { generateCookie } from "../../test/auth.helper";

it("has a route handler listening on /api/tickets for post requests", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", generateCookie())
    .send({});

  expect(response.status).not.toEqual(404);
});

it.skip("can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", generateCookie())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", generateCookie())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", generateCookie())
    .send({
      price: 10,
    })
    .expect(400);
});

it("returns an error if an invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", generateCookie())
    .send({
      title: faker.datatype.string(),
      price: -10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", generateCookie())
    .send({
      title: faker.datatype.string(),
    })
    .expect(400);
});

it("creates a ticket with valid inputs", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", generateCookie())
    .send({
      title: faker.datatype.string(),
      price: faker.datatype.number(),
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
});
