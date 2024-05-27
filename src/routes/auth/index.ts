import express, { Request, Response } from "express";
import checkDuplicateEmail from "../../middlewares/checkDuplicateEmail";
import { login, logout, signUp, validateEmail } from "../../controllers/auth/index";
import { verifyToken } from "../../middlewares/verifyToken";
import passport from 'passport';
import { secret } from "../../config/auth.config";
import Jwt from "jsonwebtoken";
import UserModel from "../../models/user";
import { auth } from "firebase-admin";

const authRouter = express.Router();

authRouter.post("/signup", checkDuplicateEmail, signUp);
authRouter.post("/validate-email", validateEmail);
authRouter.post("/login", login);
authRouter.post("/logout", verifyToken, logout);


authRouter.post('/google-auth', async (req: Request, res: Response) => {
    const { token } = req.body;
  
    // Verify the token with Google's API
    // (Assuming you have a function verifyGoogleToken)
  
    const googleUser = await verifyGoogleToken(token);
  
    if (!googleUser) {
      return res.status(401).send('Invalid Google token');
    }
  
    let user = await UserModel.findOne({ googleId: googleUser.id });
    if (!user) {
      user = new UserModel({
        googleId: googleUser.id,
        userName: googleUser.name,
        email: googleUser.email,
        password: '',
        avatarImage: '',
        phoneNumber: '',
        groupIds: [],
        dataUrl: '',
        createAt: Date.now(),
        status: 'VALIDATED',
        validateCode: '',
      });
      await user.save();
    }
  
    const jtoken = Jwt.sign({ userId: user.id }, secret);
    return res.status(200).json({
        message: "Login success",
        id: user?.id,
        userName: user?.userName,
        avatarImage: user?.avatarImage,
        email: user?.email,
        phoneNumber: user?.phoneNumber,
        dataId: user?.dataId,
        token: jtoken,
    });
  });
  
  async function verifyGoogleToken(token) {
    const { OAuth2Client } = require('google-auth-library');
    const client = new OAuth2Client('159333030534-j4fbdio5te9oio6olrk2c2tl6nev6rm7.apps.googleusercontent.com');
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '159333030534-j4fbdio5te9oio6olrk2c2tl6nev6rm7.apps.googleusercontent.com'
    });
    const payload = ticket.getPayload();
    return {
      id: payload['sub'],
      email: payload['email'],
      name: payload['name'],
    };
  }
export default authRouter;