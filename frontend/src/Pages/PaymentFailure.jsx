import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PaymentFailure = () => {
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
            <h1>Payment Failed</h1>
            <p>We encountered an issue with your payment. Please try again.</p>
            {transactionId && <p>Transaction ID: {transactionId}</p>}
            <p>Status: {status}</p>
            <a href="/retry-payment">Retry Payment</a>
        </div>
    );
};

export default PaymentFailure;
