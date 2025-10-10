import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app)

// Setup Socket.io server
export const io = new Server(server, {
    cors: {origin: "*"}
})

// Store online users - now maps userId to a Set of socket IDs
export const userSocketMap = {}; // { userId: Set([socketId1, socketId2, ...]) }

// Socket.io middleware to authenticate connections
io.use((socket, next) => {
    try {
        const token = socket.handshake.auth?.token;
        
        // For backward compatibility, still check query param
        const queryToken = socket.handshake.query?.token;
        
        if (!token && !queryToken) {
            return next(new Error("Authentication error: No token provided"));
        }
        
        const decoded = jwt.verify(token || queryToken, process.env.JWT_SECRET);
        socket.userId = decoded.userId;
        return next();
    } catch (err) {
        console.log("Socket authentication error:", err.message);
        return next(new Error("Authentication error: Invalid token"));
    }
});

// Socket.io connection handler
io.on("connection", (socket)=>{
    const userId = socket.userId;
    console.log("User Connected", userId);

    // Initialize Set if it doesn't exist
    if(!userSocketMap[userId]) userSocketMap[userId] = new Set();
    
    // Add this socket ID to the user's set of connections
    userSocketMap[userId].add(socket.id);
    
    // Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", ()=>{
        console.log("User Disconnected", userId);
        
        if(userSocketMap[userId]) {
            // Remove this socket from the user's connections
            userSocketMap[userId].delete(socket.id);
            
            // If no more sockets, delete the user entry entirely
            if(userSocketMap[userId].size === 0) {
                delete userSocketMap[userId];
            }
        }
        
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

// Middleware setup
app.use(express.json({limit: "4mb"}));
app.use(cors());

// Routes setup
app.use("/api/status", (req, res)=> res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter)

// Connect to MongoDB
await connectDB();

if(process.env.NODE_ENV !== "production"){
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log("Server is running on PORT: " + PORT));
}

//Export server for Vercel
export default server;