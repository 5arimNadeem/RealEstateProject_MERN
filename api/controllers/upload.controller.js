import cloudinary from "../utils/cloudinary.js";

// Generates a short-lived signature so the browser can upload an image
// DIRECTLY to Cloudinary without ever exposing the API secret to the client.
// The browser must send back exactly the same `timestamp` and `folder`
// values that we sign here, otherwise Cloudinary rejects the upload.
export const getUploadSignature = (req, res, next) => {
  try {
    const timestamp = Math.round(Date.now() / 1000);
    const folder = "mern-estate";

    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      process.env.CLOUDINARY_API_SECRET
    );

    res.status(200).json({
      signature,
      timestamp,
      folder,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch (error) {
    next(error);
  }
};
