import { NextFunction, Request, Response } from "express";
import { response } from "../utils";
import { INSUFFICIENT_PERMISSION } from "../constants/errors";

declare global {
  namespace Express {
    interface Request {
      user?: any;
      userType: "user" | "hospital";
    }
  }
}

const useCheckRole = (role: "user" | "hospital" | "admin") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userType = req.userType;

    console.log(userType, role);

    if (userType === role) {
      next();
    } else {
      return response(res, 403, INSUFFICIENT_PERMISSION);
    }
  };
};

export default useCheckRole;
