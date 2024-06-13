import mongoose from "mongoose";
import { logger } from "./";

const mongoConnect = async () => {
  const dbUrl: any = process.env.DATABASE_URL;
  try {
    await mongoose.connect(dbUrl);
    logger.info(`Connected to Mongodb successfully at ${dbUrl}`);
  } catch (error) {
    logger.log(`Failed to connect to mongodb ${error}` as any);
  }
};

export default mongoConnect;
