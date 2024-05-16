"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomFileName = exports.RemoveFolder = exports.CreateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = __importDefault(require("fs"));
const CreateToken = ({ id, name }) => {
    return jsonwebtoken_1.default.sign({ id, name }, "mahesh");
};
exports.CreateToken = CreateToken;
const RemoveFolder = (folderPath) => {
    fs_1.default.rm(folderPath, { recursive: true }, (err) => {
        if (err) {
            console.error("Error removing folder:", err);
            return;
        }
        console.log("Folder removed successfully");
    });
};
exports.RemoveFolder = RemoveFolder;
const generateRandomFileName = (length) => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let randomFileName = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomFileName += characters.charAt(randomIndex);
    }
    return randomFileName;
};
exports.generateRandomFileName = generateRandomFileName;
