import React from 'react';
import LOGOIMAGE from '../assest/logo.png'; // Assuming the logo represents the brand
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="bg-white w-full max-w-2xl mx-auto flex flex-col items-center p-8 rounded-lg shadow-lg border border-gray-200">
            <img
                src={LOGOIMAGE}
                alt="Sarradise Logo"
                className="w-32 h-32 mb-6"
            />
            <p className="text-pink-600 font-bold text-3xl mb-6">Welcome to Sarradise</p>
            <p className="text-gray-700 text-center text-lg mb-6">
                Sarradise is your ultimate destination for premium makeup products.
                We believe that beauty is for everyone, and our carefully curated
                selection of cosmetics is designed to enhance your natural beauty
                and empower you to express yourself.
            </p>
            <p className="text-gray-700 text-center text-lg mb-6">
                Discover a wide range of high-quality products from top brands, 
                including lipsticks, eyeshadows, foundations, and more. Whether you're 
                looking for the perfect everyday essentials or something special for a 
                night out, Sarradise has everything you need to create stunning looks.
            </p>
            <Link 
                to="/"
                className="px-6 py-3 border-2 border-pink-600 rounded-md font-semibold text-pink-600 hover:bg-pink-600 hover:text-white transition-colors duration-300"
            >
                Shop Now
            </Link>
        </div>
    );
};

export default About;
