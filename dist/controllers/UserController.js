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
exports.DeleteUserByID = exports.DeleteUser = exports.GetAllUser = exports.UpdateUser = exports.CreateUser = exports.getUserDetails = void 0;
const CatchAsync_1 = __importDefault(require("../utils/CatchAsync"));
const UserModel_1 = __importDefault(require("../model/UserModel"));
const Service_1 = require("../utils/Service");
const Errorhandler_1 = require("../utils/Errorhandler");
const mongoose_1 = __importDefault(require("mongoose"));
const PostModal_1 = __importDefault(require("../model/PostModal"));
const fs_1 = __importDefault(require("fs"));
// create User
const CreateUser = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const avatar = req.file;
    // @ts-ignore
    const folderPath = req.filePath;
    if (!name || !email || !password) {
        (0, Service_1.RemoveFolder)(folderPath);
        return next((0, Errorhandler_1.ApiError)(300, "please fill all the details"));
    }
    const exist = yield UserModel_1.default.findOne({ email: email });
    if (exist) {
        (0, Service_1.RemoveFolder)(folderPath);
        return next((0, Errorhandler_1.ApiError)(202, "User is already exist"));
    }
    const user = yield UserModel_1.default.create({
        name,
        email,
        password,
        avtar: avatar === null || avatar === void 0 ? void 0 : avatar.filename,
    });
    if (fs_1.default.existsSync(folderPath)) {
        fs_1.default.rename(folderPath, `public/user/${user._id}`, (err) => {
            if (err) {
                console.error("Error renaming folder:", err);
                return;
            }
            console.log("Folder renamed successfully");
        });
    }
    const token = (0, Service_1.CreateToken)({ id: user._id, name: user.name });
    res.setHeader("Authorization", `Bearer ${token}`);
    res.status(200).json({
        message: "User is Created Successfully",
        user,
    });
}));
exports.CreateUser = CreateUser;
// Update User
const UpdateUser = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignores
    const userId = req.user;
    let deletfileName = null;
    const existUser = yield UserModel_1.default.findOne({ _id: userId });
    if (!existUser)
        return next((0, Errorhandler_1.ApiError)(404, "User not found"));
    let avtar = existUser.avtar;
    if (req.file) {
        deletfileName = existUser.avtar;
        avtar = req.file.filename;
    }
    const user = yield UserModel_1.default.findOneAndUpdate({ _id: userId }, Object.assign(Object.assign({}, req.body), { avtar: avtar }), { new: true });
    if (!user) {
        return next((0, Errorhandler_1.ApiError)(404, "User is not exist"));
    }
    if (deletfileName) {
        fs_1.default.unlinkSync(`public/user/${user._id}/${deletfileName}`);
    }
    res.status(200).json({
        message: "User is Udpated Successfully",
        user,
    });
}));
exports.UpdateUser = UpdateUser;
// Delete User
const DeleteUser = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignores
    const userId = req.user;
    const folderPath = `public/user/${userId}`;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    const user = yield UserModel_1.default.findOneAndDelete({ _id: userId });
    if (!user) {
        yield session.abortTransaction();
        return next((0, Errorhandler_1.ApiError)(404, "User is not exist"));
    }
    yield PostModal_1.default.deleteMany({ user: userId });
    (0, Service_1.RemoveFolder)(folderPath);
    session.commitTransaction();
    res.status(200).json({
        message: "User is Deleted Successfully",
    });
}));
exports.DeleteUser = DeleteUser;
const DeleteUserByID = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignores
    const userId = req.params.id;
    const folderPath = `public/user/${userId}`;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    const user = yield UserModel_1.default.findOneAndDelete({ _id: userId });
    if (!user) {
        yield session.abortTransaction();
        return next((0, Errorhandler_1.ApiError)(404, "User is not exist"));
    }
    (0, Service_1.RemoveFolder)(folderPath);
    yield PostModal_1.default.deleteMany({ user: userId });
    res.status(200).json({
        message: "User is Deleted Successfully",
    });
}));
exports.DeleteUserByID = DeleteUserByID;
// getAll User
const GetAllUser = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield UserModel_1.default.find({});
    res.status(200).json({
        message: "User is Deleted Successfully",
        users,
    });
}));
exports.GetAllUser = GetAllUser;
const getUserDetails = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignores
    const userId = req.user;
    const user = yield UserModel_1.default.findById(userId);
    res.status(200).json({
        user,
    });
}));
exports.getUserDetails = getUserDetails;
