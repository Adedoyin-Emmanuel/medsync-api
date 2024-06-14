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
const model_2 = require("../auth/model");
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const app_1 = require("../../constants/app");
dayjs_1.default.extend(utc_1.default);
class AppointmentController {
    static createAppointment(req, res) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield schema_1.createAppointmentSchema.validateAsync(req.body);
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const userName = (_b = req.user) === null || _b === void 0 ? void 0 : _b.name;
            const username = (_c = req.user) === null || _c === void 0 ? void 0 : _c.username;
            const { title, description, hospitalId, startDate, endDate, medicalRecordAccess, } = value;
            const hospital = yield model_2.User.findById(hospitalId);
            if (!hospital)
                return (0, utils_1.response)(res, 404, "Hospital not found");
            const startUtc = (0, dayjs_1.default)(startDate).utc().toISOString();
            const endUtc = (0, dayjs_1.default)(endDate).utc().toISOString();
            const conflictingAppointment = yield model_1.default.findOne({
                hospitalId: hospitalId,
                startDate: { $lt: value.endDate },
                endDate: { $gt: value.startDate },
            });
            if (conflictingAppointment)
                return (0, utils_1.response)(res, 409, "Appointment time range conflicts with an existing appointment.");
            const appointment = yield model_1.default.create(title, description, userId, hospitalId, startUtc, endUtc);
            if (medicalRecordAccess) {
                const hospitalExists = hospital.medicalRecordsAccess.includes(userId);
                if (!hospitalExists) {
                    yield model_2.User.findByIdAndUpdate(userId, {
                        $push: {
                            appointments: appointment._id,
                            medicalRecordsAccess: userId,
                        },
                    });
                }
            }
            const user = yield model_2.User.findById(userId);
            const userDetails = {
                name: userName,
                username: username,
                id: userId,
            };
            utils_1.eventEmitter.emit(app_1.APPOINTMENT_CREATED, {
                userDetails,
                hospitalName: hospital.name,
                hospitalEmail: hospital.email,
                appointment,
            });
            return (0, utils_1.response)(res, 201, "Appointment created successfully", appointment);
        });
    }
    static updateAppointment(req, res) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield schema_1.updateAppointmentSchema.validateAsync(req.body);
            const userName = (_a = req.user) === null || _a === void 0 ? void 0 : _a.name;
            const username = (_b = req.user) === null || _b === void 0 ? void 0 : _b.username;
            const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id;
            const appointmentId = req.params.id;
            if (!appointmentId)
                return (0, utils_1.response)(res, 400, "Appointment ID is required");
            const appointment = yield model_1.default.findById(appointmentId);
            if (!appointment)
                return (0, utils_1.response)(res, 404, "Appointment with given id does not exist");
            const updateFields = {};
            const options = { new: true, runValidators: true };
            const allowedFields = [
                "title",
                "description",
                "startDate",
                "endDate",
                "medicalRecordAccess",
            ];
            allowedFields.forEach((field) => {
                if (value[field] !== undefined) {
                    updateFields[field] = value[field];
                }
            });
            const updatedAppointment = yield model_1.default.findByIdAndUpdate(appointmentId, updateFields, options);
            const hospital = yield model_2.User.findById(appointment.hospitalId);
            if (!hospital)
                return (0, utils_1.response)(res, 404, "Hospital with given id not found");
            const user = yield model_2.User.findById(userId);
            const userDetails = {
                name: userName,
                username,
                email: user === null || user === void 0 ? void 0 : user.email,
                id: userId,
            };
            utils_1.eventEmitter.emit(app_1.APPOINTMENT_UPDATED, {
                userDetails,
                hospitalName: hospital === null || hospital === void 0 ? void 0 : hospital.name,
                appointment,
            });
            return (0, utils_1.response)(res, 200, "Appointment updated successfully", updatedAppointment);
        });
    }
    static deleteAppointment(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    static getAppointmentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const appointmentId = req.params.id;
            if (!appointmentId)
                return (0, utils_1.response)(res, 400, "Appointment ID is required");
            const appointment = yield model_1.default.findById(appointmentId);
            if (!appointment)
                return (0, utils_1.response)(res, 404, "Appointment with given id does not exist");
            return (0, utils_1.response)(res, 200, "Appointment fetched successfully", appointment);
        });
    }
    static getRecentAppointments(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            const appointments = yield model_1.default.find({ userId })
                .sort({ createdAt: -1 })
                .limit(5);
            if (!appointments)
                return (0, utils_1.response)(res, 404, "Appointments not found");
            return (0, utils_1.response)(res, 200, "Appointments fetched successfully", appointments);
        });
    }
    static getUserAppointments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield AppointmentController.getEntityAppointment(req, res, "user");
        });
    }
    static getHospitalAppointments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield AppointmentController.getEntityAppointment(req, res, "hospital");
        });
    }
    static getEntityAppointment(req, res, role) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            let appointments;
            if (role == "user") {
                appointments = yield model_1.default.find({ userId: id });
            }
            else {
                appointments = yield model_1.default.find({ hospitalId: id });
            }
            if (!appointments)
                return (0, utils_1.response)(res, 404, "Appointments not found");
            return (0, utils_1.response)(res, 200, "Appointments fetched successfully", appointments);
        });
    }
}
exports.default = AppointmentController;
