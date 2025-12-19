import React from 'react';
import { useNavigate } from 'react-router-dom';

const ThankYou = () => {
    const navigate = useNavigate();

    const handleContinueShopping = () => {
        navigate('/');
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <h1 className="text-3xl font-bold mb-4">Thank You for Your Purchase!</h1>
            <p className="text-lg mb-8">Your payment has been successfully processed.</p>
            <button
                className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                onClick={handleContinueShopping}
            >
                Continue Shopping
            </button>
        </div>
    );
};

export default ThankYou;
