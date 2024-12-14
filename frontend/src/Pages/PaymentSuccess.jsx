import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PaymentSuccess = () => {
    const [transactionId, setTransactionId] = useState('');
    const [status, setStatus] = useState('');
    const location = useLocation();

    useEffect(() => {
        // Get query parameters from the URL
        const params = new URLSearchParams(location.search);
        setTransactionId(params.get('transaction_id'));
        setStatus(params.get('status'));
    }, [location]);

    return (
        <div>
            <h1>Payment Successful</h1>
            <p>Thank you for your purchase! Your payment was successful.</p>
            {transactionId && <p>Transaction ID: {transactionId}</p>}
            <p>Status: {status}</p>
        </div>
    );
};

export default PaymentSuccess;
