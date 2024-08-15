import React from 'react';
import LOGOIMAGE from '../assest/logo.png'; // Assuming the logo represents the brand

const Contact = () => {
    return (
        <div className="bg-white w-full max-w-2xl mx-auto flex flex-col items-center p-8 rounded-lg shadow-lg border border-gray-200">
            <img
                src={LOGOIMAGE}
                alt="Sarradise Logo"
                className="w-32 h-32 mb-6"
            />
            <p className="text-pink-600 font-bold text-3xl mb-6">Contact Us</p>
            <p className="text-gray-700 text-center text-lg mb-6">
                We would love to hear from you! Whether you have a question about our products,
                or just want to get in touch, feel free to reach out to us through any of the
                methods below.
            </p>

            <div className="text-center text-lg text-gray-700 mt-8">
                <p className="mb-2"><strong>Email:</strong> admin@sarradise.com</p>
                <p className="mb-2"><strong>Phone:</strong> +216 56759877</p>
                <p><strong>Address:</strong> Habib Bourguiba Str., Ras Jebal, Bizerte</p>
            </div>
        </div>
    );
};

export default Contact;
