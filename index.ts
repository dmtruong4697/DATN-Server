import express from "express";
import { connectDB } from "./src/config/db";
import cors from 'cors';
import multer from 'multer';
import authRouter from "./src/routes/auth";
import userRouter from "./src/routes/user";
import testRouter from "./src/routes/test";
import groupRouter from "./src/routes/group";
import transactionRouter from "./src/routes/transaction";

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('DATN-Server');
});

app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", groupRouter);
app.use("/api", transactionRouter);
app.use("/api", testRouter);

const PORT = 8910;
connectDB();

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
})