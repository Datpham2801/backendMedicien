import multer from "multer";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Sử dụng đường dẫn tương đối
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });

const upload = multer({ storage: storage });
export default upload;