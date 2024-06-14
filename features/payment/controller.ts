import { Response, Request } from "express";
import { squad, response } from "../../utils";
import {
  createHospitalSubMerchantAccountSchema,
  createHospitalTransactionSchema,
} from "./schema";
import { User } from "../auth/model";
import Payment from "./model";
import SquadSubMerchant from "@squadco/js/dist/core/sub-merchant";
class PaymentController {
  static async createHospitalSubMerchantAccount(req: Request, res: Response) {
    const hospitalId = req.user?._id;
    const value = await createHospitalSubMerchantAccountSchema.validateAsync(
      req.body
    );

    const createSubMerchantRequest = await squad.createSubMerchant(value);

    if (!createSubMerchantRequest.success)
      return response(res, 400, createSubMerchantRequest.message);

    const { account_id } = createSubMerchantRequest.data;

    const hospital = await User.findByIdAndUpdate(hospitalId, {
      merchantId: account_id,
    });

    if (!hospital)
      return response(res, 404, "Hospital with given id not found");

    return response(
      res,
      200,
      "Hospital sub merchant account created successfully",
      createSubMerchantRequest.data
    );
  }

  static async getHospitalSubMerchantAccount(req: Request, res: Response) {
    const subMerchantId = req.params.subMerchantId;

    if (!subMerchantId)
      return response(res, 400, "Sub merchant id is required");

    const hospital = await User.findOne({ merchantId: subMerchantId });

    if (!hospital)
      return response(
        res,
        400,
        "Hospital with given sub merchant id not found"
      );

    return response(res, 200, "Hospital retrived successfully", hospital);
  }

  static async initiateHospitalPayment(req: Request, res: Response) {
    const hospitalId = req.user?._id;
    const value = await createHospitalTransactionSchema.validateAsync(req.body);

    const { amount, userId, callbackUrl } = value;
    const hospital = await User.findById(hospitalId);
    const customer = await User.findById(userId);

    if (!customer) return response(res, 404, "User not found");

    const customerEmail = customer.email;
    const hospitalMerchantId = hospital?.merchantId;

    if (!hospitalMerchantId)
      return response(res, 401, "Hospital does not have a merchant id");

    const dataToSend = {
      amount,
      email: customerEmail,
      initiateType: "inline",
      currency: "NGN",
      customerName: customer.name,
      callbackUrl,
      metadata: {
        customerId: customer._id,
        hospitalId,
      },
      subMerchantId: hospitalMerchantId,
      passCharge: false, // transaction charges will be passed to the merchant (hospital)
    };

    const initiateHospitalPaymentRequest = await squad.initiatePayment(
      dataToSend
    );

    if (!initiateHospitalPaymentRequest.success)
      return response(res, 400, initiateHospitalPaymentRequest.message);

    const transactionRef = initiateHospitalPaymentRequest.data?.transaction_ref;
    const checkoutUrl = initiateHospitalPaymentRequest.data?.checkout_url;
    const merchantInfo = {
      merchantLogo:
        initiateHospitalPaymentRequest.data?.merchantInfo?.merchant_logo,
      merchantId:
        initiateHospitalPaymentRequest.data?.merchantInfo?.merchant_id,
    };

    await Payment.create({
      hospitalId,
      userId,
      amount,
      transactionReference: transactionRef,
    });

    const clientResponse = {
      checkoutUrl,
      ...merchantInfo,
    };

    return response(
      res,
      200,
      "Transaction initiated successfully",
      clientResponse
    );
  }

  static async createHospitalTransaction(req: Request, res: Response) {}

  static async createUserTransaction(req: Request, res: Response) {}

  static async getHospitalTransactions(req: Request, res: Response) {
    await PaymentController.getEntityTransactions(req, res, "hospital");
  }

  static async getUserTransactions(req: Request, res: Response) {
    await PaymentController.getEntityTransactions(req, res, "user");
  }

  static async getEntityTransactions(
    req: Request,
    res: Response,
    role: "user" | "hospital"
  ) {
    const entityId = req.user?._id;
    let transactions: any;

    if (role == "user") {
      transactions = await Payment.find({ userId: entityId });
    } else {
      transactions = await Payment.find({ hospitalId: entityId });
    }

    return response(
      res,
      200,
      "Transactions fetched successfully",
      transactions
    );
  }
}

export default PaymentController;
