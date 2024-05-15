"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CatchAsync = (thefun) => {
    return (req, res, next) => { Promise.resolve(thefun(req, res, next)).catch((err) => next(err)); };
};
exports.default = CatchAsync;
