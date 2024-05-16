import { Response, Request, NextFunction } from "express";
import CatchAsync from "../utils/CatchAsync";
import UserModel from "../model/UserModel";
import { CreateToken, RemoveFolder } from "../utils/Service";
import { ApiError } from "../utils/Errorhandler";
import mongoose from "mongoose";
import PostModal from "../model/PostModal";
import fs from "fs";
import { rimraf, rimrafSync } from "rimraf";

// create User
const CreateUser = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    const avatar = req.file;
    // @ts-ignore
    const folderPath = req.filePath;

    if (!name || !email || !password) {
      RemoveFolder(folderPath);
      return next(ApiError(300, "please fill all the details"));
    }

    const exist = await UserModel.findOne({ email: email });
    if (exist) {
      RemoveFolder(folderPath);
      return next(ApiError(202, "User is already exist"));
    }

    const user = await UserModel.create({
      name,
      email,
      password,
      avtar: avatar?.filename,
    });

    if (fs.existsSync(folderPath)) {
      fs.rename(folderPath, `public/user/${user._id}`, (err) => {
        if (err) {
          console.error("Error renaming folder:", err);
          return;
        }
        console.log("Folder renamed successfully");
      });
    }

    const token = CreateToken({ id: user._id, name: user.name });

    res.setHeader("Authorization", `Bearer ${token}`);

    res.status(200).json({
      message: "User is Created Successfully",
      user,
    });
  }
);

// Update User
const UpdateUser = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignores
    const userId = req.user;
    let deletfileName: string | null = null;

    const existUser = await UserModel.findOne({ _id: userId });

    if (!existUser) return next(ApiError(404, "User not found"));

    let avtar : string = existUser.avtar

    if (req.file) {
      deletfileName = existUser.avtar;
      avtar = req.file.filename
    }

    const user = await UserModel.findOneAndUpdate(
      { _id: userId },
      { ...req.body , avtar:avtar },
      { new: true }
    );

    if (!user) {
      return next(ApiError(404, "User is not exist"));
    }

    if (deletfileName) {
      fs.unlinkSync(`public/user/${user._id}/${deletfileName}`);
    }

    res.status(200).json({
      message: "User is Udpated Successfully",
      user,
    });
  }
);

// Delete User
const DeleteUser = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignores
    const userId = req.user;
    const folderPath = `public/user/${userId}`;
    const session = await mongoose.startSession();

    session.startTransaction();

    const user = await UserModel.findOneAndDelete({ _id: userId });

    if (!user) {
      await session.abortTransaction();
      return next(ApiError(404, "User is not exist"));
    }

    await PostModal.deleteMany({ user: userId });

    RemoveFolder(folderPath);

    session.commitTransaction();

    res.status(200).json({
      message: "User is Deleted Successfully",
    });
  }
);

const DeleteUserByID = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignores
    const userId = req.params.id;
    const folderPath = `public/user/${userId}`;

    const session = await mongoose.startSession();

    session.startTransaction();

    const user = await UserModel.findOneAndDelete({ _id: userId });

    if (!user) {
      await session.abortTransaction();
      return next(ApiError(404, "User is not exist"));
    }

    RemoveFolder(folderPath);

    await PostModal.deleteMany({ user: userId });

    res.status(200).json({
      message: "User is Deleted Successfully",
    });
  }
);

// getAll User
const GetAllUser = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserModel.find({});
    res.status(200).json({
      message: "User is Deleted Successfully",
      users,
    });
  }
);

const getUserDetails = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignores
    const userId = req.user;

    const user = await UserModel.findById(userId);

    res.status(200).json({
      user,
    });
  }
);

// create note
const CreateNotes = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignores
    const userId = req.user;

    const user = await UserModel.findById(userId);

    res.status(200).json({
      user,
    });
  }
);

export {
  getUserDetails,
  CreateUser,
  UpdateUser,
  GetAllUser,
  DeleteUser,
  DeleteUserByID,
};
