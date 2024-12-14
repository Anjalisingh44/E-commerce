const asyncHandler = require("express-async-handler");
const Category = require("../models/category");
const User = require("../models/user");
const mongoose = require('mongoose');

// Add a new category
const addCategory = asyncHandler(async (req, res) => {
    try {
        // Get user ID from headers and check admin privileges
        const { id } = req.headers;
        const user = await User.findById(id);

        if (!user || user.role !== "admin") {
            res.status(403);
            throw new Error("You do not have permission to perform admin work");
        }

        // The image URL will be provided directly in the request body
        const { name, description, image } = req.body;
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: "Category name must be unique" });
        }

        const category = new Category({
            name,
            description,
            image, // The URL of the image
        });

        await category.save();
        res.status(200).json({ message: "Category added successfully", id:category._id });
    } catch (error) {
        console.error("Error in addCategory controller:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Update a category by ID
const updateCategory = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        const { name, description, image } = req.body; // Accept the image URL in the body

        const category = await Category.findByIdAndUpdate(
            id,
            {
                name,
                description,
                image, // The URL of the image (if provided)
            },
            { new: true } // Return the updated category
        );

        res.status(200).json({ message: "Category updated successfully", data: category });
    } catch (error) {
        console.error("Error in updateCategory controller:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Delete a category by ID
const deleteCategory = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        await Category.findByIdAndDelete(id);
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Error in deleteCategory controller:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Get all categories
const getAllCategories = asyncHandler(async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.status(200).json({ status: "success", data: categories });
    } catch (error) {
        console.error("Error in getAllCategories controller:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// Get a single category by ID
const getCategoryById = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({ status: "success", data: category });
    } catch (error) {
        console.error("Error in getCategoryById controller:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

module.exports = { addCategory, updateCategory, deleteCategory, getAllCategories, getCategoryById };

