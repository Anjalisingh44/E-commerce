const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

// Controller for generating eSewa payment hash
const generateEsewaPaymentHash = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount provided." });
    }

    const transaction_uuid = uuidv4();
    const data = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${process.env.ESEWA_PRODUCT_CODE}`;
    console.log("Data string before hash generation:", data);

    const secretKey = process.env.ESEWA_SECRET_KEY;
    const hash = crypto.createHmac("sha256", secretKey).update(data).digest("base64");

    return res.status(200).json({
      transaction_uuid,
      signature: hash,
      signed_field_names: "total_amount,transaction_uuid,product_code",
    });
  } catch (error) {
    console.error("Error generating eSewa payment hash:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Controller for verifying eSewa payment
const verifyEsewaPayment = async (req, res) => {
    try {
        const { encodedData } = req.body;

        if (!encodedData) {
            return res.status(400).json({ message: "encodedData is required" });
        }

        // Decode the base64-encoded data
        let decodedData;
        try {
            decodedData = Buffer.from(encodedData, "base64").toString("utf-8");
            decodedData = JSON.parse(decodedData);
        } catch (error) {
            return res.status(400).json({ message: "Invalid encodedData format", error });
        }

        console.log("Decoded Data:", decodedData);

        // Extract and validate required fields
        const { total_amount, transaction_uuid, product_code, signature } = decodedData;
        if (!total_amount || !transaction_uuid || !product_code || !signature) {
            return res.status(400).json({ message: "Missing required fields in decoded data" });
        }

        // Generate hash using the same logic as in hash generation
        const data = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
        console.log("Generated Data String:", data);
        const secretKey = process.env.ESEWA_SECRET_KEY;
        console.log("Secret Key Used:", secretKey);

        const generatedHash = crypto.createHmac("sha256", secretKey).update(data).digest("base64");
        console.log("Generated Hash:", generatedHash);

        // Compare hashes
        if (generatedHash !== signature) {
            console.log("Signature mismatch:", { generatedHash, signature });
            return res.status(400).json({ message: "Invalid Info", decodedData });
        }

        return res.status(200).json({
            message: "Payment verified successfully",
            response: decodedData,
        });
    } catch (error) {
        console.error("Error verifying eSewa payment:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};


// Controller to generate sample encoded data for testing
const generateEncodedData = async (req, res) => {
  try {
    const data = {
      transaction_code: uuidv4(),
      status: "SUCCESS",
      total_amount: "100",
      transaction_uuid: uuidv4(),
      product_code: process.env.ESEWA_PRODUCT_CODE,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature: crypto
        .createHmac("sha256", process.env.ESEWA_SECRET_KEY)
        .update(
          `total_amount=100,transaction_uuid=a9bf3cd1-04d2-4948-b607-cadc4031cc4c,product_code=${process.env.ESEWA_PRODUCT_CODE}`
        )
        .digest("base64"),
    };

    const jsonData = JSON.stringify(data);
    const base64Data = Buffer.from(jsonData).toString("base64");

    return res.status(200).json({ encodedData: base64Data });
  } catch (error) {
    console.error("Error generating encoded data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { generateEsewaPaymentHash, verifyEsewaPayment, generateEncodedData };
