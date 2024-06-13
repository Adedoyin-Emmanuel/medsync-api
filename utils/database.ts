import logger from "./logger";
import mongoConnect from "./mongo";

const connectToDb = async (): Promise<any> => {
  try {
    await mongoConnect();
  } catch (error: any) {
    logger.error(error);
    throw error;
  }
};

export default connectToDb;
