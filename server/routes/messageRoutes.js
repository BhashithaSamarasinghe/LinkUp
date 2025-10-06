import express from "express";
import {protectRoute} from "../middleware/authMiddleware.js";
import { getUsersForSidebar, getMessages, markMessagesAsSeen } from "../controllers/messageController.js";
import e from "express";


const messageRoutes = express.Router();

messageRoutes.get("/users", protectRoute, getUsersForSidebar);
messageRoutes.get("/:id", protectRoute, getMessages);
messageRoutes.put("/mark/:id", protectRoute, markMessagesAsSeen);
//messageRoutes.put("mark/:id", protectRoute, markMessagesAsSeen);

export default messageRoutes;