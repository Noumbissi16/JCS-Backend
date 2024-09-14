// const cloudinary = require("cloudinary").v2;
import { v2 } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const cloudinary = v2;
if (
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_CLOUDNAME ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error(
    "Cloudinary configuration error, please provide config : CLOUDINARY_CLOUDNAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET"
  );
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
