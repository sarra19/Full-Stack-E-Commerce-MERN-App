import React, { useContext, useState } from 'react';
import loginIcons from '../assest/signin.png';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebookF, FaGithub } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import Context from '../context';
import axios from 'axios';

// Validation function
const validateField = (name, value) => {
  let error = '';
  switch (name) {
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
    default:
      break;
  }
  return error;
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
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { fetchUserDetails, fetchUserAddToCart, setEmail, setPage, email, setOTP } = useContext(Context);

  const navigateToOtp = () => {
    if (data.email) {
      const OTP = Math.floor(Math.random() * 9000 + 1000);
      setOTP(OTP);
      setEmail(data.email);
      axios.post("http://localhost:8080/api/password-reset/send_recovery_email", {
        OTP,
        recipient_email: data.email,
      })
      .then(() => navigate('/test'))
      .catch(console.log);
    } else {
      toast.error("Please enter your email");
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    let formIsValid = true;
    const newErrors = {};

    // Validate email
    const emailError = validateField('email', data.email);
    if (emailError) {
      newErrors.email = emailError;
      formIsValid = false;
    }

    // Validate password
    const passwordError = validateField('password', data.password);
    if (passwordError) {
      newErrors.password = passwordError;
      formIsValid = false;
    }

    if (!formIsValid) {
      setErrors(newErrors);
      return;
    }

    try {
      const dataResponse = await fetch(SummaryApi.signIn.url, {
        method: SummaryApi.signIn.method,
        credentials: 'include',
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const dataApi = await dataResponse.json();

      if (dataApi.success) {
        toast.success(dataApi.message);
        navigate('/');
        fetchUserDetails();
        fetchUserAddToCart();
      } else if (dataApi.error) {
        toast.error(dataApi.message);
      }
    } catch (error) {
      toast.error('An error occurred during login.');
    }
  };

  const googleAuth = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/google`;
  };

  const facebookAuth = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/facebook`;
  };

  const githubAuth = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/github`;
  };

  return (
    <section id='login'>
      <div className='mx-auto container p-4'>
        <div className='bg-white border-2 border-pink-500 p-5 w-full max-w-sm mx-auto rounded-lg shadow-md'>
          <div className='w-20 h-20 mx-auto'>
            <img src={loginIcons} alt='login icons' />
          </div>

          <form className='pt-6 flex flex-col gap-2' onSubmit={handleSubmit}>
            <div className='grid'>
              <label>Email:</label>
              <div className='bg-slate-100 p-2'>
                <input
                  type='email'
                  placeholder='Enter email'
                  name='email'
                  value={data.email}
                  onChange={handleOnChange}
                  className='w-full h-full outline-none bg-transparent' />
                {errors.email && <p className='text-red-500 text-sm'>{errors.email}</p>}
              </div>
            </div>

            <div>
              <label>Password:</label>
              <div className='bg-slate-100 p-2 flex'>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder='Enter password'
                  value={data.password}
                  name='password'
                  onChange={handleOnChange}
                  className='w-full h-full outline-none bg-transparent' />
                <div className='cursor-pointer text-xl' onClick={() => setShowPassword(prev => !prev)}>
                  <span>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              {errors.password && <p className='text-red-500 text-sm'>{errors.password}</p>}
              <a
                href="#"
                onClick={navigateToOtp}
                className='block w-fit ml-auto hover:underline hover:text-pink-600'>
                Forgot password?
              </a>
            </div>

            <button className='bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6'>Login</button>
          </form>

          <div className='text-center mt-8'>
            <p className='text-gray-600 mb-4 text-sm'>Or login with</p>
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
              Don't have an account? <Link to={"/sign-up"} className='text-pink-600 hover:text-pink-700 hover:underline'>Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
