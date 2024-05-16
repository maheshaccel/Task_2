"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUpload = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/files/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
const UserStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        let tempPath = `public/user/temp_${Date.now()}`;
        // @ts-ignore
        if (req.user !== undefined)
            tempPath = `public/user/${req.user}`;
        if (!fs_1.default.existsSync(tempPath)) {
            // @ts-ignore
            fs_1.default.mkdirSync(tempPath);
            // @ts-ignore
            req.filePath = tempPath;
        }
        // @ts-ignore
        cb(null, tempPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
exports.upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 1024 * 24 * 24,
    },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const mimtype = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path_1.default.extname(file.originalname));
        if (mimtype && extname)
            return cb(null, true);
        // @ts-ignore
        cb("Give proper file format");
    },
});
exports.UserUpload = (0, multer_1.default)({
    storage: UserStorage,
    limits: {
        fileSize: 1024 * 24 * 24,
    },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const mimtype = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path_1.default.extname(file.originalname));
        if (mimtype && extname)
            return cb(null, true);
        // @ts-ignore
        cb("Give proper file format");
    },
});
