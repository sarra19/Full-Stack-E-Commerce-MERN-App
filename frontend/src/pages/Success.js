import React from 'react';
import SUCCESSIMAGE from '../assest/success.png'
import { Link } from 'react-router-dom';

const Success = () => {
    return (
        <div className="bg-white w-full max-w-md mx-auto flex flex-col items-center p-6 rounded-lg shadow-lg border border-gray-200">
            <img
                src={SUCCESSIMAGE}
                alt="Success"
                className="w-24 h-24 mb-4"
            />
            <p className="text-green-600 font-bold text-2xl mb-4">Payment Successful</p>
            <Link 
                to="/order"
                className="px-4 py-2 border-2 border-green-600 rounded-md font-semibold text-green-600 hover:bg-green-600 hover:text-white transition-colors duration-300"
            >
                See Order
            </Link>
        </div>
    );
};

export default Success;
