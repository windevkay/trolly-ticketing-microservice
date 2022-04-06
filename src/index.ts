import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

import { natsWrapper } from "./nats.wrapper";
import { app } from "./app";
import {
  OrderCancelledListener,
  OrderCreatedListener,
} from "./events/listeners";

const PORT = 3000;

const runServer = async () => {
  try {
    // connect to NATS
    await natsWrapper.connect(
      `${process.env.NATS_CLUSTER_ID}`,
      `${process.env.NATS_CLIENT_ID}`,
      `${process.env.NATS_URL}`
    );
    // handle graceful shutdown
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

    await mongoose.connect(`${process.env.MONGO_URI}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }

  app.listen(PORT, () => {
    console.log(`Ticketing Service running on port ${PORT}`);
  });
};

runServer();
