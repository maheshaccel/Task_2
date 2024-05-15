"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PostController_1 = require("../controllers/PostController");
const auth_1 = require("../middleware/auth");
const multer_1 = require("../middleware/multer");
const router = express_1.default.Router();
router.post('/create', auth_1.Authentication, multer_1.upload.array('file'), PostController_1.CreatePost);
router.put('/update/:id', auth_1.Authentication, multer_1.upload.array('file'), PostController_1.UpdatePost);
router.delete('/delete/:id', auth_1.Authentication, PostController_1.DeletePost);
router.get('/getall', PostController_1.GetAllPost);
router.get('/getpost/:id', PostController_1.GetPostByID);
router.get('/getmypost', auth_1.Authentication, PostController_1.GetUserPost);
exports.default = router;
