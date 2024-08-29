import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import SummaryApi from './common';
import Context from './context';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';

function App() {
  const dispatch = useDispatch();
  const [cartProductCount, setCartProductCount] = useState(0);

  const [page, setPage] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');

  // Function to fetch user details
  const fetchUserDetails = async () => {
    try {
      const dataResponse = await fetch(SummaryApi.current_user.url, {
        method: SummaryApi.current_user.method,
        credentials: 'include'
      });

      const dataApi = await dataResponse.json();

      if (dataApi.success) {
        dispatch(setUserDetails(dataApi.data));
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  // Function to fetch cart product count
  const fetchUserAddToCart = async () => {
    try {
      const dataResponse = await fetch(SummaryApi.addToCartProductCount.url, {
        method: SummaryApi.addToCartProductCount.method,
        credentials: 'include'
      });

      const dataApi = await dataResponse.json();

      setCartProductCount(dataApi?.data?.count || 0);
    } catch (error) {
      console.error('Error fetching cart product count:', error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchUserAddToCart();
  }, [fetchUserDetails]);

 
  return (
    <Context.Provider value={{
      fetchUserDetails,
      cartProductCount,
      fetchUserAddToCart,
      page,
      setPage,
      otp,
      setOTP,
      setEmail,
      email
    }}>
      <ToastContainer position='top-center' />
      <Header />
      <main className='min-h-[calc(100vh-120px)] pt-16'>
        <div className="flex justify-center items-center">
        </div>
        <Outlet />
      </main>
      <Footer />
    </Context.Provider>
  );
}

export default App;
