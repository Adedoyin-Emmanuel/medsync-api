import { Response, Request } from "express";
import { squad, response } from "../../utils";
import {
  createHospitalSubMerchantAccountSchema,
  createHospitalTransactionSchema,
} from "./schema";
import { User } from "../auth/model";
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

  static async initiateHospitalPayment(req: Request, res: Response) {}

  static async createHospitalTransaction(req: Request, res: Response) {}

  static async createUserTransaction(req: Request, res: Response) {}

  static async getHospitalTransactions(req: Request, res: Response) {}

  static async getUserTransactions(req: Request, res: Response) {}
}

export default PaymentController;
