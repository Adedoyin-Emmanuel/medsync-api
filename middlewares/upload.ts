import multer from "multer";
import {logger} from "../utils/";
import response from "../utils/response";
import localStorage from "../services/upload/local";
import cloudinaryStorage from "../services/upload/cloudinary";
import { Request, Response, NextFunction } from "express";
import { LIMIT_FILE_SIZE, UNSUPPORTED_FILE_TYPE } from "../constants/errors";
import {
  ALLOWED_FILE_UPLOAD_EXTENSIONS,
  MAX_FILE_SIZE,
} from "../constants/app";

declare global {
  namespace Express {
    interface Request {
      storage?: {
        uploadFile: (file: Express.Multer.File) => Promise<string | undefined>;
      };
    }
  }
}

const storage = multer.memoryStorage();

const handleFileSizeLimitException = async (
  error: any,
  req: Request,
  res: Response,
  next: any
) => {
  if (error.code === "LIMIT_FILE_SIZE") {
    return response(res, 413, LIMIT_FILE_SIZE);
  }
};

const fileFilter = async (req: Request, file: Express.Multer.File, cb: any) => {
  try {
    const allowedExtension = ALLOWED_FILE_UPLOAD_EXTENSIONS;
    const fileExtension = file?.originalname?.split(".")?.pop()?.toLowerCase();
    if (allowedExtension.includes(fileExtension as string)) {
      return cb(null, true);
    }
    const error: any = new Error(UNSUPPORTED_FILE_TYPE);
    error.code = "UNSUPPORTED_FILE_TYPE";
    return cb(error);
  } catch (err) {
    logger.error(err.message);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

const fileUpload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    // @ts-ignore
    req.storage = isProduction ? await cloudinaryStorage() : localStorage();
    next();
  } catch (error) {
    next(error);
  }
};

export {fileUpload, upload, handleFileSizeLimitException};
