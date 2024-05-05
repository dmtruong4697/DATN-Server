import express from "express";
import { verifyToken } from "../../middlewares/verifyToken";
import { createGroup, getGroupById, getGroupList, getGroupMember, getGroupTotal, joinGroupByInvitecode, leaveGroupById, splitMoney } from "../../controllers/group";

const groupRouter = express.Router();

groupRouter.post("/create-group", verifyToken, createGroup);
groupRouter.post("/join-group-by-id", verifyToken, joinGroupByInvitecode);
groupRouter.post("/leave-group-by-id", verifyToken, leaveGroupById);
groupRouter.post("/get-group", verifyToken, getGroupById);
groupRouter.post("/group-list", verifyToken, getGroupList);
groupRouter.post("/group-member", verifyToken, getGroupMember);
groupRouter.post("/group-total", verifyToken, getGroupTotal);
groupRouter.post("/split-money", verifyToken, splitMoney);

export default groupRouter;