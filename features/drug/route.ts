import express from "express";
import {
  useAuth,
  useCheckRole,
  fileUpload,
  upload,
  handleFileSizeLimitException,
} from "./../../middlewares";

import DrugController from "./controller";

const drugRouter = express.Router();

drugRouter.post(
  "/",
  [
    useAuth,
    useCheckRole("hospital"),
    handleFileSizeLimitException,
    fileUpload,
    upload.fields([{ name: "imageUrl", maxCount: 1 }]),
  ],
  DrugController.createDrug
);

drugRouter.get("/", [], DrugController.getAllDrugs);

drugRouter.get(
  "/:id",
  [useAuth, useCheckRole("hospital")],
  DrugController.getDrugById
);
drugRouter.put(
  "/:id",
  [
    useAuth,
    useCheckRole("hospital"),
    handleFileSizeLimitException,
    fileUpload,
    upload.fields([{ name: "imageUrl", maxCount: 1 }]),
  ],
  DrugController.updateDrug
);

drugRouter.get(
  "/me",
  [useAuth, useCheckRole("hospital")],
  DrugController.getHospitalDrugs
);

drugRouter.delete(
  "/:id",
  [useAuth, useCheckRole("hospital")],
  DrugController.deleteDrug
);

export default drugRouter;
