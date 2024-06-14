import { Request, Response } from "express";
import { response, eventEmitter } from "../../utils/";
import Medication from "./model";
import {
  createMedicationSchema,
  updateMedicationSchema,
  getMedicationsSchema,
} from "./schema";
import { User } from "../auth/model";
import { MEDICATION_CREATED } from "../../constants/app";

class MedicationController {
  static async createMedication(req: Request, res: Response) {
    const value = await createMedicationSchema.validateAsync(req.body);
    const hospitalId = req.user?._id;
    const hospitalName = req.user?.name;

    const { userId, name, description, dosage, totalPrice, drugs } = value;

    const dataToSend = {
      hospitalId,
      userId,
      name,
      description,
      dosage,
      totalPrice,
      drugs,
    };

    const user = await User.findById(userId);

    if (!user) return response(res, 404, "User not found");

    const medication = await Medication.create(dataToSend);
    const userDetails = {
      userId: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
    };

    eventEmitter.emit(MEDICATION_CREATED, {
      userDetails,
      hospitalName,
      medication,
    });

    return response(res, 201, "Medication created successfully", medication);
  }

  static async updateMedication(req: Request, res: Response) {
    const value = await updateMedicationSchema.validateAsync(req.body);
    const medicationId = req.params.id;

    if (!medicationId) return response(res, 400, "Medication ID is required");

    const medication = await Medication.findById(medicationId);

    if (!medication)
      return response(res, 404, "Medication with given id does not exist");

    const updateFields: any = {};
    const options = { new: true, runValidators: true };

    const allowedFields = [
      "name",
      "description",
      "dosage",
      "totalPrice",
      "drugs",
    ];

    allowedFields.forEach((field) => {
      if (value[field] !== undefined) {
        updateFields[field] = value[field];
      }
    });

    const updatedMedicaition = await Medication.findByIdAndUpdate(
      medicationId,
      updateFields,
      options
    );

    return response(
      res,
      200,
      "Medication updated successfully",
      updatedMedicaition
    );
  }

  static async deleteMedication(req: Request, res: Response) {
    const medicationId = req.params.id;

    if (!medicationId) return response(res, 400, "Medication id is required");

    const medication = await Medication.findByIdAndDelete(medicationId);

    if (!medication)
      return response(res, 404, "Medication with given id does not exist");

    return response(res, 200, "Medication deleted successfully");
  }

  static async getAllMedications(req: Request, res: Response) {
    const value = await getMedicationsSchema.validateAsync(req.query);
    const { skip = 0, take = 10, where = "{}", orderBy = "{}" } = value;

    const validWhere = JSON.parse(where);
    const validOrderBy = JSON.parse(orderBy);

    const query = Medication.find(validWhere)
      .skip(Number(skip))
      .limit(Number(take))
      .sort(validOrderBy);

    const medications = await query.exec();

    return response(res, 200, "Medications fetched successfully", medications);
  }

  static async getMedicationById(req: Request, res: Response) {
    const medicationId = req.params.id;

    if (!medicationId) return response(res, 400, "Medication id is required");

    const medication = await Medication.findById(medicationId);

    if (!medication)
      return response(res, 404, "Medication with given id does not exist");

    return response(res, 200, "Medication fetched successfully", medication);
  }

  static async getUserMedications(req: Request, res: Response) {
    const userId = req.user?._id;

    const medications = await Medication.find({ userId });

    return response(res, 200, "Medications fetched successfully", medications);
  }

  static async getHospitalMedications(req: Request, res: Response) {
    const hospitalId = req.user?._id;

    const medications = await Medication.find({ hospitalId });

    return response(res, 200, "Medications fetched successfully", medications);
  }
}

export default MedicationController;
