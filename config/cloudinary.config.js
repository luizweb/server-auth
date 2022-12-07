import cloudinary from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import * as dotenv from "dotenv";

dotenv.config();

const cloudinaryInst = cloudinary.v2;

// CONECTADNO COM O CLOUDINARY
cloudinaryInst.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

// CONFIGURANDO O MEU CLOUDINARY
const storage =new CloudinaryStorage({
    cloudinary: cloudinaryInst,
    params: {
        folder: "enap-92",
        format: async (req,res) => "png",
        use_filename: true
    }
});

// multer
const uploadImg = multer({storage: storage});

export default uploadImg;
