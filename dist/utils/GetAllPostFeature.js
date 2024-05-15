"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiFeature = void 0;
class ApiFeature {
    constructor(QueryModel, query) {
        this.QueryModel = QueryModel;
        this.query = query;
    }
    search() {
        // by title
        const keyword = this.query.search
            ? {
                $or: [{ title: { $regex: new RegExp(this.query.search, "i") } }],
            }
            : false;
        this.QueryModel = this.QueryModel.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user_details",
                },
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category_details",
                },
            },
            { $unwind: "$user_details" },
            { $unwind: "$category_details" },
            {
                $match: Object.assign({ "user_details.status": "active" }, keyword),
            },
        ]);
        return this;
    }
    filter() {
        if (this.query.category) {
            this.QueryModel = this.QueryModel.match({
                "category_details.categoryName": this.query.category,
            });
        }
        return this;
    }
    pagination(limit, page) {
        const skip = (page - 1) * limit;
        this.query = this.QueryModel.skip(skip).limit(limit);
        return this;
    }
}
exports.ApiFeature = ApiFeature;
