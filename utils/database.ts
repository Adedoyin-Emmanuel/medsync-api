import prisma from "./prisma";
import logger from "./logger";
const connectToDb = async (): Promise<any> => {
  try {
    await prisma.$connect();
  } catch (error: any) {
    logger.error(error);
    throw error;
  }
};

export default connectToDb;
