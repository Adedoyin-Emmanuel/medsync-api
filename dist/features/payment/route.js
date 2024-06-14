"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = __importDefault(require("./controller"));
const paymentRouter = express_1.default.Router();
paymentRouter.post("/create-hospital-account", controller_1.default.createHospitalSubMerchantAccount);
paymentRouter.post("/create-hospital-transaction", controller_1.default.createHospitalTransaction);
paymentRouter.post("/create-user-transaction", controller_1.default.createUserTransaction);
paymentRouter.get("/hospital-transaction", controller_1.default.getHospitalTransactions);
paymentRouter.get("/user-transaction", controller_1.default.getUserTransactions);
paymentRouter.post("/initiate-hospital-payment", controller_1.default.initiateHospitalPayment);
exports.default = paymentRouter;
