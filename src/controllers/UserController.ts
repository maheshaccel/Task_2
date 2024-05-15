import { Response, Request, NextFunction } from "express";
import CatchAsync from "../utils/CatchAsync";
import UserModel from "../model/UserModel";
import { CreateToken } from "../utils/Service";
import { ApiError } from "../utils/Errorhandler";
import mongoose from "mongoose";
import PostModal from "../model/PostModal";

// create User
const CreateUser = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    const exist = await UserModel.findOne({ email: email });
    if (exist) {
      return next(ApiError(202, "User is already exist"));
    }

    const user = await UserModel.create({
      name,
      email,
      password,
    });

    // create token
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

    const user = await UserModel.findOneAndUpdate(
      { _id: userId },
      { ...req.body },
      { new: true }
    );

    if (!user) {
      return next(ApiError(404, "User is not exist"));
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

    const session = await mongoose.startSession();

    session.startTransaction();

    const user = await UserModel.findOneAndDelete({ _id: userId });

    if (!user) {
      await session.abortTransaction();
      return next(ApiError(404, "User is not exist"));
    }

    await PostModal.deleteMany({ user: userId });

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

    const session = await mongoose.startSession();

    session.startTransaction();

    const user = await UserModel.findOneAndDelete({ _id: userId });

    if (!user) {
      await session.abortTransaction();
      return next(ApiError(404, "User is not exist"));
    }

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

export {
  getUserDetails,
  CreateUser,
  UpdateUser,
  GetAllUser,
  DeleteUser,
  DeleteUserByID,
};
