"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const UserNoteController_1 = require("../controllers/UserNoteController");
const router = express_1.default.Router();
router.post('/create', auth_1.Authentication, UserNoteController_1.CreateNote);
router.get('/getnote/:id', auth_1.Authentication, UserNoteController_1.GetNote);
router.get('/getall', auth_1.Authentication, UserNoteController_1.GetAllNote);
router.put('/update/:id', auth_1.Authentication, UserNoteController_1.UpdateNote);
router.delete('/delete/:id', auth_1.Authentication, UserNoteController_1.DeleteNote);
exports.default = router;
