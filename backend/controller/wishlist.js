const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const Product = require("../models/product");
const mongoose = require("mongoose");

// Add a product to the user's wishlist
const addToWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.body;  // Assuming productId is sent in the request body

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(req.user.id); // Get user by ID from validated token

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Ensure wishlist is an array
    if (!Array.isArray(user.wishlist)) {
        user.wishlist = [];
    }

    // Check if the product is already in the wishlist
    if (user.wishlist.includes(productId)) {
        return res.status(200).json({ message: "Product is already in wishlist" });
    }

    // Add product to the wishlist
    user.wishlist.push(productId);
    await user.save();

    return res.status(200).json({ message: "Product added to wishlist" });
});

// Remove a product from the user's wishlist
const removeFromWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.params; // Get product ID from the request params
    const userId = req.user.id;   
    console.log("productid",req.params.productId) 
    console.log("User ID:", req.user.id);
      // Assumes you have user authentication and the user ID is available in req.user.id
  
    // Find the user in the database
    const user = await User.findById(userId);
  
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  
    // Check if wishlist exists and contains the product
    const productIndex = user.wishlist.findIndex(
      (id) => id.toString() === productId // Convert ObjectId to string for comparison
    );
      console.log("User Wishlist:", user.wishlist);

  
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }
  
    // Remove the product from the wishlist
    user.wishlist.splice(productIndex, 1);
  
  
    // Save the updated user document
    await user.save();
  
    return res.status(200).json({ message: "Product removed from wishlist" });
  });
  
// Get all products in the user's wishlist
const getWishlist = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).populate("wishlist"); // Populate to get product details

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Ensure wishlist is an array
    if (!Array.isArray(user.wishlist)) {
        user.wishlist = [];
    }

    return res.status(200).json({ message: "Wishlist fetched successfully", data: user.wishlist });
});

module.exports = { addToWishlist, removeFromWishlist, getWishlist };
