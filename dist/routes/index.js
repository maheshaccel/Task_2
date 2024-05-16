"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("./User"));
const Post_1 = __importDefault(require("./Post"));
const category_1 = __importDefault(require("./category"));
const note_1 = __importDefault(require("./note"));
const router = express_1.default.Router();
router.use('/user', User_1.default);
router.use('/post', Post_1.default);
router.use('/category', category_1.default);
router.use('/note', note_1.default);
exports.default = router;
