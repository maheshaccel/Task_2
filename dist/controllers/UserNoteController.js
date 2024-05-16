"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetNote = exports.GetAllNote = exports.DeleteNote = exports.UpdateNote = exports.CreateNote = void 0;
const CatchAsync_1 = __importDefault(require("../utils/CatchAsync"));
const fs_1 = __importDefault(require("fs"));
const Errorhandler_1 = require("../utils/Errorhandler");
const Service_1 = require("../utils/Service");
const UserNoteModal_1 = __importDefault(require("../model/UserNoteModal"));
const CreateNote = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const userId = req.user;
    const { content } = req.body;
    const folderPath = `public/user/${userId}/notes`;
    const filename = `${(0, Service_1.generateRandomFileName)(20)}.txt`;
    if (!content) {
        return next((0, Errorhandler_1.ApiError)(422, "Please write content"));
    }
    fs_1.default.mkdir(folderPath, { recursive: true }, (err) => {
        if (err) {
            console.error("Error creating folder:", err);
            return;
        }
        fs_1.default.writeFile(`${folderPath}/${filename}`, content, { flag: "w" }, (err) => {
            if (err) {
                console.error("Error writing file:", err);
                return;
            }
            console.log("File written successfully");
        });
    });
    const note = yield UserNoteModal_1.default.create({
        user: userId,
        file: filename,
    });
    res.status(200).json({
        message: "Note Created Succesfully",
        note,
    });
}));
exports.CreateNote = CreateNote;
const UpdateNote = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const userId = req.user;
    const noteID = req.params.id;
    const { content } = req.body;
    const folderPath = `public/user/${userId}/notes`;
    if (!content) {
        return next((0, Errorhandler_1.ApiError)(422, "Please write content"));
    }
    const noteExist = yield UserNoteModal_1.default.findOne({
        _id: noteID,
    });
    if (!noteExist)
        return next((0, Errorhandler_1.ApiError)(404, "Note is not exist"));
    const filename = noteExist.file;
    fs_1.default.writeFile(`${folderPath}/${filename}`, content, { flag: "w" }, (err) => {
        if (err) {
            console.error("Error writing file:", err);
            return;
        }
    });
    const UpdatedNote = yield UserNoteModal_1.default.findOneAndUpdate({ _id: noteID }, {
        modify_date: Date.now(),
    }, { new: true });
    res.status(200).json({
        sucess: true,
        message: "note is updated sucessfully",
        UpdatedNote,
    });
}));
exports.UpdateNote = UpdateNote;
const DeleteNote = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const userID = req.user;
    const noteID = req.params.id;
    const noteExist = yield UserNoteModal_1.default.findOne({
        _id: noteID,
    });
    if (!noteExist)
        return next((0, Errorhandler_1.ApiError)(404, "Note is not exist"));
    const filename = noteExist.file;
    yield UserNoteModal_1.default.findOneAndDelete({ _id: noteID });
    fs_1.default.unlinkSync(`public/user/${userID}/notes/${filename}`);
    res.status(200).json({
        message: "deleted sucessfully",
    });
}));
exports.DeleteNote = DeleteNote;
const GetNote = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const userID = req.user;
    const noteID = req.params.id;
    const noteExist = yield UserNoteModal_1.default.findOne({
        _id: noteID,
    });
    if (!noteExist)
        return next((0, Errorhandler_1.ApiError)(404, "Note is not exist"));
    const filename = noteExist.file;
    const filePath = `public/user/${userID}/notes/${filename}`;
    fs_1.default.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            res.status(500).json({ error: "Failed to read file" });
            return;
        }
        res.json({ content: data });
    });
}));
exports.GetNote = GetNote;
const GetAllNote = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const userID = req.user;
    const notes = yield UserNoteModal_1.default.find({
        user: userID,
    });
    const files = notes.map((elem) => ({ file: elem.file, _id: elem._id }));
    const result = [];
    for (const elem of files) {
        const filePath = `public/user/${userID}/notes/${elem.file}`;
        const data = yield fs_1.default.promises.readFile(filePath, "utf8");
        result.push({ data: data, _id: elem._id });
    }
    res.status(200).json({
        result,
    });
}));
exports.GetAllNote = GetAllNote;
