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
const schema_1 = require("./schema");
const model_1 = __importDefault(require("./model"));
class DrugController {
    static createDrug(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield schema_1.createDrugSchema.validateAsync(req.body);
            const hospitalId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            let picture = value.imageUrl;
            if (!req.files)
                return (0, utils_1.response)(res, 400, "Drug image is required");
            if (req.files) {
                // @ts-ignore
                picture = req.files.imageUrl;
            }
            if (picture) {
                picture = yield ((_b = req.storage) === null || _b === void 0 ? void 0 : _b.uploadFile(picture[0]));
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
            const drug = yield model_1.default.create(dataToSend);
            return (0, utils_1.response)(res, 201, "Drug created successfully", drug);
        });
    }
    static updateDrug(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield schema_1.updateDrugSchema.validateAsync(req.body);
            const drugId = req.params.id;
            let picture = value.imageUrl;
            if (!drugId)
                return (0, utils_1.response)(res, 400, "Drug id is required");
            if (req.files) {
                // @ts-ignore
                picture = req.files.imageUrl;
            }
            if (picture) {
                picture = yield ((_a = req.storage) === null || _a === void 0 ? void 0 : _a.uploadFile(picture[0]));
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
            const updateFields = {};
            const options = { new: true, runValidators: true };
            allowedFields.forEach((field) => {
                if (value[field] !== undefined) {
                    updateFields[field] = value[field];
                }
            });
            const dataToSend = Object.assign(Object.assign({}, updateFields), { imageUrl: picture });
            const drug = yield model_1.default.findByIdAndUpdate(drugId, dataToSend, options);
            if (!drug)
                return (0, utils_1.response)(res, 404, "Drug with given id not found");
            return (0, utils_1.response)(res, 200, "Drug updated successfully", drug);
        });
    }
    static deleteDrug(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const drugId = req.params.id;
            if (!drugId)
                return (0, utils_1.response)(res, 400, "Drug id is required");
            const drug = yield model_1.default.findByIdAndDelete(drugId);
            if (!drug)
                return (0, utils_1.response)(res, 404, "Drug with given id not found");
            return (0, utils_1.response)(res, 200, "Drug deleted successfully");
        });
    }
    static getAllDrugs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield schema_1.getDrugsSchema.validateAsync(req.query);
            const { skip = 0, take = 10, where = "{}", orderBy = "{}" } = value;
            const validOrderBy = JSON.parse(orderBy);
            const validWhere = JSON.parse(where);
            const query = model_1.default.find(validWhere)
                .skip(Number(skip))
                .limit(Number(take))
                .sort(validOrderBy);
            const drugs = yield query.exec();
            return (0, utils_1.response)(res, 200, "Drugs fetched successfully", drugs);
        });
    }
    static getDrugById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const drugId = req.params.id;
            if (!drugId)
                return (0, utils_1.response)(res, 400, "Drug id is required");
            const drug = yield model_1.default.findById(req.params.id);
            if (!drug)
                return (0, utils_1.response)(res, 404, "Drug with given id not found");
            return (0, utils_1.response)(res, 200, "Drug details retrived successfully", drug);
        });
    }
    static getHospitalDrugs(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const hospitalId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const value = yield schema_1.getDrugsSchema.validateAsync(req.query);
            const { skip = 0, take = 10, where = "{}", orderBy = "{}" } = value;
            const validOrderBy = JSON.parse(orderBy);
            const validWhere = JSON.parse(where);
            const userWhereCondition = { hospitalId };
            const mergedWhere = Object.assign(Object.assign({}, validWhere), userWhereCondition);
            const query = model_1.default.find(mergedWhere)
                .skip(Number(skip))
                .limit(Number(take))
                .sort(validOrderBy);
            const drugs = yield query.exec();
            return (0, utils_1.response)(res, 200, "Drugs fetched successfully", drugs);
        });
    }
}
exports.default = DrugController;
