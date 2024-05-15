import { Request, Response } from "express";
import UserModel from "../../models/user";
import nodemailer from "nodemailer";
import { InformationEvent } from "http";
import Jwt from "jsonwebtoken";
import { secret } from "../../config/auth.config";

function generateCode(): string {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const sendValidateCode = async (email: string, code: string): Promise<void> => {

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'duongminhtruong2002.lequydon@gmail.com',
              pass: 'jhda naqz lyrp eozp'
            }
        });

        const mailOptions = {
            from: 'duongminhtruong2002.lequydon@gmail.com',
            to: 'truonggduonggmadridista@gmail.com',
            subject: 'Validate Your Email',
            text: `Validate code: ${code}`,
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.log(error);
        }

}

const signUp = async (req: Request, res: Response): Promise<any> => {
    try {

        const validateCode = generateCode();

        const newUser = new UserModel({
            userName: req.body.userName,
            email: req.body.email,
            password: req.body.password,
            avatarImage: req.body.avatarImage,
            phoneNumber: req.body.phoneNumber,
            groupIds: [],
            dataUrl: req.body.dataUrl,
            createAt: Date.now(),
            status: 'PENDING',
            validateCode: validateCode,
        });

        await newUser.save();
        sendValidateCode(req.body.email, validateCode);

        return res.status(201).json({ message: "Sign Up Success"});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const validateEmail = async (req: Request, res: Response): Promise<any> => {
    try {

        const pendingUser = await UserModel.findOne({
            email: req.body.email
        });

        if (!pendingUser) return res.status(404).json({ message: "Người dùng không tồn tại" });

        if(pendingUser?.validateCode == req.body.validateCode) {
            pendingUser!.status = "VALIDATED";
            pendingUser!.validateCode = "";
        } else return res.status(401).json({ message: "Incorrect Validate Code" });

        await pendingUser?.save();
        return res.status(200).json({ message: "Validated User" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const login = async (req: Request, res: Response): Promise<any> => {
    try {
        
        const user = await UserModel.findOne({
            email: req.body.email,
        });

        if (!user) return res.status(404).json({ message: "User not found" });
        
        if (user?.password !== req.body.password) return res.status(401).json({ message: "Incorrect password" });

        const tkIndex = user.deviceToken.indexOf(req.body.deviceToken);
        if(tkIndex == -1) user.deviceToken.push(req.body.deviceToken);
        await user.save();
        
        const token = Jwt.sign({ id: user?.id }, secret, {
            expiresIn: 86400,
        });

        return res.status(200).json({
            message: "Login success",
            id: user?.id,
            userName: user?.userName,
            avatarImage: user?.avatarImage,
            email: user?.email,
            token: token,
        });
    } catch (error) {
        return res.status(500).json({ message: "controller login " + error});
    }
}

const logout = async (req: Request, res: Response): Promise<any> => {
    try {
        
        const user = await UserModel.findById(req.body.userId);

        if (!user) return res.status(404).json({ message: "User not found" });
        
        const tkIndex = user.deviceToken.indexOf(req.body.deviceToken);
        if(tkIndex > -1) user.deviceToken.splice(tkIndex, 1);
        await user.save();

        return res.status(200).json({ message: "Logout success" });
    } catch (error) {
        return res.status(500).json({ message: "controller logout " + error});
    }
}

export {signUp, validateEmail, login, logout};