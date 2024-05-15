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
exports.GetUserPost = exports.GetPostByID = exports.GetAllPost = exports.DeletePost = exports.UpdatePost = exports.CreatePost = void 0;
const CategoryModal_1 = __importDefault(require("../model/CategoryModal"));
const PostModal_1 = __importDefault(require("../model/PostModal"));
const CatchAsync_1 = __importDefault(require("../utils/CatchAsync"));
const Errorhandler_1 = require("../utils/Errorhandler");
const GetAllPostFeature_1 = require("../utils/GetAllPostFeature");
const fs_1 = __importDefault(require("fs"));
const CreatePost = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, category, content } = req.body;
    const filesBody = req.files;
    console.log(filesBody);
    let fileArr;
    if (filesBody && Array.isArray(filesBody) && filesBody.length !== 0) {
        fileArr = filesBody.map((elem) => elem.filename);
    }
    else {
        fileArr = [];
    }
    let categoryId;
    const CategoryName = yield CategoryModal_1.default.findOne({
        categoryName: category,
    });
    if (CategoryName) {
        categoryId = CategoryName._id;
    }
    else {
        const NewCategory = yield CategoryModal_1.default.create({
            categoryName: category,
        });
        categoryId = NewCategory._id;
    }
    const post = yield PostModal_1.default.create({
        title,
        category: categoryId,
        content,
        // @ts-ignore
        last_modify_by: req.user.name,
        // @ts-ignore
        user: req.user,
        file: fileArr,
    });
    res.status(200).json({
        message: "Post is created successfully",
        success: true,
        post,
    });
}));
exports.CreatePost = CreatePost;
// update Post
const UpdatePost = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const PostId = req.params.id;
    const post = yield PostModal_1.default.findOne({ _id: PostId });
    if (!post) {
        return next((0, Errorhandler_1.ApiError)(404, "Post is not exist"));
    }
    let UpdatedfilesArr = post.file;
    let deletedfiles = [];
    if (req.files) {
        const filesBody = req.files;
        const newfiles = [];
        let fileArr;
        if (filesBody && Array.isArray(filesBody) && filesBody.length !== 0) {
            fileArr = filesBody.map((elem) => elem.filename);
        }
        else {
            fileArr = [];
        }
        post.file.forEach((elem) => {
            if (!fileArr.includes(elem)) {
                deletedfiles.push(elem);
            }
        });
        fileArr.forEach((elem) => {
            if (!post.file.includes(elem)) {
                newfiles.push(elem);
            }
        });
        const newArr = post.file.concat(newfiles);
        UpdatedfilesArr = newArr.filter((elem) => {
            return !deletedfiles.includes(elem);
        });
    }
    const Updatedpost = yield PostModal_1.default.findOneAndUpdate({ _id: PostId }, Object.assign(Object.assign({}, req.body), { last_modify_date: Date.now(), file: UpdatedfilesArr }), { new: true });
    console.log(deletedfiles);
    deletedfiles.forEach((elem) => {
        fs_1.default.unlink(`public/files/${elem}`, (err) => {
            if (err)
                throw err;
            console.log("file was deleted sucessfully");
        });
    });
    res.status(200).json({
        message: "Post is Update successfully",
        success: true,
        Updatedpost,
    });
}));
exports.UpdatePost = UpdatePost;
// delete Post
const DeletePost = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const PostId = req.params.id;
    const post = yield PostModal_1.default.findOneAndDelete({ _id: PostId });
    if (!post) {
        return next((0, Errorhandler_1.ApiError)(404, "Post is not exist"));
    }
    res.status(200).json({
        message: "Post is Delete successfully",
        success: true,
    });
}));
exports.DeletePost = DeletePost;
// getall Post -> don't show the inactive user's post --> search functionality --> limit 10 -> pagination -> filter by category
const GetAllPost = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = req.query;
    const keyword = req.query.search
        ? {
            $or: [{ title: { $regex: new RegExp("s", "i") } }],
        }
        : {};
    const limit = 10;
    const feature = new GetAllPostFeature_1.ApiFeature(PostModal_1.default, filter)
        .search()
        .filter()
        .pagination(limit, Number(req.query.page));
    const Posts = yield feature.QueryModel.sort({ post_date: -1 });
    res.status(200).json({
        Posts,
    });
}));
exports.GetAllPost = GetAllPost;
const GetPostByID = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const PostID = req.params.id;
    const Post = yield PostModal_1.default.findById(PostID);
    if (Post) {
        return next((0, Errorhandler_1.ApiError)(404, "Post not exist"));
    }
    res.status(200).json({
        message: "Posts gets Success",
        Post,
    });
}));
exports.GetPostByID = GetPostByID;
const GetUserPost = (0, CatchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const Posts = yield PostModal_1.default.find({ user: req.user });
    res.status(200).json({
        Posts,
    });
}));
exports.GetUserPost = GetUserPost;
