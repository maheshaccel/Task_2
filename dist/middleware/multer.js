"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/files/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
exports.upload = (0, multer_1.default)({ storage: storage, limits: {
        fileSize: 1024 * 24 * 24
    }, fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const mimtype = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path_1.default.extname(file.originalname));
        if (mimtype && extname)
            return cb(null, true);
        // @ts-ignore
        cb('Give proper file format');
    } });
