import express from "express";
import { getProfile, getUserById, updateProfile } from "../../controllers/user";
import { verifyToken } from "../../middlewares/verifyToken";

const userRouter = express.Router();

userRouter.post("/user-detail", getUserById);
userRouter.post("/profile-detail", verifyToken, getProfile);
userRouter.post("/update-profile", verifyToken, updateProfile);

export default userRouter;