import React, { useContext, useState } from 'react';
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaInfoCircle, FaEnvelope, FaTrashAlt, FaBars,FaShoppingCart } from 'react-icons/fa'; // Import icons

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';
import ROLE from '../common/role';
import Context from '../context';
import logoSrc from '../assest/logo.png';
const Header = () => {
  const user = useSelector(state => state?.user?.user);
  const dispatch = useDispatch();
  const [menuDisplay, setMenuDisplay] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const context = useContext(Context);
  const navigate = useNavigate();
  const searchInput = useLocation();
  const URLSearch = new URLSearchParams(searchInput?.search);
  const searchQuery = URLSearch.getAll("q");
  const [search, setSearch] = useState(searchQuery);

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(SummaryApi.delete_user.url, {
        method: 'DELETE',  // Ensure this matches your API method
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user._id }), // Send the user ID
      });
  
      const data = await response.json();
  
      if (data.success) {
        toast.success("Your account has been deleted successfully.");
        dispatch(setUserDetails(null));
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An error occurred while deleting the account. Please try again.");
    }
  };

  
  const handleLogout = async () => {
    try {
      const fetchData = await fetch(SummaryApi.logout_user.url, {
        method: SummaryApi.logout_user.method,
        credentials: 'include',
      });

      const data = await fetchData.json();

      if (data.success) {
        toast.success(data.message);
        dispatch(setUserDetails(null));
        navigate("/");
      } else if (data.error) {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An error occurred while logging out. Please try again.");
    }
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);

    if (value) {
      navigate(`/search?q=${value}`);
    } else {
      navigate("/search");
    }
  };

  return (
    <header className='h-16 shadow-md bg-white fixed w-full z-40'>
      <div className=' h-full container mx-auto flex items-center px-4 justify-between'>
        <div className=''>
          <Link to={"/"}>
            <img src={logoSrc} alt="Sarradise Logo" width={90} height={50} />
          </Link>
        </div>

        <div className='hidden lg:flex items-center w-full justify-between max-w-sm border rounded-full focus-within:shadow pl-2'>
          <input type='text' placeholder='search product here...' className='w-full outline-none' onChange={handleSearch} value={search} />
          <div className='text-lg min-w-[50px] h-8 bg-pink-600 flex items-center justify-center rounded-r-full text-white'>
            <GrSearch />
          </div>
        </div>

        <div className='flex items-center gap-7'>

          <div className='relative flex justify-center'>
            {
              user?._id && (
                <div className='text-3xl cursor-pointer relative flex justify-center' onClick={() => setMenuDisplay(prev => !prev)}>
                  {
                    user?.profilePic ? (
                      <img src={user?.profilePic} className='w-10 h-10 rounded-full' alt={user?.name} />
                    ) : (
                      <FaRegCircleUser />
                    )
                  }
                </div>
              )
            }

            {
              menuDisplay && (
                <div className='absolute bg-white bottom-0 top-11 h-fit p-2 shadow-lg rounded'>
                  <nav>
                    {
                      user?.role === ROLE.ADMIN && (
                        <Link to={"/admin-panel/all-products"} className='whitespace-nowrap hidden md:block hover:bg-slate-100 p-2' onClick={() => setMenuDisplay(prev => !prev)}>Admin Panel</Link>
                      )
                    }
                    <Link to={'/order'} className='whitespace-nowrap hidden md:block hover:bg-slate-100 p-2' onClick={() => setMenuDisplay(prev => !prev)}>Order</Link>

                  </nav>
                </div>
              )
            }

          </div>

          {
            user?._id && (
              <Link to={"/cart"} className='text-2xl relative'>
                <span><FaShoppingCart /></span>

                <div className='bg-pink-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3'>
                  <p className='text-sm'>{context?.cartProductCount}</p>
                </div>
              </Link>
            )
          }

          <div className='relative'>
            <button 
              onClick={() => setDropdownOpen(prev => !prev)} 
              className='px-3 py-1 text-pink-600 hover:text-pink-700 focus:outline-none flex items-center'
            >
              <FaBars className='mr-2' /> {/* Icon for Menu */}
            </button>
            {dropdownOpen && (
              <div className='absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg'>
                <Link to={"/about"} className='block px-4 py-2  text-pink-600 hover:bg-gray-100 flex items-center'>
                  <FaInfoCircle className='mr-2' /> About Us
                </Link>
                <Link to={"/contact"} className='block px-4 py-2  text-pink-600 hover:bg-gray-100 flex items-center'>
                  <FaEnvelope className='mr-2' /> Contact Us
                </Link>
                <button onClick={handleDeleteAccount} className='block w-full text-left px-4 py-2  text-pink-600 hover:bg-gray-100 flex items-center'>
                  <FaTrashAlt className='mr-2' /> Delete Account
                </button>
              </div>
            )}
          </div>

          {
            user?._id ? (
              <button onClick={handleLogout} className='px-3 py-1 rounded-full text-white bg-pink-600 hover:bg-pink-700'>Logout</button>
            )
              : (
                <Link to={"/login"} className='px-3 py-1 rounded-full text-white bg-pink-600 hover:bg-pink-700'>Login</Link>
              )
          }

        </div>

      </div>
    </header>
  )
}

export default Header;