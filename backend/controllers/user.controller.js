const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

exports.createAccount = async (req, res) => {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password || !role) {
        return res.status(400).json({ error: true, message: "All fields are required" });
    }

    try {
        const isUser = await User.findOne({ email });
        if (isUser) {
            return res.status(400).json({ error: true, message: "User already exists" });
        }

        const user = new User({ fullName, email, password, role });
        await user.save();

        const accessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "36000m"
        });

        return res.status(201).json({
            error: false,
            user,
            accessToken,
            message: "Registration Successful"
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: true, message: "All fields are required" });
    }

    try {
        const userInfo = await User.findOne({ email });
        if (!userInfo) {
            return res.status(400).json({ message: "User not found" });
        }

        if (userInfo.password === password) {
            const user = { user: userInfo };
            const userAccessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: "36000m"
            });

            return res.json({
                error: false,
                message: "Login Successful",
                email,
                accessToken: userAccessToken
            });
        } else {
            return res.status(400).json({
                error: true,
                message: "Invalid Credentials"
            });
        }
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.json({ user });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Server error." });
    }
};

exports.searchUsers = async (req, res) => {
    try {
        const query = req.query.search;
        if (!query) {
            console.log("Search query is missing");
            return res.status(400).json({ message: "Search query is required" });
        }
        const users = await User.find({ fullName: new RegExp(query, 'i') });
        res.json(users);
    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ message: error.message });
    }
};



