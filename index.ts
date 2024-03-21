import express from "express";
import { connectDB } from "./src/config/db";
import cors from 'cors';
import multer from 'multer';
import authRouter from "./src/routes/auth";
import userRouter from "./src/routes/user";

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('DATN-Server');
});

app.use("/api", authRouter);
app.use("/api", userRouter);

const PORT = 8910;
connectDB();

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
})