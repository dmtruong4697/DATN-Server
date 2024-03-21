import express from "express";
import { getUserById } from "../../controllers/user";

const userRouter = express.Router();

userRouter.post("/user-detail", getUserById);

export default userRouter;