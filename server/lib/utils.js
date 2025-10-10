import jwt from "jsonwebtoken";

// Function to generate a token for a user
export const generateToken = (userId)=>{
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn });
    return token;
}