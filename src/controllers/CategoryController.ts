import CategoryModal from "../model/CategoryModal";
import CatchAsync from "../utils/CatchAsync";
import { ApiError } from "../utils/Errorhandler";

const CreateCategory = CatchAsync(async (req, res, next) => {
  const { category } = req.body;

  const CategoryName = await CategoryModal.findOne({
    categoryName: category,
  });

  if (CategoryName) {
    return next(ApiError(302, "This Category already exist"));
  }

  const NewCategory = await CategoryModal.create({
    categoryName: category,
  });

  res.status(200).json({
    message: "New Category created successfully",
    success: true,
    NewCategory,
  });
});

const UpdateCategory = CatchAsync(async (req, res, next) => {
  const CategoryId = req.params.id;
  const UpdatedCategory = await CategoryModal.findOneAndUpdate(
    {
      _id: CategoryId,
    },
    { categoryName : req.body.category },
    { new: true }
  );
  if (!UpdatedCategory) {
    return next(ApiError(404, "Category not found"));
  }
  res.status(200).json({
    message: "Category Updated successfully",
    success: true,
    UpdatedCategory,
  });
});

const DeleteCategory = CatchAsync(async (req, res, next) => {
  const CategoryId = req.params.id;
  const CategoryName = await CategoryModal.findByIdAndDelete(CategoryId);
  if (!CategoryName) {
    return next(ApiError(404, "Category not exist"));
  }
  res.status(200).json({
    message: "Category Deleted successfully",
    success: true,
  });
});

const GetAllCategory = CatchAsync(async (req, res, next) => {
  const Categories = await CategoryModal.find({});
  res.status(200).json({
    success: true,
    Categories,
  });
});

export { CreateCategory, GetAllCategory, DeleteCategory, UpdateCategory };
