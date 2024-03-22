import { NextFunction, Request, Response } from "express";
import UserModel from "../../models/user";

const checkDuplicateEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const userWithSameEmail = await UserModel.findOne({
            email: req.body.email
        });

        if (userWithSameEmail) {
            return res.status(400).json({ message: "Email address already in use" });
        }

        next(); 
    } catch (error) {
        res.status(500).json({ message:"middleware"+ error });
    }
};

export default checkDuplicateEmail