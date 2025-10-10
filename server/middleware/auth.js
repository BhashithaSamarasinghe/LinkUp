//middleware/auth.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Middleware to protect routes
export const protectRoute = async (req, res, next)=>{
    try {
        // Support standard Authorization header: "Bearer <token>"
        const authHeader = req.headers.authorization || req.headers.Authorization;
        const tokenHeader = req.headers.token;
        const token = authHeader && authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : tokenHeader;

        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ success: false, message: 'Token expired' });
            }
            return res.status(401).json({ success: false, message: 'Token invalid' });
        }

        const user = await User.findById(decoded.userId).select("-password");
        if(!user) return res.status(404).json({ success: false, message: "User not found" });

        req.user = user;
        next();
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}