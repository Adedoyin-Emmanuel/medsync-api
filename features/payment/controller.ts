import { Response, Request } from "express";
import { squad, response } from "../../utils";

class PaymentController {
  static async createHospitalSubMerchantAccount(req: Request, res: Response) {}

  static async getHospitalSubMerchantAccount(req: Request, res: Response) {}

  static async initiateHospitalPayment(req: Request, res: Response) {}

  static async createHospitalTransaction(req: Request, res: Response) {}

  static async createUserTransaction(req: Request, res: Response) {}

  static async getHospitalTransactions(req: Request, res: Response) {}

  static async getUserTransactions(req: Request, res: Response) {}
}

export default PaymentController;
