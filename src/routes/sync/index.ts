import express from "express";
import { verifyToken } from "../../middlewares/verifyToken";
import { storeUserData, uploadUserData } from "../../controllers/sync";

const syncRouter = express.Router();

syncRouter.post("/store-data", verifyToken, uploadUserData.array('files'), storeUserData);

export default syncRouter;