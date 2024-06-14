"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../../middlewares/");
const controller_1 = __importDefault(require("./controller"));
const userRouter = express_1.default.Router();
userRouter.get("/me", [middlewares_1.useAuth], controller_1.default.getMe);
userRouter.get("/", [middlewares_1.useAuth], controller_1.default.getAllUsers);
userRouter.get("/hospital", [middlewares_1.useAuth], controller_1.default.getAllHospitals);
userRouter.get("/:id", controller_1.default.getEntityById);
userRouter.put("/", [middlewares_1.useAuth, (0, middlewares_1.useCheckRole)("user")], controller_1.default.updateUser);
userRouter.put("/hospital/", [
    middlewares_1.useAuth,
    (0, middlewares_1.useCheckRole)("hospital"),
    middlewares_1.handleFileSizeLimitException,
    middlewares_1.upload.fields([{ name: "profilePicture", maxCount: 1 }]),
    middlewares_1.fileUpload,
], controller_1.default.updateHospital);
exports.default = userRouter;
