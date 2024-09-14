// const cloudinary = require("cloudinary").v2;
import { v2 } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const cloudinary = v2;
if (!process.env.CLOUDINARY_API_KEY) {
  console.log("no key");
} else {
  console.log("Key present");
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUDNAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export default cloudinary;
