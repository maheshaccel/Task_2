"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ConnectDB = (app) => {
    mongoose_1.default.connect("mongodb://localhost:27017/", {
        dbName: "task-2",
    }).then(() => {
        app.listen(4000, () => {
            console.log("server is runnning on port 4000...");
        });
    });
};
exports.default = ConnectDB;
