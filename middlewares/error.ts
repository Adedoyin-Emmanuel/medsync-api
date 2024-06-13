import { Request, Response, NextFunction } from "express";
import response from "../utils/response";
import logger from "../utils/logger";
import { SOMETHING_WENT_WRONG } from "../constants/errors";

const useErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err);
  const isProduction = process.env.NODE_ENV === "production";
  return response(
    res,
    500,
    `${SOMETHING_WENT_WRONG} ${isProduction ? "" : err}`
  );
};

export default useErrorHandler;
