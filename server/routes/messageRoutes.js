//server/routes/messageRoutes.js
import express from "express";
import {protectRoute} from "../middleware/auth.js";
import { getUsersForSidebar, getMessages, markMessagesAsSeen, sendMessage } from "../controllers/messageController.js";



const messageRoutes = express.Router();

messageRoutes.get("/users", protectRoute, getUsersForSidebar);
messageRoutes.get("/:id", protectRoute, getMessages);
messageRoutes.put("/mark/:id", protectRoute, markMessagesAsSeen);
//messageRoutes.put("mark/:id", protectRoute, markMessagesAsSeen);
messageRoutes.post("/send/:id", protectRoute, sendMessage);

export default messageRoutes;