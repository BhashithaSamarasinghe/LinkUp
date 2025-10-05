import User from " .. /models/User.js";



// Signup a new user
export const signup = async (req, res)=>{
    const { fullName, email, password, bio } = req.body;

    try {
        if (!fullName || !email || !password || !bio) {
            return res.json({ success: false, message: "Missing Details" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.json({ success: false, message: "Account already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ fullName, email, password: hashPassword, bio });
    } catch (error) {}}