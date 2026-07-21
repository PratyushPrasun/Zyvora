import cloudinary from "../config/cloudinary.js";

export const uploadImage = (buffer, folder) => {
    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            {
                folder,

                resource_type: "image",

                overwrite: false,
                unique_filename: true,

                transformation: [
                    {
                        width: 1200,
                        height: 1200,
                        crop: "limit",
                        quality: "auto",
                        fetch_format: "auto",
                    },
                ],
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        stream.end(buffer);
    });
};

export const deleteImage = async (publicId) => {
    return await cloudinary.uploader.destroy(publicId);
};