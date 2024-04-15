import express from "express";
import { verifyToken } from "../../middlewares/verifyToken";
import { storeData, uploadData, uploadUserData } from "../../controllers/sync";

const syncRouter = express.Router();

syncRouter.post("/store-data", verifyToken, uploadData.array('files'), storeData);
syncRouter.post("/upload-user-data", verifyToken, uploadUserData);

export default syncRouter;