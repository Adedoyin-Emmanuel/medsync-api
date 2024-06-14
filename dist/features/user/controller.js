"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const model_1 = require("./../auth/model");
const schema_1 = require("./schema");
class UserController {
    static getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield UserController.getEntity(req, res, "user");
        });
    }
    static getAllHospitals(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield UserController.getEntity(req, res, "hospital");
        });
    }
    static getEntity(req, res, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield schema_1.getUsersSchema.validateAsync(req.query);
            const { skip = 0, take = 10, where = "{}", orderBy = "{}" } = value;
            const validOrderBy = JSON.parse(orderBy);
            const validWhere = JSON.parse(where);
            const userWhereCondition = { role };
            const mergedWhere = Object.assign(Object.assign({}, validWhere), userWhereCondition);
            const query = model_1.User.find(mergedWhere)
                .skip(Number(skip))
                .limit(Number(take))
                .sort(validOrderBy);
            const entities = yield query.exec();
            return (0, utils_1.response)(res, 200, `${role} fetched successfully`, entities);
        });
    }
    static getEntityById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield schema_1.getUserByIdSchema.validateAsync(req.params);
            const { id } = value;
            const entity = yield model_1.User.findById(id);
            if (!entity)
                return (0, utils_1.response)(res, 400, `${req.userType} not found`);
            return (0, utils_1.response)(res, 200, `${req.userType} fetched successfully`, entity);
        });
    }
    static getMe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield model_1.User.findOne({ _id: req.user._id });
            const userType = req.userType.toUpperCase();
            if (!user)
                return (0, utils_1.response)(res, 404, `${userType} not found`);
            return (0, utils_1.response)(res, 200, "Details retrived successfully", user);
        });
    }
    static updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield schema_1.updateUserSchema.validateAsync(req.body);
            const userId = req.user._id;
            const user = yield model_1.User.findOne({ _id: userId });
            if (!user)
                return (0, utils_1.response)(res, 404, `${req.userType} not found`);
            const existingEmail = yield model_1.User.findOne({ email: value.email });
            if (existingEmail)
                return (0, utils_1.response)(res, 400, "Email already exists");
            const existingUsername = yield model_1.User.findOne({ username: value.username });
            if (existingUsername)
                return (0, utils_1.response)(res, 400, "Username already exists");
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
            const updatedUser = yield model_1.User.findByIdAndUpdate(userId, updateFields, options);
            return (0, utils_1.response)(res, 200, "User updated successfully", updatedUser);
        });
    }
    static updateHospital(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield schema_1.updateHospitalSchema.validateAsync(req.body);
            const userId = req.user._id;
            let picture = value.profilePicture;
            // @ts-ignore
            if (req.files) {
                // @ts-ignore
                picture = req.files.profilePicture;
            }
            if (picture) {
                picture = yield ((_a = req.storage) === null || _a === void 0 ? void 0 : _a.uploadFile(picture[0]));
            }
            const hospital = yield model_1.User.findOne({ _id: userId });
            if (!hospital)
                return (0, utils_1.response)(res, 404, `${req.userType} not found`);
            const existingEmail = yield model_1.User.findOne({ email: value.email });
            if (existingEmail)
                return (0, utils_1.response)(res, 400, "Email already exists");
            const existingUsername = yield model_1.User.findOne({ username: value.username });
            if (existingUsername)
                return (0, utils_1.response)(res, 400, "Username already exists");
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
            const updateFields = {};
            const {} = value;
            const options = { new: true, runValidators: true };
            allowedFields.forEach((field) => {
                if (value[field] !== undefined) {
                    updateFields[field] = value[field];
                }
            });
            const dataToSend = Object.assign(Object.assign({}, updateFields), { profilePicture: picture });
            const updatedHospital = yield model_1.User.findByIdAndUpdate(userId, dataToSend, options);
            return (0, utils_1.response)(res, 200, "Hospital updated successfully", updatedHospital);
        });
    }
}
exports.default = UserController;
