import multer from "multer";
import path from "path";

// Store images inside /public/ad_images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/ad_images/"); 
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
});

export default upload;
