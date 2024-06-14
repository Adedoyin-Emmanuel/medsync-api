import express from "express";
import { useAuth, useCheckRole } from "./../../middlewares";
import MedicationController from "./controller";

const medicationRouter = express.Router();

medicationRouter.post(
  "/",
  [useAuth, useCheckRole("hospital")],
  MedicationController.createMedication
);

medicationRouter.get("/", [useAuth], MedicationController.getAllMedications);
medicationRouter.get("/:id", [useAuth], MedicationController.getMedicationById);

medicationRouter.get(
  "/user/",
  [useAuth, useCheckRole("user")],
  MedicationController.getUserMedications
);

medicationRouter.get(
  "/hospital",
  [useAuth, useCheckRole("hospital")],
  MedicationController.getHospitalMedications
);

medicationRouter.put(
  "/:id",
  [useAuth, useCheckRole("hospital")],
  MedicationController.updateMedication
);

medicationRouter.delete(
  "/:id",
  [useAuth, useCheckRole("hospital")],
  MedicationController.deleteMedication
);

export default medicationRouter;
