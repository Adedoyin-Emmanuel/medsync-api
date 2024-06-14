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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils/");
const model_1 = __importDefault(require("./model"));
const schema_1 = require("./schema");
const model_2 = require("../auth/model");
const app_1 = require("../../constants/app");
class MedicationController {
    static createMedication(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield schema_1.createMedicationSchema.validateAsync(req.body);
            const hospitalId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const hospitalName = (_b = req.user) === null || _b === void 0 ? void 0 : _b.name;
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
            const user = yield model_2.User.findById(userId);
            if (!user)
                return (0, utils_1.response)(res, 404, "User not found");
            const medication = yield model_1.default.create(dataToSend);
            const userDetails = {
                userId: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
            };
            utils_1.eventEmitter.emit(app_1.MEDICATION_CREATED, {
                userDetails,
                hospitalName,
                medication,
            });
            return (0, utils_1.response)(res, 201, "Medication created successfully", medication);
        });
    }
    static updateMedication(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield schema_1.updateMedicationSchema.validateAsync(req.body);
            const medicationId = req.params.id;
            if (!medicationId)
                return (0, utils_1.response)(res, 400, "Medication ID is required");
            const medication = yield model_1.default.findById(medicationId);
            if (!medication)
                return (0, utils_1.response)(res, 404, "Medication with given id does not exist");
            const updateFields = {};
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
            const updatedMedicaition = yield model_1.default.findByIdAndUpdate(medicationId, updateFields, options);
            return (0, utils_1.response)(res, 200, "Medication updated successfully", updatedMedicaition);
        });
    }
    static deleteMedication(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const medicationId = req.params.id;
            if (!medicationId)
                return (0, utils_1.response)(res, 400, "Medication id is required");
            const medication = yield model_1.default.findByIdAndDelete(medicationId);
            if (!medication)
                return (0, utils_1.response)(res, 404, "Medication with given id does not exist");
            return (0, utils_1.response)(res, 200, "Medication deleted successfully");
        });
    }
    static getAllMedications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield schema_1.getMedicationsSchema.validateAsync(req.query);
            const { skip = 0, take = 10, where = "{}", orderBy = "{}" } = value;
            const validWhere = JSON.parse(where);
            const validOrderBy = JSON.parse(orderBy);
            const query = model_1.default.find(validWhere)
                .skip(Number(skip))
                .limit(Number(take))
                .sort(validOrderBy);
            const medications = yield query.exec();
            return (0, utils_1.response)(res, 200, "Medications fetched successfully", medications);
        });
    }
    static getMedicationById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const medicationId = req.params.id;
            if (!medicationId)
                return (0, utils_1.response)(res, 400, "Medication id is required");
            const medication = yield model_1.default.findById(medicationId);
            if (!medication)
                return (0, utils_1.response)(res, 404, "Medication with given id does not exist");
            return (0, utils_1.response)(res, 200, "Medication fetched successfully", medication);
        });
    }
    static getUserMedications(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const medications = yield model_1.default.find({ userId });
            return (0, utils_1.response)(res, 200, "Medications fetched successfully", medications);
        });
    }
    static getHospitalMedications(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const hospitalId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const medications = yield model_1.default.find({ hospitalId });
            return (0, utils_1.response)(res, 200, "Medications fetched successfully", medications);
        });
    }
}
exports.default = MedicationController;
