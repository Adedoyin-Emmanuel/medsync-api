import express from "express";
import PaymentController from "./controller";
const paymentRouter = express.Router();

paymentRouter.post(
  "/create-hospital-account",
  PaymentController.createHospitalSubMerchantAccount
);
paymentRouter.post(
  "/create-hospital-transaction",
  PaymentController.createHospitalTransaction
);
paymentRouter.post(
  "/create-user-transaction",
  PaymentController.createUserTransaction
);

paymentRouter.get(
  "/hospital-transactions",
  PaymentController.getHospitalTransactions
);
paymentRouter.get("/user-transactions", PaymentController.getUserTransactions);

paymentRouter.post(
  "/initiate-hospital-payment",
  PaymentController.initiateHospitalPayment
);

export default paymentRouter;
