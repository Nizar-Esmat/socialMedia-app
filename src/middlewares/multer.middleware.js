import multer from "multer";
import Randomstring from "randomstring";
import fs from "fs";
import path from "path";

export const filetype = {
    images: ["image/jpeg", "image/png", "image/jpg"],
    videos: ["video/mp4", "video/webm", "video/ogg"],
    pdf: ["application/pdf"]
}
export const uploadFile = (customFalidation = [], custemFolder ="genral") => {
    const fullPath = `public/${custemFolder}`
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath , { recursive: true }); 
    }
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, fullPath)
        },
        filename: function (req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, Randomstring.generate({
                length: 4,
                charset: 'numeric'
            }) + '-' + file.fieldname + ext);
        }
    })

    const fileFilter = (req, file, cb) => {
        if (customFalidation.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type, only JPEG and PNG are allowed!'), false);
        }
    }

    const upload = multer({ storage, fileFilter });
    return upload;
}

