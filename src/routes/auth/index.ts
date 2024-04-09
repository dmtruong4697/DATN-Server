import express from "express";
import checkDuplicateEmail from "../../middlewares/checkDuplicateEmail";
import { login, logout, signUp, validateEmail } from "../../controllers/auth/index";
import { verifyToken } from "../../middlewares/verifyToken";

const authRouter = express.Router();

authRouter.post("/signup", checkDuplicateEmail, signUp);
authRouter.post("/validate-email", validateEmail);
authRouter.post("/login", login);
authRouter.post("/logout", verifyToken, logout);

export default authRouter;