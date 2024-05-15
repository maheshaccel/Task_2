"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const CategoryController_1 = require("../controllers/CategoryController");
const router = express_1.default.Router();
router.post('/create', auth_1.Authentication, CategoryController_1.CreateCategory);
router.put('/update/:id', auth_1.Authentication, CategoryController_1.UpdateCategory);
router.delete('/delete/:id', auth_1.Authentication, CategoryController_1.DeleteCategory);
router.get('/getall', CategoryController_1.GetAllCategory);
exports.default = router;
