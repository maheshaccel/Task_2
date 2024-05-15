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
exports.Authentication = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Errorhandler_1 = require("../utils/Errorhandler");
const CatchAsync_1 = __importDefault(require("../utils/CatchAsync"));
const UserModel_1 = __importDefault(require("../model/UserModel"));
exports.Authentication = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    if (!token)
        return next((0, Errorhandler_1.ApiError)(404, 'Please login or signup before accesing this route'));
    const authToken = token.split(' ')[1];
    const decode = jsonwebtoken_1.default.verify(authToken, "mahesh");
    if (!decode)
        return next((0, Errorhandler_1.ApiError)(400, "User is not valid"));
    // @ts-ignore
    const user = yield UserModel_1.default.findById(decode.id);
    if (!user)
        return next((0, Errorhandler_1.ApiError)(404, "Please login or signup before accesing this route"));
    // @ts-ignore
    req.user = user === null || user === void 0 ? void 0 : user._id;
    next();
}));
