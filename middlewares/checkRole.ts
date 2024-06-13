import { NextFunction, Request, Response } from "express";
import { response } from "../utils";
import { INSUFFICIENT_PERMISSION } from "../constants/errors";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const useCheckRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const isUser = req.user;

    return response(res, 403, INSUFFICIENT_PERMISSION);
  };
};

export default useCheckRole;
