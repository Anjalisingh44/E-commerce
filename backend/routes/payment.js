const express = require("express");
const router = express.Router();
const { generateEsewaPaymentHash,verifyEsewaPayment, generateEncodedData } = require("../controller/payment");

router.post("/generate-hash", generateEsewaPaymentHash);
router.post("/verify-payment", verifyEsewaPayment);
router.post("/Encode", generateEncodedData);


module.exports = router;
