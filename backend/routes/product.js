const express = require("express");
const {productadded, updateproduct, deleteproduct, getallproducts, getrecentproduct, getproductbyid, getProducts}  = require("../controller/product")
const validateToken = require("../middleware/validateToken");
const upload = require("../middleware/multerconfig");


const router = express.Router();
router.post("/add-product", validateToken,productadded);
router.put("/update-product/:id",validateToken,updateproduct)
router.delete("/delete-product/:id",validateToken,deleteproduct);
router.get('/get-all-product',getallproducts);
router.get('/get-recent-product',getrecentproduct)
router.get('/get-productbyid/:id',getproductbyid)
router.get("/",getProducts)

module.exports = router;