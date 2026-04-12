import streamifier from "streamifier";

/**
 * Streams an in-memory file buffer to Cloudinary and resolves with upload metadata.
 * @param {{ cloudinary: { uploader: { upload_stream: Function } }, buffer: Buffer, publicId: string }} params Upload configuration and file data.
 * @returns {Promise<any>} Cloudinary upload result.
 */
export const uploadBufferToCloudinary = ({ cloudinary, buffer, publicId }) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "question-papers",
        resource_type: "raw",
        public_id: publicId,
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      },
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
