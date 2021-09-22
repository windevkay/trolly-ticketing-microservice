import express, { Router, Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@stagefirelabs/common";

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

export { router as ticketingRouter };
