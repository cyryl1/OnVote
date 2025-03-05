// import React from 'react'
// import Logo from '../assets/onvote-high-resolution-logo.svg';
import { useNavigate } from 'react-router-dom';
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

    // const [error, setError] = useState('');


    const handleChange = (e) => {
        setpassword(e.target.value);
    };

    const handleLogin = async () => {
        try {
            setIsLoading(true);
            const refreshToken = localStorage.getItem('refreshToken');

            const response = await axios.post('http://127.0.0.1:5000/onvote/refresh', {
                password: password,
            }, { 
                headers: { 'Authorization': `Bearer ${refreshToken}` 
            }});
            if (response.status === 201 && response.data.message) {
                setMessage(response.data.message)
                localStorage.setItem('accessToken', response.data.token)
                // alert(result.message);
                setTimeout(() => {
                    navigate(-1);
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
    
    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     const newError = validateForm(password);
    //     setError(newError);

    //     if (newError.length === 0) {
    //         console.log("Form submitted successfully");
    //         setIsLoading(true);
    //         handleLogin(password);
    //         console.log(password);
    //     } else {
    //         console.log("Form submission failed");
    //     }
    // };

    // const validateForm = (data) => {

    //     if (!data.password) {
    //         const error = 'Password is required';

    //         return error;
    //     }

        
    // }


    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200'>
            <div className="flex justify-center mt-auto">
                <Logo
                    imgWidth='4rem'
                    textSize='2rem'
                    color='black'
                />
            </div>
            <div className='mt-[2rem] font-bold text-[1.5rem] px-[1rem] text-center text-red-500'>Token has expired enter password to continue</div>
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
                        className="bg-blue-600 border border-blue-600 text-[#fff] font-aemibold rounded h-10 hover:bg-blue-700 transition"
                        onClick={handleLogin}
                    >
                        Continue
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
