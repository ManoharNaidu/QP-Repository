import streamifier from "streamifier";

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
