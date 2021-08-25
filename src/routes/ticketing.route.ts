import express, { Router, Request, Response } from "express";
import {
  sanitizeSignupParams,
  sanitizeSigninParams,
  validateRequest,
  currentUser,
} from "@stagefirelabs/common";

const router: Router = express.Router();

export { router as ticketingRouter };
