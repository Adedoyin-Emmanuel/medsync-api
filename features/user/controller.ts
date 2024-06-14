import { Response, Request } from "express";
import { squad, response } from "../../utils";
import { User } from "./../auth/model";
import {
  getUsersSchema,
  getUserByIdSchema,
  updateUserSchema,
  updateHospitalSchema,
} from "./schema";

class UserController {
  static async getAllUsers(req: Request, res: Response) {
    await UserController.getEntity(req, res, "user");
  }

  static async getAllHospitals(req: Request, res: Response) {
    await UserController.getEntity(req, res, "hospital");
  }

  static async getHospitalBySubMerchantId(req: Request, res: Response) {
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

  static async getEntity(
    req: Request,
    res: Response,
    role: "user" | "hospital"
  ) {
    const value = await getUsersSchema.validateAsync(req.query);
    const { skip = 0, take = 10, where = "{}", orderBy = "{}" } = value;

    const validOrderBy = JSON.parse(orderBy);
    const validWhere = JSON.parse(where);

    const userWhereCondition = { role };

    const mergedWhere = { ...validWhere, ...userWhereCondition };

    const query = User.find(mergedWhere)
      .skip(Number(skip))
      .limit(Number(take))
      .sort(validOrderBy);

    const entities = await query.exec();

    return response(res, 200, `${role} fetched successfully`, entities);
  }

  static async getEntityById(req: Request, res: Response) {
    const value = await getUserByIdSchema.validateAsync(req.params);

    const { id } = value;

    const entity = await User.findById(id);

    if (!entity) return response(res, 400, `${req.userType} not found`);

    return response(res, 200, `${req.userType} fetched successfully`, entity);
  }

  static async getMe(req: Request, res: Response) {
    const user = await User.findOne({ _id: req.user._id });
    const userType = req.userType.toUpperCase();

    if (!user) return response(res, 404, `${userType} not found`);

    return response(res, 200, "Details retrived successfully", user);
  }

  static async updateUser(req: Request, res: Response) {
    const value = await updateUserSchema.validateAsync(req.body);
    const userId = req.user._id;

    const user = await User.findOne({ _id: userId });

    if (!user) return response(res, 404, `${req.userType} not found`);

    const existingEmail = await User.findOne({ email: value.email });

    if (existingEmail) return response(res, 400, "Email already exists");

    const existingUsername = await User.findOne({ username: value.username });

    if (existingUsername) return response(res, 400, "Username already exists");

    const allowedFields = [
      "name",
      "username",
      "state",
      "country",
      "bio",
      "location",
      "phoneNumber",
    ];
    const updateFields = {};
    const options = { new: true, runValidators: true };

    allowedFields.forEach((field) => {
      if (value[field] !== undefined) {
        // @ts-ignore
        updateFields[field] = value[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateFields,
      options
    );

    return response(res, 200, "User updated successfully", updatedUser);
  }

  static async updateHospital(req: Request, res: Response) {
    const value = await updateHospitalSchema.validateAsync(req.body);
    const userId = req.user._id;
    let picture = value.profilePicture;

    // @ts-ignore
    if (req.files) {
      // @ts-ignore
      picture = req.files.profilePicture;
    }
    if (picture) {
      picture = await req.storage?.uploadFile(picture[0]);
    }

    const hospital = await User.findOne({ _id: userId });

    if (!hospital) return response(res, 404, `${req.userType} not found`);

    const existingEmail = await User.findOne({ email: value.email });

    if (existingEmail) return response(res, 400, "Email already exists");

    const existingUsername = await User.findOne({ username: value.username });

    if (existingUsername) return response(res, 400, "Username already exists");

    const allowedFields = [
      "name",
      "username",
      "state",
      "country",
      "bio",
      "location",
      "tags",
      "profilePicture",
      "phoneNumber",
    ];
    const updateFields: any = {};
    const {} = value;
    const options = { new: true, runValidators: true };

    allowedFields.forEach((field) => {
      if (value[field] !== undefined) {
        updateFields[field] = value[field];
      }
    });

    const dataToSend = { ...updateFields, profilePicture: picture };

    const updatedHospital = await User.findByIdAndUpdate(
      userId,
      dataToSend,
      options
    );

    return response(res, 200, "Hospital updated successfully", updatedHospital);
  }
}

export default UserController;
