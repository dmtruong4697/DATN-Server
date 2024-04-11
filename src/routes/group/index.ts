import express from "express";
import { verifyToken } from "../../middlewares/verifyToken";
import { createGroup, getGroupById, getGroupList, joinGroupByInvitecode } from "../../controllers/group";

const groupRouter = express.Router();

groupRouter.post("/create-group", verifyToken, createGroup);
groupRouter.post("/join-group-by-id", verifyToken, joinGroupByInvitecode);
groupRouter.post("/get-group", verifyToken, getGroupById);
groupRouter.post("/group-list", verifyToken, getGroupList);

export default groupRouter;