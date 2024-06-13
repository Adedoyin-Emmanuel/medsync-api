import { Request, Response, NextFunction } from "express";
import { response } from "../utils/";
import logger from "../utils/logger";
import { SOMETHING_WENT_WRONG } from "../constants/errors";
import Joi from "joi";

const useErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err.stack);

  if (err instanceof Joi.ValidationError) {
    return response(res, 400, err.details[0].message);
  }
  const isProduction = process.env.NODE_ENV === "production";

  return response(
    res,
    500,
    `${SOMETHING_WENT_WRONG} ${isProduction ? "" : err.stack}`
  );
};

export default useErrorHandler;
