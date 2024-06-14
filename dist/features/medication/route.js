"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("./../../middlewares");
const controller_1 = __importDefault(require("./controller"));
const medicationRouter = express_1.default.Router();
medicationRouter.post("/", [middlewares_1.useAuth, (0, middlewares_1.useCheckRole)("hospital")], controller_1.default.createMedication);
medicationRouter.get("/", [middlewares_1.useAuth], controller_1.default.getAllMedications);
medicationRouter.get("/:id", [middlewares_1.useAuth], controller_1.default.getMedicationById);
medicationRouter.get("/user/", [middlewares_1.useAuth, (0, middlewares_1.useCheckRole)("user")], controller_1.default.getUserMedications);
medicationRouter.get("/hospital", [middlewares_1.useAuth, (0, middlewares_1.useCheckRole)("hospital")], controller_1.default.getHospitalMedications);
medicationRouter.put("/:id", [middlewares_1.useAuth, (0, middlewares_1.useCheckRole)("hospital")], controller_1.default.updateMedication);
medicationRouter.delete("/:id", [middlewares_1.useAuth, (0, middlewares_1.useCheckRole)("hospital")], controller_1.default.deleteMedication);
exports.default = medicationRouter;
