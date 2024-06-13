import { NextFunction } from "express";
import jwt from "jsonwebtoken";
import { response } from "../utils";

const useAuth = (req: any, res: any, next: NextFunction) => {
  const refreshTokenCookie = req.cookies.refreshToken;

  if (!refreshTokenCookie)
    return response(res, 401, "Access denied, invalid or expired token");

  const JWT_SECRET: any = process.env.JWT_PRIVATE_KEY;

  let decodeCookie: any = jwt.verify(refreshTokenCookie, JWT_SECRET);

  if (decodeCookie) {
    req.user = decodeCookie;
    if (decodeCookie.role == "user") {
      req.userType = "user";
      next();
    } else if (decodeCookie.role == "hospital") {
      req.userType = "hospital";
      next();
    } else {
      return response(res, 401, "Invalid auth token");
    }
  } else {
    return response(res, 401, "Invalid auth token");
  }
};

export default useAuth;
