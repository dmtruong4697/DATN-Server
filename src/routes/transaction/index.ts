import express from "express";
import { getProfile, getUserById, updateProfile } from "../../controllers/user";
import { verifyToken } from "../../middlewares/verifyToken";
import { createTransaction, getTransactionById } from "../../controllers/transaction";

const transactionRouter = express.Router();

transactionRouter.post("/create-transaction", verifyToken, createTransaction);
transactionRouter.post("/get-transaction", verifyToken, getTransactionById);

export default transactionRouter;