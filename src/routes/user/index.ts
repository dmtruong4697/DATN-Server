import express from "express";
import { avatarStorage, changePassword, getProfile, getUserById, updateAvatarImage, updateProfile } from "../../controllers/user";
import { verifyToken } from "../../middlewares/verifyToken";
import multer from "multer";

const userRouter = express.Router();

const upload = multer({
    storage: avatarStorage,
})

userRouter.post("/user-detail", getUserById);
userRouter.post("/profile-detail", verifyToken, getProfile);
userRouter.post("/update-profile", verifyToken, updateProfile);
userRouter.post("/change-password", verifyToken, changePassword);
userRouter.post("/update-avatar", upload.single('file'), verifyToken, updateAvatarImage);

export default userRouter;