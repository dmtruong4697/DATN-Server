import express from "express";
import { verifyToken } from "../../middlewares/verifyToken";
import { createGroup, getGroupById, joinGroupByInvitecode } from "../../controllers/group";

const groupRouter = express.Router();

groupRouter.post("/create-group", verifyToken, createGroup);
groupRouter.post("/join-group-by-id", verifyToken, joinGroupByInvitecode);
groupRouter.post("/get-group", verifyToken, getGroupById);

export default groupRouter;