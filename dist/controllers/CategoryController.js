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
exports.UpdateCategory = exports.DeleteCategory = exports.GetAllCategory = exports.CreateCategory = void 0;
const CategoryModal_1 = __importDefault(require("../model/CategoryModal"));
const CatchAsync_1 = __importDefault(require("../utils/CatchAsync"));
const Errorhandler_1 = require("../utils/Errorhandler");
const CreateCategory = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = req.body;
    const CategoryName = yield CategoryModal_1.default.findOne({
        categoryName: category,
    });
    if (CategoryName) {
        return next((0, Errorhandler_1.ApiError)(302, "This Category already exist"));
    }
    const NewCategory = yield CategoryModal_1.default.create({
        categoryName: category,
    });
    res.status(200).json({
        message: "New Category created successfully",
        success: true,
        NewCategory,
    });
}));
exports.CreateCategory = CreateCategory;
const UpdateCategory = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const CategoryId = req.params.id;
    const UpdatedCategory = yield CategoryModal_1.default.findOneAndUpdate({
        _id: CategoryId,
    }, { categoryName: req.body.category }, { new: true });
    if (!UpdatedCategory) {
        return next((0, Errorhandler_1.ApiError)(404, "Category not found"));
    }
    res.status(200).json({
        message: "Category Updated successfully",
        success: true,
        UpdatedCategory,
    });
}));
exports.UpdateCategory = UpdateCategory;
const DeleteCategory = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const CategoryId = req.params.id;
    const CategoryName = yield CategoryModal_1.default.findByIdAndDelete(CategoryId);
    if (!CategoryName) {
        return next((0, Errorhandler_1.ApiError)(404, "Category not exist"));
    }
    res.status(200).json({
        message: "Category Deleted successfully",
        success: true,
    });
}));
exports.DeleteCategory = DeleteCategory;
const GetAllCategory = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const Categories = yield CategoryModal_1.default.find({});
    res.status(200).json({
        success: true,
        Categories,
    });
}));
exports.GetAllCategory = GetAllCategory;
