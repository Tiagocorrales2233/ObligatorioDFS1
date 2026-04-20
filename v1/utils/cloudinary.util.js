import { Readable } from "stream";

export function uploadBufferToCloudinary(cloudinaryInstance, buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinaryInstance.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });

    Readable.from(buffer).pipe(stream);
  });
}

export default uploadBufferToCloudinary;
