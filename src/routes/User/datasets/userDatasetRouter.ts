import express from "express";
import { usePath } from "../../../utility/pathInterface";
import userDatasetOperationRouter from "./userDatasetOperationRouter";
const userDatasetRouter = express.Router();

usePath(userDatasetRouter, userDatasetOperationRouter, '/operations');

export default userDatasetRouter;