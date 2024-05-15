"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = require("../controllers/UserController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/create', UserController_1.CreateUser);
router.get('/getalluser', UserController_1.GetAllUser);
router.get('/me', auth_1.Authentication, UserController_1.getUserDetails);
router.put('/update', auth_1.Authentication, UserController_1.UpdateUser);
router.delete('/delete', auth_1.Authentication, UserController_1.DeleteUser);
router.delete('/delete/:id', auth_1.Authentication, UserController_1.DeleteUserByID);
exports.default = router;
