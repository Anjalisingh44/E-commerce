const asyncHandler = require("express-async-handler");
const Product = require("../models/product");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const CryptoJS = require('crypto-js');
require('dotenv').config();



const productadded = asyncHandler(async (req, res) => {
    try {
        // Check if all required fields are present
        const { name, description, price, size, images } = req.body;
        if (!name || !description || !price || !size || !images) {
            return res.status(400).json({ message: "All fields are required" });
        }
 
        // Fetch the user from the database using the ID stored in the JWT
        const { id } = req.headers;
        const user = await User.findById(id);
 
        // Check if the user exists and has admin privileges
        if (!user || user.role !== "admin") {
            res.status(403); // Forbidden
            throw new Error("You do not have permission to perform admin work");
        }
        const transactionCode = uuidv4();
 
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            size: req.body.size,
            images: req.body.images,
            transaction_code: transactionCode, 
        });
 
        await product.save();
        

        // Prepare the message for the signature generation
        

        
        // Send payment details to frontend
        res.status(200).json({
            message: "Product added successfully",
            product,
            transaction_code: transactionCode
        });
        
    } catch (error) {
        console.error("Error in Productadded controller:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
 });
 
const updateproduct = asyncHandler(async (req, res) => {
    try {
        
        const { id} = req.params;
        const product = await Product.findByIdAndUpdate(id,{
            name: req.body.name,
            description: req.body.description,
           price: req.body.price,
           size : req.body.size,
           images: req.body.images,
        },{
            new : true
        });

        res.status(200).json({ message: "Product updated successfully",data : product });
    } catch (error) {
        console.error("Error in Productadded controller:", error); // Log detailed error
        res.status(500).json({ message: "Server Error", error: error.message }); // Provide error details
    }
});
const deleteproduct = asyncHandler(async (req, res) => {
    try {
        const {id} = req.params;
        await Product.findByIdAndDelete(id);
        return res.status(200).json({message:"Product deleted successfully"})
       
    
    } catch (error) {
        console.error("Error in Productdeleted controller:", error); // Log detailed error
        res.status(500).json({ message: "Server Error", error: error.message }); // Provide error details
    }
});
const getallproducts = asyncHandler(async (req, res) => {
    try {
    
        
        const products = await Product.find().sort({ createdAt: -1})
        res.status(200).json({ status:"success", data: products });
       
    } catch (error) {
        console.error("Error to get all products:", error); // Log detailed error
        res.status(500).json({ message: "Server Error", error: error.message }); // Provide error details
    }
})
const getrecentproduct = asyncHandler(async (req, res) => {
    try {
    
        
        const products = await Product.find().sort({ createdAt: -1}).limit(6);
        res.status(200).json({ status:"success", data:products });
       
    } catch (error) {
        console.error("Error to get recent books :", error); // Log detailed error
        res.status(500).json({ message: "Server Error", error: error.message }); // Provide error details
    }
})
const getproductbyid = asyncHandler(async (req, res) => {
    try {
        // Fetch the user from the database using the ID stored in the JWT
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }
        
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        res.status(200).json({ status: "success" , data:product});
    } catch (error) {
        console.error("Error in getproduct by id controller:", error); 
        res.status(500).json({ message: "Server Error", error: error.message }); 
    }
});
const getProducts = async (req, res) => {
    try {
      const query = req.query.search;
      const products = await Product.find({
        name: { $regex: query, $options: "i" }, // Case-insensitive search
      });
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products", error });
    }
  };


module.exports = {productadded,updateproduct,deleteproduct,getallproducts,getrecentproduct,getproductbyid,getProducts};
