import React, { useState } from 'react';
import { toast } from 'react-toastify'; // Assuming you use react-toastify for notifications
import { useNavigate } from 'react-router-dom'; // Assuming you use react-router-dom for navigation

const Membership = () => {
  const [currentForm, setCurrentForm] = useState('signin');
  const [data, setData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const navigate = useNavigate();

  const handleFormSwitch = (form) => {
    setCurrentForm(form);
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentForm === 'create' && data.password === data.confirmPassword) {
      try {
        const dataResponse = await fetch('SummaryApi.signUP.url', {
          method: 'POST', // Change to POST if necessary
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const dataApi = await dataResponse.json();

        if (dataApi.success) {
          toast.success(dataApi.message);
          navigate('/login');
        } else {
          toast.error(dataApi.message);
        }
      } catch (error) {
        toast.error('An error occurred. Please try again.');
      }
    } else if (currentForm === 'signin') {
      try {
        const dataResponse = await fetch('SummaryApi.signIn.url', {
          method: 'POST', // Change to POST if necessary
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const dataApi = await dataResponse.json();

        if (dataApi.success) {
          toast.success(dataApi.message);
          navigate('/');
          // Add your fetchUserDetails and fetchUserAddToCart functions here if needed
        } else {
          toast.error(dataApi.message);
        }
      } catch (error) {
        toast.error('An error occurred. Please try again.');
      }
    } else if (currentForm === 'reset' && data.newPassword === data.confirmPassword) {
      try {
        const dataResponse = await fetch('SummaryApi.resetPassword.url', {
          method: 'POST', // Change to POST if necessary
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const dataApi = await dataResponse.json();

        if (dataApi.success) {
          toast.success(dataApi.message);
          navigate('/login');
        } else {
          toast.error(dataApi.message);
        }
      } catch (error) {
        toast.error('An error occurred. Please try again.');
      }
    } else {
      toast.error('Please check password and confirm password');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-gray-900 text-gray-400">
      {currentForm === 'signin' && (
        <div className="m-5 text-center">
          <h1 className="text-white text-left">ACCOUNT SIGN IN</h1>
          <hr />
          <p>Sign in to your account to access your profile, history, and any private pages you've been granted access to.</p>
          <form onSubmit={handleSubmit} className="mt-8">
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full my-2 p-2 border-none rounded text-gray-900"
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="w-full my-2 p-2 border-none rounded text-gray-900"
              onChange={handleChange}
            />
            <button type="submit" className="py-2 px-4 mt-8 bg-red-700 text-white rounded cursor-pointer hover:bg-gray-500">
              Sign in
            </button>
          </form>
          <button
            onClick={() => handleFormSwitch('reset')}
            className="mt-2 text-red-700 hover:text-red-500"
          >
            Reset password
          </button>
          <p>
            Not a member?{' '}
            <button
              onClick={() => handleFormSwitch('create')}
              className="text-red-700 hover:text-red-500"
            >
              Create account
            </button>
          </p>
        </div>
      )}
      {currentForm === 'create' && (
        <div className="m-5 text-center">
          <h1 className="text-white text-left">CREATE ACCOUNT</h1>
          <hr />
          <form onSubmit={handleSubmit} className="mt-8">
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              className="w-full my-2 p-2 border-none rounded text-gray-900"
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full my-2 p-2 border-none rounded text-gray-900"
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="w-full my-2 p-2 border-none rounded text-gray-900"
              onChange={handleChange}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              className="w-full my-2 p-2 border-none rounded text-gray-900"
              onChange={handleChange}
            />
            <button type="submit" className="py-2 px-4 mt-8 bg-red-700 text-white rounded cursor-pointer hover:bg-gray-500">
              Create account
            </button>
          </form>
          <button
            onClick={() => handleFormSwitch('signin')}
            className="mt-2 text-red-700 hover:text-red-500"
          >
            Back to Sign in
          </button>
        </div>
      )}
      {currentForm === 'reset' && (
        <div className="m-5 text-center">
          <h1 className="text-white text-left">RESET PASSWORD</h1>
          <hr />
          <form onSubmit={handleSubmit} className="mt-8">
            <input
              type="email"
              name="email"
              placeholder="Registered Email"
              required
              className="w-full my-2 p-2 border-none rounded text-gray-900"
              onChange={handleChange}
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              required
              className="w-full my-2 p-2 border-none rounded text-gray-900"
              onChange={handleChange}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              className="w-full my-2 p-2 border-none rounded text-gray-900"
              onChange={handleChange}
            />
            <button type="submit" className="py-2 px-4 mt-8 bg-red-700 text-white rounded cursor-pointer hover:bg-gray-500">
              Reset Password
            </button>
          </form>
          <button
            onClick={() => handleFormSwitch('signin')}
            className="mt-2 text-red-700 hover:text-red-500"
          >
            Back to Sign in
          </button>
        </div>
      )}
    </div>
  );
};

export default Membership;
