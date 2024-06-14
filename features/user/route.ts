import express from "express";
import {
  useAuth,
  upload,
  fileUpload,
  handleFileSizeLimitException,
  useCheckRole,
} from "../../middlewares/";
import UserController from "./controller";
const userRouter = express.Router();

userRouter.get("/me", [useAuth], UserController.getMe);

userRouter.get("/", [useAuth], UserController.getAllUsers);
userRouter.get("/hospital", [useAuth], UserController.getAllHospitals);
userRouter.get(
  "/hospital/:subMerchantId",
  [useAuth],
  UserController.getHospitalBySubMerchantId
);

userRouter.get("/:id", UserController.getEntityById);

userRouter.put("/", [useAuth, useCheckRole("user")], UserController.updateUser);
userRouter.put(
  "/hospital/",
  [
    useAuth,
    useCheckRole("hospital"),
    handleFileSizeLimitException,
    upload.fields([{ name: "profilePicture", maxCount: 1 }]),
    fileUpload,
  ],
  UserController.updateHospital
);

export default userRouter;
