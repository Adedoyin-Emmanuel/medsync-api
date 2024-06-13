import { v2 } from "cloudinary";
import logger from "../../utils/logger";

const cloudinary = v2;

cloudinary.config({
  secure: true,
});

const cloudinaryStorage = async () => {
  return {
    async uploadFile(file: Express.Multer.File) {
      try {
        const options = {
          use_filename: false,
          unique_filename: true,
          overwrite: true,
        };

        const result = await cloudinary.uploader.upload(file.path, options);

        return result.secure_url;
      } catch (error: any) {
        logger.error(error);
        throw new Error(error);
      }
    },
  };
};

export default cloudinaryStorage;
