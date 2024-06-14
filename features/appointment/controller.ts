import { Response, Request } from "express";
import { response, eventEmitter } from "../../utils/";
import { createAppointmentSchema, updateAppointmentSchema } from "./schema";
import Appointment from "./model";
import { User } from "../auth/model";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { APPOINTMENT_CREATED, APPOINTMENT_UPDATED } from "../../constants/app";
dayjs.extend(utc);

class AppointmentController {
  static async createAppointment(req: Request, res: Response) {
    const value = await createAppointmentSchema.validateAsync(req.body);
    const userId = req.user?._id;
    const userName = req.user?.name;
    const username = req.user?.username;

    const {
      title,
      description,
      hospitalId,
      startDate,
      endDate,
      medicalRecordAccess,
    } = value;

    const hospital = await User.findById(hospitalId);
    if (!hospital) return response(res, 404, "Hospital not found");

    const startUtc = dayjs(startDate).utc().toISOString();
    const endUtc = dayjs(endDate).utc().toISOString();

    const conflictingAppointment = await Appointment.findOne({
      hospitalId: hospitalId,
      startDate: { $lt: value.endDate },
      endDate: { $gt: value.startDate },
    });

    if (conflictingAppointment)
      return response(
        res,
        409,
        "Appointment time range conflicts with an existing appointment."
      );

    const appointment: any = await Appointment.create(
      title,
      description,
      userId,
      hospitalId,
      startUtc,
      endUtc
    );

    if (medicalRecordAccess) {
      const hospitalExists = hospital.medicalRecordsAccess.includes(userId);

      if (!hospitalExists) {
        await User.findByIdAndUpdate(userId, {
          $push: {
            appointments: appointment._id,
            medicalRecordsAccess: userId,
          },
        });
      }
    }

    const user = await User.findById(userId);

    const userDetails = {
      name: userName,
      username: username,
      id: userId,
    };

    eventEmitter.emit(APPOINTMENT_CREATED, {
      userDetails,
      hospitalName: hospital.name,
      hospitalEmail: hospital.email,
      appointment,
    });

    return response(res, 201, "Appointment created successfully", appointment);
  }
  static async updateAppointment(req: Request, res: Response) {
    const value = await updateAppointmentSchema.validateAsync(req.body);
    const userName = req.user?.name;
    const username = req.user?.username;
    const userId = req.user?._id;

    const appointmentId = req.params.id;

    if (!appointmentId) return response(res, 400, "Appointment ID is required");

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment)
      return response(res, 404, "Appointment with given id does not exist");

    const updateFields: any = {};
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

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      updateFields,
      options
    );
    const hospital = await User.findById(appointment.hospitalId);

    if (!hospital)
      return response(res, 404, "Hospital with given id not found");

    const user = await User.findById(userId);

    const userDetails = {
      name: userName,
      username,
      email: user?.email as string,
      id: userId,
    };

    eventEmitter.emit(APPOINTMENT_UPDATED, {
      userDetails,
      hospitalName: hospital?.name as string,
      appointment,
    });

    return response(
      res,
      200,
      "Appointment updated successfully",
      updatedAppointment
    );
  }
  static async deleteAppointment(req: Request, res: Response) {}
  static async getAppointmentById(req: Request, res: Response) {
    const appointmentId = req.params.id;

    if (!appointmentId) return response(res, 400, "Appointment ID is required");

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment)
      return response(res, 404, "Appointment with given id does not exist");

    return response(res, 200, "Appointment fetched successfully", appointment);
  }
  static async getRecentAppointments(req: Request, res: Response) {
    const userId = req.user?._id;

    const appointments = await Appointment.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    if (!appointments) return response(res, 404, "Appointments not found");

    return response(
      res,
      200,
      "Appointments fetched successfully",
      appointments
    );
  }
  static async getUserAppointments(req: Request, res: Response) {
    await AppointmentController.getEntityAppointment(req, res, "user");
  }

  static async getHospitalAppointments(req: Request, res: Response) {
    await AppointmentController.getEntityAppointment(req, res, "hospital");
  }

  static async getEntityAppointment(
    req: Request,
    res: Response,
    role: "user" | "hospital"
  ) {
    const id = req.user?._id;
    let appointments;

    if (role == "user") {
      appointments = await Appointment.find({ userId: id });
    } else {
      appointments = await Appointment.find({ hospitalId: id });
    }

    if (!appointments) return response(res, 404, "Appointments not found");

    return response(
      res,
      200,
      "Appointments fetched successfully",
      appointments
    );
  }
}

export default AppointmentController;
