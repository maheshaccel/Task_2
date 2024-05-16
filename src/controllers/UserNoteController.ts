import CatchAsync from "../utils/CatchAsync";
import fs from "fs";
import { ApiError } from "../utils/Errorhandler";
import { generateRandomFileName } from "../utils/Service";
import UserNoteModal from "../model/UserNoteModal";
import { Types } from "mongoose";

const CreateNote = CatchAsync(async (req, res, next) => {
  // @ts-ignore
  const userId = req.user;
  const { content } = req.body;
  const folderPath = `public/user/${userId}/notes`;
  const filename = `${generateRandomFileName(20)}.txt`;

  if (!content) {
    return next(ApiError(422, "Please write content"));
  }

  fs.mkdir(folderPath, { recursive: true }, (err) => {
    if (err) {
      console.error("Error creating folder:", err);
      return;
    }

    fs.writeFile(`${folderPath}/${filename}`, content, { flag: "w" }, (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
      console.log("File written successfully");
    });
  });

  const note = await UserNoteModal.create({
    user: userId,
    file: filename,
  });

  res.status(200).json({
    message: "Note Created Succesfully",
    note,
  });
});

const UpdateNote = CatchAsync(async (req, res, next) => {
  // @ts-ignore
  const userId = req.user;
  const noteID = req.params.id;
  const { content } = req.body;
  const folderPath = `public/user/${userId}/notes`;

  if (!content) {
    return next(ApiError(422, "Please write content"));
  }

  const noteExist = await UserNoteModal.findOne({
    _id: noteID,
  });

  if (!noteExist) return next(ApiError(404, "Note is not exist"));

  const filename = noteExist.file;

  fs.writeFile(`${folderPath}/${filename}`, content, { flag: "w" }, (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return;
    }
  });

  const UpdatedNote = await UserNoteModal.findOneAndUpdate(
    { _id: noteID },
    {
      modify_date: Date.now(),
    },
    { new: true }
  );

  res.status(200).json({
    sucess: true,
    message: "note is updated sucessfully",
    UpdatedNote,
  });
});

const DeleteNote = CatchAsync(async (req, res, next) => {
  // @ts-ignore
  const userID = req.user;
  const noteID = req.params.id;

  const noteExist = await UserNoteModal.findOne({
    _id: noteID,
  });

  if (!noteExist) return next(ApiError(404, "Note is not exist"));

  const filename = noteExist.file;

  await UserNoteModal.findOneAndDelete({ _id: noteID });

  fs.unlinkSync(`public/user/${userID}/notes/${filename}`);

  res.status(200).json({
    message: "deleted sucessfully",
  });
});

const GetNote = CatchAsync(async (req, res, next) => {
  // @ts-ignore
  const userID = req.user;
  const noteID = req.params.id;

  const noteExist = await UserNoteModal.findOne({
    _id: noteID,
  });

  if (!noteExist) return next(ApiError(404, "Note is not exist"));

  const filename = noteExist.file;

  const filePath = `public/user/${userID}/notes/${filename}`;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).json({ error: "Failed to read file" });
      return;
    }
    res.json({ content: data });
  });
});

const GetAllNote = CatchAsync(async (req, res, next) => {
  // @ts-ignore
  const userID = req.user;

  const notes = await UserNoteModal.find({
    user: userID,
  });

  const files = notes.map((elem) => ({ file: elem.file, _id: elem._id }));

  const result: {
    data: string;
    _id: Types.ObjectId;
  }[] = [];

  for (const elem of files) {
    const filePath = `public/user/${userID}/notes/${elem.file}`;
    const data = await fs.promises.readFile(filePath, "utf8");
    result.push({ data: data, _id: elem._id });
  }
  
  res.status(200).json({
    result,
  });
});

export { CreateNote, UpdateNote, DeleteNote, GetAllNote, GetNote };
