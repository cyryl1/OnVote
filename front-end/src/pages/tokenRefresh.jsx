// import React from 'react'
// import Logo from '../assets/onvote-high-resolution-logo.svg';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import LoadingModal from '../components/loadingModal';
import Logo from '../components/logo';
import axios from 'axios';

export default function TokenRefresh() {
    // const [accessToken, setAccessToken] = useState('');
    // const [resetToken, setResetToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [password, setpassword] = useState('');
    const location = useLocation();

    // const [error, setError] = useState('');


    const handleChange = (e) => {
        setpassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            console.log(refreshToken);

            const response = await axios.post('http://127.0.0.1:5000/onvote/refresh', 
                { password }, 
                { headers: { 'Authorization': `Bearer ${refreshToken}` }}
            );
            if (response.status === 200 && response.data.message) {
                setMessage(response.data.message)
                alert(response.data.message);
                localStorage.setItem('accessToken', response.data.token)
                // alert(result.message);
                const redirectPath = location.state?.from?.pathname || '/dashboard';
                // const redirectPath = '/dashboard';
                setTimeout(() => {
                    navigate(redirectPath, { replace: true });
                }, 1000);
            
            }
        }  catch (error) {
            const errorMessage = error.response?.data?.message || "An unexpected error occurred";
            setMessage(errorMessage);
            alert(errorMessage);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }
    


    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200'>
            <div className="flex justify-center mt-auto">
                <Logo
                    imgWidth='4rem'
                    textSize='2rem'
                    color='black'
                />
            </div>
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-red-500">Session Expired</h2>
                <p className="text-lg">Please re-enter your password to refresh your session.</p>
            </div>
            <div className="card-body border-[#ced4da]-50 border-[1px] w-[90%] md:w-[40%] lg:w-[30%] m-auto rounded bg-white shadow-md">
                <form className="p-6 flex flex-col gap-3 lg:gap-[1rem]">
                    <div className="form-group flex flex-col gap-1">
                        {/* {error.password && (
                            <p className='text-red-500 text-[0.6rem]'>{error.password}</p>
                        )} */}
                        <label htmlFor="password" className="font-semibold lg:font-bold text-gray-700 flex justify-between">Password</label>
                        <input type="password" value={password} onChange={handleChange} name="password" className="border border-[#ced4da] h-10 rounded px-3 bg-[#f6f8fa] focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="bg-blue-600 border border-blue-600 text-[#fff] font-aemibold rounded h-10 hover:bg-blue-700 transition"
                        onClick={handleSubmit}
                    >
                        {isLoading ? 'Refreshing...' : 'Refresh Session'}
                    </button>
                </form>
            </div>

            <LoadingModal 
                isOpen={isLoading}
                onRequestClose={() => setIsLoading(!isLoading)}
                onMessage={message}
            />
        </div>
    )
}
