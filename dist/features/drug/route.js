"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("./../../middlewares");
const controller_1 = __importDefault(require("./controller"));
const drugRouter = express_1.default.Router();
drugRouter.post("/", [
    middlewares_1.useAuth,
    (0, middlewares_1.useCheckRole)("hospital"),
    middlewares_1.handleFileSizeLimitException,
    middlewares_1.fileUpload,
    middlewares_1.upload.fields([{ name: "imageUrl", maxCount: 1 }]),
], controller_1.default.createDrug);
drugRouter.get("/", [], controller_1.default.getAllDrugs);
drugRouter.get("/:id", [middlewares_1.useAuth, (0, middlewares_1.useCheckRole)("hospital")], controller_1.default.getDrugById);
drugRouter.put("/:id", [
    middlewares_1.useAuth,
    (0, middlewares_1.useCheckRole)("hospital"),
    middlewares_1.handleFileSizeLimitException,
    middlewares_1.fileUpload,
    middlewares_1.upload.fields([{ name: "imageUrl", maxCount: 1 }]),
], controller_1.default.updateDrug);
drugRouter.get("/me", [middlewares_1.useAuth, (0, middlewares_1.useCheckRole)("hospital")], controller_1.default.getHospitalDrugs);
drugRouter.delete("/:id", [middlewares_1.useAuth, (0, middlewares_1.useCheckRole)("hospital")], controller_1.default.deleteDrug);
exports.default = drugRouter;
