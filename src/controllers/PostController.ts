import CategoryModal from "../model/CategoryModal";
import PostModal from "../model/PostModal";
import CatchAsync from "../utils/CatchAsync";
import { ApiError } from "../utils/Errorhandler";
import { ApiFeature } from "../utils/GetAllPostFeature";
import fs from "fs";



const CreatePost = CatchAsync(async (req, res, next) => {
  const { title, category, content } = req.body;
  const filesBody = req.files;
  console.log(filesBody)
  let fileArr: any[];
  if (filesBody && Array.isArray(filesBody) && filesBody.length !== 0) {
    fileArr = filesBody.map((elem: Express.Multer.File) => elem.filename);
  } else {
    fileArr = [];
  }
  let categoryId;
  const CategoryName = await CategoryModal.findOne({
    categoryName: category,
  });


  if (CategoryName) {
    categoryId = CategoryName._id;
  } else {
    const NewCategory = await CategoryModal.create({
      categoryName: category,
    });
    categoryId = NewCategory._id;
  }

  const post = await PostModal.create({
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
});

// update Post
const UpdatePost = CatchAsync(async (req, res, next) => {
  const PostId = req.params.id;

  const post = await PostModal.findOne({ _id: PostId });

  if (!post) {
    return next(ApiError(404, "Post is not exist"));
  }

  let UpdatedfilesArr = post.file;
  let deletedfiles: string[] = [];

  if (req.files) {

    const filesBody = req.files;
    const newfiles: string[] = [];
    let fileArr: any[];


    if (filesBody && Array.isArray(filesBody) && filesBody.length !== 0) {
      fileArr = filesBody.map((elem: Express.Multer.File) => elem.filename);
    } else {
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

  const Updatedpost = await PostModal.findOneAndUpdate(
    { _id: PostId },
    {
      ...req.body,
      last_modify_date: Date.now(),
      file: UpdatedfilesArr,
    },
    { new: true }
  );

  console.log(deletedfiles)

  deletedfiles.forEach((elem) => {
    fs.unlink(`public/files/${elem}`, (err) => {
      if (err) throw err;
      console.log("file was deleted sucessfully");
    });
  });

  res.status(200).json({
    message: "Post is Update successfully",
    success: true,
    Updatedpost,
  });
});

// delete Post
const DeletePost = CatchAsync(async (req, res, next) => {
  const PostId = req.params.id;
  const post = await PostModal.findOneAndDelete({ _id: PostId });
  if (!post) {
    return next(ApiError(404, "Post is not exist"));
  }
  res.status(200).json({
    message: "Post is Delete successfully",
    success: true,
  });
});

// getall Post -> don't show the inactive user's post --> search functionality --> limit 10 -> pagination -> filter by category
const GetAllPost = CatchAsync(async (req, res, next) => {
  const filter = req.query;
  const keyword = req.query.search
    ? {
        $or: [{ title: { $regex: new RegExp("s", "i") } }],
      }
    : {};
  const limit = 10;
  const feature = new ApiFeature(PostModal, filter)
    .search()
    .filter()
    .pagination(limit, Number(req.query.page));

  const Posts = await feature.QueryModel.sort({ post_date: -1 });

  res.status(200).json({
    Posts,
  });
});

const GetPostByID = CatchAsync(async (req, res, next) => {
  const PostID = req.params.id;
  const Post = await PostModal.findById(PostID);

  if (Post) {
    return next(ApiError(404, "Post not exist"));
  }

  res.status(200).json({
    message: "Posts gets Success",
    Post,
  });
});

const GetUserPost = CatchAsync(async (req, res, next) => {
  // @ts-ignore
  const Posts = await PostModal.find({ user: req.user });
  res.status(200).json({
    Posts,
  });
});
export {
  CreatePost,
  UpdatePost,
  DeletePost,
  GetAllPost,
  GetPostByID,
  GetUserPost,
};
