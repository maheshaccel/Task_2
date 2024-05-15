"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const PostModal = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        required: true,
        ref: 'category'
    },
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        required: true,
        ref: 'user'
    },
    last_modify_date: {
        type: Date,
        default: null
    },
    post_date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    file: [{
            type: String
        }]
});
module.exports = mongoose_1.default.model('post', PostModal);
