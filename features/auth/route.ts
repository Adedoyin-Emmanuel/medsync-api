import express from "express";
import { useErrorHandler } from "../../middlewares";
import AuthController from "./controller";

const authRouter = express.Router();

authRouter.post("/signup-user", [useErrorHandler], AuthController.createUser);
authRouter.post("/signup-hospital", AuthController.createHospital);

authRouter.post("/login/", AuthController.login);
authRouter.post("/logout", AuthController.logout);

authRouter.get("/verify-email", AuthController.verifyEmail);
authRouter.get("/refresh-token");

export default authRouter;
