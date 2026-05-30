// Uploads a single image to Cloudinary using a SIGNED direct upload.
//
// Flow:
//   1. Ask our backend for a one-time signature (the API secret never leaves
//      the server).
//   2. Upload the file straight from the browser to Cloudinary with that
//      signature. This avoids serverless body-size limits and keeps the
//      upload off our own server.
//
// `onProgress(percent)` is optional and is called with 0-100 while uploading.
// Resolves with the uploaded image's secure (https) URL.
export const uploadImage = (file, onProgress) => {
  return new Promise(async (resolve, reject) => {
    try {
      // 1. Get a signature from our API. Cookies (auth) are sent automatically
      //    because this is a same-origin request.
      const sigRes = await fetch('/api/upload/signature');
      if (!sigRes.ok) {
        throw new Error('Could not get an upload signature');
      }
      const { signature, timestamp, folder, apiKey, cloudName } =
        await sigRes.json();

      // 2. Build the multipart form for Cloudinary. The signed params
      //    (timestamp, folder) must match what the server signed.
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      formData.append('folder', folder);

      const xhr = new XMLHttpRequest();
      xhr.open(
        'POST',
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
      );

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && typeof onProgress === 'function') {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      };

      xhr.onload = () => {
        let json = {};
        try {
          json = JSON.parse(xhr.responseText);
        } catch {
          // ignore parse errors, handled below
        }
        if (xhr.status >= 200 && xhr.status < 300 && json.secure_url) {
          resolve(json.secure_url);
        } else {
          reject(new Error(json?.error?.message || 'Image upload failed'));
        }
      };

      xhr.onerror = () => reject(new Error('Image upload failed'));
      xhr.send(formData);
    } catch (error) {
      reject(error);
    }
  });
};
