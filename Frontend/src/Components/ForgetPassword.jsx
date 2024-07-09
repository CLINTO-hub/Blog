import React, { useState } from 'react';
import { BASE_URL } from '../../config';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      toast.success(data.message);
      navigate('/ResetPassword')
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-full px-5 sm:px-0 bg-gray-100">
      <div className="flex flex-col bg-white rounded-lg shadow-lg border overflow-hidden max-w-md w-full p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-gray-700 border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-700"
            required
          />
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 py-2 px-4 text-white font-bold rounded transition duration-300"
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
