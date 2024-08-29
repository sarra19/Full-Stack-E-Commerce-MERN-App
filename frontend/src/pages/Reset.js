  //eslint-disable
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'; // Ensure you have axios installed for HTTP requests
import Context from '../context'; // Import your context

export default function Reset() {
  const { email } = useContext(Context); // Access email from context
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  async function handleSubmit(event) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await axios.post( `${backendUrl}api/password-reset/change`, { email, password });
      // Handle success (e.g., navigate to a confirmation page or show a success message)
      navigate('/recovered');
    } catch (error) {
      setError("Error resetting password. Please try again.");
      console.error(error);
    }
  }

  useEffect(() => {
    if (email) {
      alert(`Email from context: ${email}`);
    }
  }, [email]); // Dependency array ensures alert runs when email changes
  return (
    <div>
      <section className="bg-gray-50 w-screen dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-pink-700 sm:p-8">
            <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Change Password
            </h2>
            {error && <p className="text-red-500">{error}</p>}
            <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-pink-50 border border-pink-500 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-pink-600 block w-full p-2.5 dark:bg-gray-700 dark:border-pink-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-pink-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-gray-50 border border-pink-500 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-pink-600 block w-full p-2.5 dark:bg-pink-700 dark:border-pink-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-pink-500"
                  required
                />
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="newsletter"
                    aria-describedby="newsletter"
                    type="checkbox"
                    className="w-4 h-4 border border-pink-500 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-pink-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="newsletter"
                    className="font-light text-gray-500 dark:text-gray-300"
                  >
                    I accept the{" "}
                    <a
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    >
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-pink-500 hover:bg-pink-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Reset Password
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
