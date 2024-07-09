import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../config';
import { toast } from 'react-toastify';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const storedOtp = localStorage.getItem('otp');

      if (otp === storedOtp) {
        toast.success("OTP verified successfully!");
        localStorage.removeItem('otp');
        navigate('/login');
      } else {
        throw new Error("Invalid OTP");
      }
    } catch (error) {
      toast.error(error.message);
      console.error('Error verifying OTP:', error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-full px-5 sm:px-0 bg-gray-100">
      <div className="flex flex-col bg-white rounded-lg shadow-lg border overflow-hidden max-w-md w-full p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Verify OTP</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={otp}
            onChange={handleInputChange}
            className="text-gray-700 border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-700"
            required
          />
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 py-2 px-4 text-white font-bold rounded transition duration-300"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
