import express from "express";
import checkDuplicateEmail from "../../middlewares/checkDuplicateEmail";
import { login, signUp, validateEmail } from "../../controllers/auth/index";

const authRouter = express.Router();

authRouter.post("/signup", checkDuplicateEmail, signUp);
authRouter.post("/validate-email", validateEmail);
authRouter.post("/login", login);

export default authRouter;