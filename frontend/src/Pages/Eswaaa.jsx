import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Eswaaa = () => {
  // State to hold the generated signature
  const [signature, setSignature] = useState('');

  // State to hold payment data (this can be dynamic)
  const [paymentData, setPaymentData] = useState({
    amount: '100',
    tax_amount: '10',
    total_amount: '110',
    transaction_uuid: '241028',
    product_code: 'EPAYTEST',
    product_service_charge: '0',
    product_delivery_charge: '0',
    success_url: 'http://example.com/success',
    failure_url: 'http://example.com/failure',
    signed_field_names: 'amount,tax_amount,total_amount,transaction_uuid,product_code,product_service_charge,product_delivery_charge', // These fields should be consistent with what eSewa expects
  });

  // Function to fetch the signature from your backend
  const fetchSignature = async () => {
    try {
      // Send the payment data to the backend to get the signature
      const response = await axios.post('http://localhost:5000/api/eswa/generate-signature', paymentData);
      setSignature(response.data.signature);  // Set the signature in state
    } catch (error) {
      console.error('Error fetching signature:', error);
    }
  };

  // UseEffect to fetch the signature when payment data changes
  useEffect(() => {
    fetchSignature();
  }, [paymentData]);

  // Handle form submit to submit data to eSewa
  const handleSubmit = (e) => {
    e.preventDefault();

    // Submit the form data to eSewa after the signature is added
    document.getElementById('paymentForm').submit();
  };

  return (
    <div>
      <h2>eSewa Payment</h2>
      <form
        id="paymentForm"
        action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
        method="POST"
        onSubmit={handleSubmit}
      >
        {/* Payment Fields */}
        <input
          type="text"
          name="amount"
          value={paymentData.amount}
          onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
          required
        />
        <input
          type="text"
          name="tax_amount"
          value={paymentData.tax_amount}
          onChange={(e) => setPaymentData({ ...paymentData, tax_amount: e.target.value })}
          required
        />
        <input
          type="text"
          name="total_amount"
          value={paymentData.total_amount}
          onChange={(e) => setPaymentData({ ...paymentData, total_amount: e.target.value })}
          required
        />
        <input
          type="text"
          name="transaction_uuid"
          value={paymentData.transaction_uuid}
          onChange={(e) => setPaymentData({ ...paymentData, transaction_uuid: e.target.value })}
          required
        />
        <input
          type="text"
          name="product_code"
          value={paymentData.product_code}
          onChange={(e) => setPaymentData({ ...paymentData, product_code: e.target.value })}
          required
        />
        <input
          type="text"
          name="product_service_charge"
          value={paymentData.product_service_charge}
          onChange={(e) => setPaymentData({ ...paymentData, product_service_charge: e.target.value })}
          required
        />
        <input
          type="text"
          name="product_delivery_charge"
          value={paymentData.product_delivery_charge}
          onChange={(e) => setPaymentData({ ...paymentData, product_delivery_charge: e.target.value })}
          required
        />
        <input
          type="text"
          name="success_url"
          value={paymentData.success_url}
          onChange={(e) => setPaymentData({ ...paymentData, success_url: e.target.value })}
          required
        />
        <input
          type="text"
          name="failure_url"
          value={paymentData.failure_url}
          onChange={(e) => setPaymentData({ ...paymentData, failure_url: e.target.value })}
          required
        />
        <input
          type="text"
          name="signed_field_names"
          value={paymentData.signed_field_names}
          onChange={(e) => setPaymentData({ ...paymentData, signed_field_names: e.target.value })}
          required
        />
        
        {/* Signature field */}
        <input
          type="text"
          name="signature"
          value={signature}  // The signature generated from backend
          readOnly
        />

        {/* Submit Button */}
        <input type="submit" value="Submit Payment" />
      </form>
    </div>
  );
};

export default Eswaaa;
