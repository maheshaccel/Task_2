import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/files/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const UserStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let tempPath = `public/user/temp_${Date.now()}`;
    // @ts-ignore
    if (req.user !== undefined) tempPath = `public/user/${req.user}`;
    if (!fs.existsSync(tempPath)) {
      // @ts-ignore
      fs.mkdirSync(tempPath);
      // @ts-ignore
      req.filePath = tempPath;
    }
    // @ts-ignore
    cb(null, tempPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 24 * 24,
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimtype = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));
    if (mimtype && extname) return cb(null, true);
    // @ts-ignore
    cb("Give proper file format");
  },
});

export const UserUpload = multer({
  storage: UserStorage,
  limits: {
    fileSize: 1024 * 24 * 24,
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimtype = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));
    if (mimtype && extname) return cb(null, true);
    // @ts-ignore
    cb("Give proper file format");
  },
});
