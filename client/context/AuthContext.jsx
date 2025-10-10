import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    // Check if user is authenticated and if so set the user data and conncect the socket

    const checkAuth = async () => {
        try {
            const { data } = await axios.get("/api/auth/check");
            if(data.success) {
                setAuthUser(data.user)
                connectSocket(data.user)
            }
        } catch (error) {
            // Don't show error toast for 401 authentication failures - this is expected when not logged in
            if (error.response?.status !== 401) {
                toast.error(error.message)
            }
        }
    }

    //Login function to handle user authentication and socket connection

    const login = async(state, credentials) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials);
            if(data.success) {
                // Set token first to ensure it's available for socket connection
                const newToken = data.token;
                localStorage.setItem("token", newToken);
                axios.defaults.headers.common["token"] = newToken;
                setToken(newToken);
                
                // Then update user and connect socket
                setAuthUser(data.userData);
                setTimeout(() => connectSocket(data.userData), 100); // Small delay to ensure token is saved
                
                toast.success(data.message);
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // Logout function to handle user logout and socket disconnection
    const logout = async () => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        axios.defaults.headers.common["token"] = null;
        toast.success("Logged out successfully")
        socket.disconnect();
    }

    // Update profile function to handle user profile updates
    const updateProfile = async (body) => {
        try {
            const { data } = await axios.put("/api/auth/update-profile", body);
            if (data.success) {
                setAuthUser(data.user);
                toast.success("Profile updated successfully");
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //Connect socket function to handle socket connection and online users updates
    const connectSocket = (userData) => {
        if(!userData || socket?.connected) return;
        
        // Important: For the login flow, we need to make sure we're using the most recent token
        // In login(), we might call connectSocket before the token is saved to localStorage
        const currentToken = localStorage.getItem("token");
        
        // If we have no token, retry in 500ms (allows time for token to be saved in login function)
        if (!currentToken) {
            console.log("No token found for socket connection, retrying in 500ms...");
            setTimeout(() => connectSocket(userData), 500);
            return;
        }
        
        const newSocket = io(backendUrl, {
            auth: { token: currentToken }
        });
        
        newSocket.connect();
        setSocket(newSocket);
        
        // Handle connection errors (new)
        newSocket.on("connect_error", (err) => {
            console.error("Socket connection error:", err.message);
            toast.error("Real-time connection failed: " + err.message);
        });
        
        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        });
    }

    useEffect(() => {
        if(token) {
            // Set both the custom token header and standard Authorization header
            axios.defaults.headers.common["token"] = token;
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        checkAuth();
    },[])

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile
    }
    return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
    )

}