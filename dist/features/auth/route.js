"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../../middlewares");
const controller_1 = __importDefault(require("./controller"));
const authRouter = express_1.default.Router();
authRouter.post("/signup-user", [middlewares_1.useErrorHandler], controller_1.default.createUser);
authRouter.post("/signup-hospital", controller_1.default.createHospital);
authRouter.post("/login/", controller_1.default.login);
authRouter.post("/logout", controller_1.default.logout);
authRouter.get("/verify-email", controller_1.default.verifyEmail);
authRouter.get("/refresh-token");
exports.default = authRouter;
