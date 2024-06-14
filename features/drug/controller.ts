import { Request, Response } from "express";
import { response } from "../../utils/";
import { createDrugSchema, updateDrugSchema, getDrugsSchema } from "./schema";
import Drug from "./model";

class DrugController {
  static async createDrug(req: Request, res: Response) {
    const value = await createDrugSchema.validateAsync(req.body);
    const hospitalId = req.user?._id;
    let picture = value.imageUrl;

    if (!req.files) return response(res, 400, "Drug image is required");

    if (req.files) {
      // @ts-ignore
      picture = req.files.imageUrl;
    }

    if (picture) {
      picture = await req.storage?.uploadFile(picture[0]);
    }

    const { name, description, dosage, price, status } = value;
    const dataToSend = {
      hospitalId,
      name,
      description,
      dosage,
      price,
      status,
      imageUrl: picture,
    };

    const drug = await Drug.create(dataToSend);

    return response(res, 201, "Drug created successfully", drug);
  }
  static async updateDrug(req: Request, res: Response) {
    const value = await updateDrugSchema.validateAsync(req.body);
    const drugId = req.params.id;
    let picture = value.imageUrl;

    if (!drugId) return response(res, 400, "Drug id is required");

    if (req.files) {
      // @ts-ignore
      picture = req.files.imageUrl;
    }

    if (picture) {
      picture = await req.storage?.uploadFile(picture[0]);
    }

    const allowedFields = [
      "name",
      "description",
      "dosage",
      "price",
      "status",
      "location",
      "imageUrl",
    ];
    const updateFields: any = {};
    const options = { new: true, runValidators: true };

    allowedFields.forEach((field) => {
      if (value[field] !== undefined) {
        updateFields[field] = value[field];
      }
    });

    const dataToSend = { ...updateFields, imageUrl: picture };

    const drug = await Drug.findByIdAndUpdate(drugId, dataToSend, options);

    if (!drug) return response(res, 404, "Drug with given id not found");

    return response(res, 200, "Drug updated successfully", drug);
  }
  static async deleteDrug(req: Request, res: Response) {
    const drugId = req.params.id;

    if (!drugId) return response(res, 400, "Drug id is required");

    const drug = await Drug.findByIdAndDelete(drugId);

    if (!drug) return response(res, 404, "Drug with given id not found");

    return response(res, 200, "Drug deleted successfully");
  }
  static async getAllDrugs(req: Request, res: Response) {
    const value = await getDrugsSchema.validateAsync(req.query);
    const { skip = 0, take = 10, where = "{}", orderBy = "{}" } = value;

    const validOrderBy = JSON.parse(orderBy);
    const validWhere = JSON.parse(where);

    const query = Drug.find(validWhere)
      .skip(Number(skip))
      .limit(Number(take))
      .sort(validOrderBy);

    const drugs = await query.exec();

    return response(res, 200, "Drugs fetched successfully", drugs);
  }
  static async getDrugById(req: Request, res: Response) {
    const drugId = req.params.id;

    if (!drugId) return response(res, 400, "Drug id is required");

    const drug = await Drug.findById(req.params.id);

    if (!drug) return response(res, 404, "Drug with given id not found");

    return response(res, 200, "Drug details retrived successfully", drug);
  }
  static async getHospitalDrugs(req: Request, res: Response) {
    const hospitalId = req.user?._id;
    const value = await getDrugsSchema.validateAsync(req.query);
    const { skip = 0, take = 10, where = "{}", orderBy = "{}" } = value;

    const validOrderBy = JSON.parse(orderBy);
    const validWhere = JSON.parse(where);

    const userWhereCondition = { hospitalId };

    const mergedWhere = { ...validWhere, ...userWhereCondition };

    const query = Drug.find(mergedWhere)
      .skip(Number(skip))
      .limit(Number(take))
      .sort(validOrderBy);

    const drugs = await query.exec();

    return response(res, 200, "Drugs fetched successfully", drugs);
  }
}

export default DrugController;
