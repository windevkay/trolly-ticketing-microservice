import express, { Router, Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
} from "@stagefirelabs/common";

import { Ticket } from "../models/ticket.model";

const router: Router = express.Router();

router.post(
  "/",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price should be greater than zero"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await ticket.save();
    res.status(201).send(ticket);
  }
);

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const ticket = await Ticket.findById(id).exec();
  if (!ticket) {
    throw new NotFoundError();
  }

  res.send(ticket);
});

router.get("/", async (req: Request, res: Response) => {
  const tickets = await Ticket.find({});
  res.send(tickets);
});

export { router as ticketingRouter };
