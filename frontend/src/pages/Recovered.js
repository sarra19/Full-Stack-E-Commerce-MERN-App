import React from "react";
import recovered from '../assest/recovered.jpg';

export default function Recovered() {
  return (
    <div>
      <section className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="px-6 h-full text-gray-800 dark:text-white">
          <div className="flex flex-col lg:flex-row items-center justify-center h-full">
            <div className="w-full lg:w-1/2 mb-12 lg:mb-0 flex justify-center">
              <img
                src={recovered}
                alt="Success"
                className="w-2/2 lg:w-2/3 object-contain" // Adjust the width as needed
              />
            </div>
            <div className="w-full lg:w-1/2 text-center lg:text-center ">
              <h1 className="text-2xl font-bold mb-4  text-pink-700">
                Password Successfully Set
              </h1>
              <div className="flex items-center justify-center lg:justify-start my-4">
                <hr className="flex-1 border-t border-gray-300 dark:border-gray-600" />
                <a
                href="login"
                
                className='block w-fit ml-auto hover:underline hover:text-pink-600'>
                Login now
              </a>
                <hr className="flex-1 border-t border-gray-300 dark:border-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
