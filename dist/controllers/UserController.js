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
// create User
const CreateUser = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const exist = yield UserModel_1.default.findOne({ email: email });
    if (exist) {
        return next((0, Errorhandler_1.ApiError)(202, "User is already exist"));
    }
    const user = yield UserModel_1.default.create({
        name,
        email,
        password,
    });
    // create token
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
    const user = yield UserModel_1.default.findOneAndUpdate({ _id: userId }, Object.assign({}, req.body), { new: true });
    if (!user) {
        return next((0, Errorhandler_1.ApiError)(404, "User is not exist"));
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
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    const user = yield UserModel_1.default.findOneAndDelete({ _id: userId });
    if (!user) {
        yield session.abortTransaction();
        return next((0, Errorhandler_1.ApiError)(404, "User is not exist"));
    }
    yield PostModal_1.default.deleteMany({ user: userId });
    session.commitTransaction();
    res.status(200).json({
        message: "User is Deleted Successfully",
    });
}));
exports.DeleteUser = DeleteUser;
const DeleteUserByID = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignores
    const userId = req.params.id;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    const user = yield UserModel_1.default.findOneAndDelete({ _id: userId });
    if (!user) {
        yield session.abortTransaction();
        return next((0, Errorhandler_1.ApiError)(404, "User is not exist"));
    }
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
