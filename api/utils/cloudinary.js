import { v2 as cloudinary } from "cloudinary";

// Configure the Cloudinary SDK with the credentials from the environment.
// These must be set in the .env file locally and in the Vercel project settings.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
