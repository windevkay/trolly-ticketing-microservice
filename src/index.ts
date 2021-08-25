import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

import { app } from "./app";

const PORT = 3000;

const runServer = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_CLUSTER_ADDRESS}`, {
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
