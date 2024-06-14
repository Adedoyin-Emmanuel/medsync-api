import express from "express";
import PaymentController from "./controller";
const paymentRouter = express.Router();

paymentRouter.post(
  "/create-hospital-account",
  PaymentController.createHospitalSubMerchantAccount
);

paymentRouter.post(
  "/initiate-hospital-payment",
  PaymentController.initiateHospitalPayment
);

paymentRouter.get(
  "/hospital-transactions",
  PaymentController.getHospitalTransactions
);

paymentRouter.get("/user-transactions", PaymentController.getUserTransactions);

paymentRouter.post("/webhook", PaymentController.verifyWebhook);

export default paymentRouter;
