import React from 'react';
import CANCELIMAGE from '../assest/cancel.png'
import { Link } from 'react-router-dom';

const Success = () => {
    return (
        <div className="bg-white w-full max-w-md mx-auto flex flex-col items-center p-6 rounded-lg shadow-lg border border-gray-200">
            <img
                src={CANCELIMAGE}
                alt="cancel"
                className="w-24 h-24 mb-4"
            />
            <p className="text-red-600 font-bold text-2xl mb-4">Payment Cancel</p>
            <Link 
                to="/cart"
                className="px-4 py-2 border-2 border-red-600 rounded-md font-semibold text-red-600 hover:bg-green-600 hover:text-white transition-colors duration-300"
            >
Go To Cart            </Link>
        </div>
    );
};

export default Success;
