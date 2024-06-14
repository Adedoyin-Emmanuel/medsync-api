import express from "express";
import { useAuth, useCheckRole } from "./../../middlewares";
import AppointmentController from "./controller";

const appointmentRouter = express.Router();

appointmentRouter.post(
  "/",
  [useAuth, useCheckRole("user")],
  AppointmentController.createAppointment
);

appointmentRouter.get(
  "/recent",
  [useAuth],
  AppointmentController.getRecentAppointments
);
appointmentRouter.get(
  "/user",
  [useAuth, useCheckRole("user")],
  AppointmentController.getUserAppointments
);

appointmentRouter.get(
  "/hospital",
  [useAuth, useCheckRole("hospital")],
  AppointmentController.getHospitalAppointments
);
appointmentRouter.get(
  "/:id",
  [useAuth],
  AppointmentController.getAppointmentById
);
appointmentRouter.put(
  "/",
  [useAuth, useCheckRole("user")],
  AppointmentController.updateAppointment
);
appointmentRouter.delete(
  "/",
  [useAuth, useCheckRole("user")],
  AppointmentController.deleteAppointment
);

export default appointmentRouter;
