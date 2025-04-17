import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import path from 'path';


export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
         
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile:{
                profilePhoto:cloudResponse.secure_url,
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        console.log("Request Body:", req.body);

        // Check if a file is uploaded
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        console.log("Uploaded File:", file);

        // Convert file to Data URI
        let fileUri;
        try {
            fileUri = getDataUri(file);
        } catch (err) {
            console.error("Error generating file URI:", err);
            return res.status(500).json({ message: "Error processing file" });
        }

        // Upload to Cloudinary
        let cloudResponse;
        try {
            cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            console.log("Cloudinary Upload Response:", cloudResponse);
        } catch (err) {
            console.error("Cloudinary Upload Error:", err);
            return res.status(500).json({ message: "Error uploading file to Cloudinary" });
        }

        // Convert skills to array
        let skillsArray = skills ? skills.split(",") : [];

        // Get authenticated user ID
        const userId = req.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        console.log("User ID:", userId);

        // Find user in database
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user details
        
        if (skills) user.profile.skills = skillsArray;

        // Save resume link from Cloudinary
        if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url;
            user.profile.resumeOriginalName = file.originalname;
        }

        // Save updated user
        try {
            await user.save();
            console.log("User updated successfully");
        } catch (err) {
            console.error("Error saving user:", err);
            return res.status(500).json({ message: "Error saving user data" });
        }

        // Return updated user info
        return res.status(200).json({
            message: "Profile updated successfully",
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                profile: user.profile,
            },
            success: true,
        });

    } catch (error) {
        console.error("Unexpected server error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
