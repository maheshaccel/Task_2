"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const CategoryModal = new mongoose_1.default.Schema({
    categoryName: {
        type: String,
        required: true
    }
});
module.exports = mongoose_1.default.model('category', CategoryModal);
