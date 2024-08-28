import React, { useState } from 'react';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { IoMdClose } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import imageTobase64 from '../helpers/imageTobase64';

const AddUser = ({ onClose, callFunc }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [newUser, setNewUser] = useState({
        email: "",
        password: "",
        name: "",
        confirmPassword: "",
        profilePic: "",
    });
    const [errors, setErrors] = useState({});

    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'name':
                if (value.length < 3) {
                    error = 'Name must be at least 3 characters long.';
                } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                    error = 'Name must contain only letters and spaces.';
                }
                break;
            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = 'Invalid email format.';
                }
                break;
            case 'password':
                const passwordError = validatePassword(value);
                if (passwordError) {
                    error = passwordError;
                }
                break;
            case 'confirmPassword':
                if (value !== newUser.password) {
                    error = 'Passwords do not match.';
                }
                break;
            default:
                break;
        }
        setErrors(prev => ({
            ...prev,
            [name]: error,
        }));
    };

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setNewUser(prev => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const handleUploadPic = async (e) => {
        const file = e.target.files[0];
        const imagePic = await imageTobase64(file);
        setNewUser(prev => ({ ...prev, profilePic: imagePic }));
    };

    const validatePassword = (password) => {
        const lengthValid = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (!lengthValid) return "Password must be at least 8 characters long.";
        if (!hasUpperCase) return "Password must contain at least one uppercase letter.";
        if (!hasLowerCase) return "Password must contain at least one lowercase letter.";
        if (!hasNumber) return "Password must contain at least one number.";
        if (!hasSpecialChar) return "Password must contain at least one special character.";

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Check if there are any validation errors
        if (Object.values(errors).some(error => error)) {
            toast.error("Please fix the errors in the form.");
            return;
        }

        if (newUser.password === newUser.confirmPassword) {
            const response = await fetch(SummaryApi.signUP.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                onClose();
                callFunc(); // Refresh the user list
            } else {
                toast.error(data.message);
            }
        } else {
            toast.error("Passwords do not match.");
        }
    };

    return (
        <div className='fixed top-20 inset-0 z-10 flex items-center justify-center bg-slate-200 bg-opacity-50'>
            <div className='bg-white shadow-md p-8 w-full max-w-lg'>
                <button className='block ml-auto text-2xl' onClick={onClose}>
                    <IoMdClose />
                </button>

                <h1 className='pb-4 text-lg font-medium text-center'>Add New User</h1>

                <div className='w-16 h-16 mx-auto relative overflow-hidden rounded-full'>
                    <img src={newUser.profilePic || 'path/to/default/profile-pic.png'} alt='Profile' className='w-full h-full object-cover' />
                    <label className='absolute bottom-0 w-full text-center bg-opacity-80 bg-slate-200 py-1 cursor-pointer'>
                        Upload Photo
                        <input type='file' className='hidden' onChange={handleUploadPic} />
                    </label>
                </div>

                <form onSubmit={handleSubmit} className='flex flex-col gap-4 mt-4'>
                    <div>
                        <label>Name:</label>
                        <input
                            type='text'
                            name='name'
                            value={newUser.name}
                            onChange={handleOnChange}
                            required
                            className='border px-4 py-2 w-full'
                        />
                        {errors.name && <p className='text-red-500 text-sm'>{errors.name}</p>}
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type='email'
                            name='email'
                            value={newUser.email}
                            onChange={handleOnChange}
                            required
                            className='border px-4 py-2 w-full'
                        />
                        {errors.email && <p className='text-red-500 text-sm'>{errors.email}</p>}
                    </div>
                    <div>
                        <label>Password:</label>
                        <div className='flex border px-4 py-2 w-full items-center'>
                            <input
                                type={showPassword ? "text" : "password"}
                                name='password'
                                value={newUser.password}
                                onChange={handleOnChange}
                                required
                                placeholder='Enter password'
                                className='w-full outline-none'
                            />
                            <button type='button' onClick={() => setShowPassword(prev => !prev)} className='text-xl'>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.password && <p className='text-red-500 text-sm'>{errors.password}</p>}
                    </div>
                    <div>
                        <label>Confirm Password:</label>
                        <div className='flex border px-4 py-2 w-full items-center'>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name='confirmPassword'
                                value={newUser.confirmPassword}
                                onChange={handleOnChange}
                                required
                                placeholder='Confirm password'
                                className='w-full outline-none'
                            />
                            <button type='button' onClick={() => setShowConfirmPassword(prev => !prev)} className='text-xl'>
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className='text-red-500 text-sm'>{errors.confirmPassword}</p>}
                    </div>
                   
                    <button
                        type='submit'
                        className='w-fit mx-auto block py-2 px-4 rounded-full bg-pink-600 text-white hover:bg-pink-700'
                    >
                        Add User
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddUser;
