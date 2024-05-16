"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
//user , _id , created_at, modify_date , Note_file
const UserNoteModal = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: 'user',
        required: true
    },
    modify_date: {
        type: Date,
        default: null
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    file: {
        type: String,
        required: true
    }
});
module.exports = mongoose_1.default.model('note', UserNoteModal);
