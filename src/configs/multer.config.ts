import dotenv  from 'dotenv';
import multer from "multer";
import path from 'node:path';

dotenv.config()

const uploadsPath: string = process.env.UPLOADS_PATH ?? "~/uploads"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsPath)
    },
    filename: (req, file, cb) => {
        const timestamp: number = Date.now()
        cb(null, `${timestamp}_${path.extname(file.originalname)}`)
    }
})

const upload = multer({ storage })
export default upload