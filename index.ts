import express from "express";
import { connectDB } from "./src/config/db";
import cors from 'cors';
import multer from 'multer';
import authRouter from "./src/routes/auth";
import userRouter from "./src/routes/user";
import testRouter from "./src/routes/test";
import groupRouter from "./src/routes/group";
import transactionRouter from "./src/routes/transaction";
import syncRouter from "./src/routes/sync";
import notificationRouter from "./src/routes/notification";

const app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

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
app.use("/api", syncRouter);
app.use("/api", notificationRouter);
app.use("/api", testRouter);

const PORT = 8910;
connectDB();

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
})