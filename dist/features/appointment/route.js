"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("./../../middlewares");
const controller_1 = __importDefault(require("./controller"));
const appointmentRouter = express_1.default.Router();
appointmentRouter.post("/", [middlewares_1.useAuth, (0, middlewares_1.useCheckRole)("user")], controller_1.default.createAppointment);
appointmentRouter.get("/recent", [middlewares_1.useAuth], controller_1.default.getRecentAppointments);
appointmentRouter.get("/user", [middlewares_1.useAuth, (0, middlewares_1.useCheckRole)("user")], controller_1.default.getUserAppointments);
appointmentRouter.get("/hospital", [middlewares_1.useAuth, (0, middlewares_1.useCheckRole)("hospital")], controller_1.default.getHospitalAppointments);
appointmentRouter.get("/:id", [middlewares_1.useAuth], controller_1.default.getAppointmentById);
appointmentRouter.put("/", [middlewares_1.useAuth, (0, middlewares_1.useCheckRole)("user")], controller_1.default.updateAppointment);
appointmentRouter.delete("/", [middlewares_1.useAuth, (0, middlewares_1.useCheckRole)("user")], controller_1.default.deleteAppointment);
exports.default = appointmentRouter;
