const User = require('../models/user');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
    const { username, email, password, address } = req.body;

    
    if (!username || !email || !password || !address) {
        return res.status(400).json({ message: "All fields are required." });
    }
    const userAvailable = await User.findOne({ email });
  
    if (userAvailable) {
      res.status(400);
      throw new Error("User already registered");
    }
  

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password", hashedPassword);

    try {
        
        const newUser = new User({
            username,
            email,
            password:hashedPassword, 
            address,
            
        });

        
        await newUser.save();


        res.status(201).json({ message: "User created successfully!", user: newUser });
    } catch (error) {
        
        if (error.code === 11000) {
            return res.status(409).json({ message: "Email address already taken." });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        
        const user = await User.findOne({ email });

        
        if (user && (await bcrypt.compare(password, user.password))) {
            const accessToken = jwt.sign(
                {
                    user: user.username,
                    email: user.email,
                    id: user.id,
                    role: user.role,
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "5d" }
            );

            
            return res.status(200).json({ id: user.id, role: user.role, accessToken });
        } else {
            return res.status(401).json({ message: "Email or password is not valid." });
        }
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: "Internal server error." });
    }
};
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from the authentication middleware
        const user = await User.findById(userId).select('-password'); // Exclude password

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user); // Send user data (including address) to the frontend
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user profile', error: error.message });
    }
};

const updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; // Assuming JWT middleware attaches user ID

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current and new password are required." });
    }

    try {
        const user = await User.findById(userId);

        if (user && (await bcrypt.compare(currentPassword, user.password))) {
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedNewPassword;
            await user.save();

            return res.status(200).json({ message: "Password updated successfully." });
        } else {
            return res.status(401).json({ message: "Current password is incorrect." });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal server error." });
    }
};
const updateProfile = async (req, res) => {
    const { username, email } = req.body;
    const userId = req.user.id; // Assuming JWT middleware attaches user ID

    if (!username || !email) {
        return res.status(400).json({ message: "Username and email are required." });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, email },
            { new: true, runValidators: true }
        );

        return res.status(200).json({ message: "Profile updated successfully.", user: updatedUser });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error." });
    }
};
const manageCity = async (req, res) => {
    const { city } = req.body;
    const userId = req.user.id; // Assuming JWT middleware attaches user ID

    if (!city) {
        return res.status(400).json({ message: "City is required." });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        user.address.city = city;
        await user.save();

        return res.status(200).json({ message: "City updated successfully.", address: user.address });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error." });
    }
};



module.exports = {
    createUser,loginUser,updatePassword,
    updateProfile,
    manageCity,getUserProfile
};
