  //eslint-disable
import React, { useState } from 'react';
import loginIcons from '../assest/signin.png';
import { Link, useNavigate } from 'react-router-dom';
import imageTobase64 from '../helpers/imageTobase64';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebookF, FaGithub } from 'react-icons/fa';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    profilePic: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));

    validateField(name, value);
  };

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
        if (value !== data.password) {
          error = 'Passwords do not match.';
        }
        break;
      default:
        break;
    }
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const validatePassword = (password) => {
    const lengthValid = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!lengthValid) return 'Password must be at least 8 characters long.';
    if (!hasUpperCase) return 'Password must contain at least one uppercase letter.';
    if (!hasLowerCase) return 'Password must contain at least one lowercase letter.';
    if (!hasNumber) return 'Password must contain at least one number.';
    if (!hasSpecialChar) return 'Password must contain at least one special character.';

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordError = validatePassword(data.password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (Object.values(errors).some((error) => error)) {
      toast.error('Please fix the errors before submitting.');
      return;
    }

    const dataResponse = await fetch(SummaryApi.signUP.url, {
      method: SummaryApi.signUP.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const dataApi = await dataResponse.json();

    if (dataApi.success) {
      toast.success(dataApi.message);
      navigate('/login');
    } else if (dataApi.error) {
      toast.error(dataApi.message);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const imagePic = await imageTobase64(file);

    setData((prev) => ({
      ...prev,
      profilePic: imagePic,
    }));
  };

  const googleAuth = () => {
    window.open(`${process.env.REACT_APP_BACKEND_URL}/auth/google`, '_self');
  };

  const facebookAuth = () => {
    window.open(`${process.env.REACT_APP_BACKEND_URL}/auth/facebook`, '_self');
  };

  const githubAuth = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/github`;
  };

  return (
    <section id='signup'>
      <div className='mx-auto container p-4'>
        <div className='bg-white border-2 border-pink-500 p-5 w-full max-w-sm mx-auto rounded-lg shadow-md'>
          <div className='w-20 h-20 mx-auto relative overflow-hidden rounded-full'>
            <div>
              <img src={data.profilePic || loginIcons} alt='profile' />
            </div>
            <form>
              <label>
                <div className='text-xs bg-opacity-80 bg-slate-200 pb-4 pt-2 cursor-pointer text-center absolute bottom-0 w-full'>
                  Upload Photo
                </div>
                <input type='file' className='hidden' onChange={handleFileUpload} />
              </label>
            </form>
          </div>

          <form className='pt-6 flex flex-col gap-2' onSubmit={handleSubmit}>
            <div className='grid'>
              <label>Name:</label>
              <div className='bg-slate-100 p-2'>
                <input
                  type='text'
                  placeholder='Enter your name'
                  name='name'
                  value={data.name}
                  onChange={handleOnChange}
                  required
                  className='w-full h-full outline-none bg-transparent'
                />
              </div>
              {errors.name && <p className='text-red-600 text-xs'>{errors.name}</p>}
            </div>
            <div className='grid'>
              <label>Email:</label>
              <div className='bg-slate-100 p-2'>
                <input
                  type='email'
                  placeholder='Enter email'
                  name='email'
                  value={data.email}
                  onChange={handleOnChange}
                  required
                  className='w-full h-full outline-none bg-transparent'
                />
              </div>
              {errors.email && <p className='text-red-600 text-xs'>{errors.email}</p>}
            </div>

            <div>
              <label>Password:</label>
              <div className='bg-slate-100 p-2 flex'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Enter password'
                  value={data.password}
                  name='password'
                  onChange={handleOnChange}
                  required
                  className='w-full h-full outline-none bg-transparent'
                />
                <div className='cursor-pointer text-xl' onClick={() => setShowPassword((prev) => !prev)}>
                  <span>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
                </div>
              </div>
              {errors.password && <p className='text-red-600 text-xs'>{errors.password}</p>}
            </div>

            <div>
              <label>Confirm Password:</label>
              <div className='bg-slate-100 p-2 flex'>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='Confirm password'
                  value={data.confirmPassword}
                  name='confirmPassword'
                  onChange={handleOnChange}
                  required
                  className='w-full h-full outline-none bg-transparent'
                />
                <div className='cursor-pointer text-xl' onClick={() => setShowConfirmPassword((prev) => !prev)}>
                  <span>{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</span>
                </div>
              </div>
              {errors.confirmPassword && <p className='text-red-600 text-xs'>{errors.confirmPassword}</p>}
            </div>

            <button className='bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6'>
              Sign Up
            </button>
          </form>
          <div className='text-center mt-8'>
            <p className='text-gray-600 mb-4 text-sm'>Or Sign up with</p>
            <div className='flex justify-center gap-6 mb-6'>
              <a onClick={googleAuth} className='text-blue-500 hover:text-blue-600 transition-transform transform hover:scale-110'>
                <FaGoogle size={20} />
              </a>
              <a onClick={facebookAuth} className='text-blue-700 hover:text-blue-800 transition-transform transform hover:scale-110'>
                <FaFacebookF size={20} />
              </a>
              <a onClick={githubAuth} className='text-gray-700 hover:text-gray-800 transition-transform transform hover:scale-110'>
                <FaGithub size={20} />
              </a>
            </div>
            <p className='text-gray-600 text-sm'>
              Already have an account? <Link to='/login' className='text-pink-600 hover:underline'>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
