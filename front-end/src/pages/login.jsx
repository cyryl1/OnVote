// import React from 'react'
// import Logo from '../assets/onvote-high-resolution-logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { TokenContext } from '../context/AuthContext';
import LoadingModal from '../components/loadingModal';
import Logo from '../components/logo';

export default function Login() {
    // const [accessToken, setAccessToken] = useState('');
    // const [resetToken, setResetToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const { saveTokens } = useContext(TokenContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleLogin = async (form) => {
        try {
            const formEncoded = new URLSearchParams();
            for (const key in form) {
                formEncoded.append(key, form[key]);
            }

            const response = await fetch('http://127.0.0.1:5000/onvote/login', {
                method: 'POST',
                body: formEncoded
            })

            const result = await response.json();
            if (response.status === 200) {
                setMessage(result.message)
                // alert(result.message);
                saveTokens({
                    accessToken: result.tokens.access,
                    resetToken: result.tokens.reset
                });
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1000);
            }

            if (response.status === 400) {
                setMessage(result.message);
                alert(result.message);
            }

            if (response.status === 404) {
                alert(result.message);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateForm(formData);
        setErrors(newErrors);
        console.log(formData);

        if (Object.keys(newErrors).length === 0) {
            console.log("Form submitted successfully");
            setIsLoading(true);
            handleLogin(formData);
            console.log(formData);
        } else {
            console.log("Form submission failed");
        }
    };

    const validateForm = (data) => {
        const errors = {};

        if (!data.email) {
            errors.email = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/i.test(data.email)) {
            errors.email = 'Invalid email address;'
        }

        if (!data.password) {
            errors.password = 'Password is required';
        }

        return errors;
    }


    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200'>
            {/* <div className="text-[3rem] flex justify-center ">
                <img src={Logo} alt="OnVote" className="h-[10rem] lg:h-[15rem]" />
            </div> */}
            <div className="flex justify-center mt-auto">
                <Logo
                    imgWidth='4rem'
                    textSize='2rem'
                    color='black'
                />
            </div>
            <div className="card-body border-[#ced4da]-50 border-[1px] w-[90%] md:w-[40%] lg:w-[30%] m-auto rounded bg-white shadow-md">
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-3 lg:gap-[1rem]">
                    <div className="form-group flex flex-col gap-1">
                        {errors.email && (
                            <p className='text-red-500 text-[0.6rem]'>{errors.email}</p>
                        )}
                        <label htmlFor="email" className="font-semibold lg:font-bold text-gray-700">Email Address</label>
                        <input type="text" value={formData.email} onChange={handleChange} name="email" className="border border-[#ced4da] h-10 rounded bg-[#f6f8fa] px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="form-group flex flex-col gap-1">
                        {errors.password && (
                            <p className='text-red-500 text-[0.6rem]'>{errors.password}</p>
                        )}
                        <label htmlFor="password" className="font-semibold lg:font-bold text-gray-700 flex justify-between"><span>Password</span><span className="text-[0.5rem] lg:text-[0.7rem] hover:text-gray-700 cursor-pointer text-[#6c757d]">I CAN&apos;T REMEMBER</span></label>
                        <input type="password" value={formData.password} onChange={handleChange} name="password" className="border border-[#ced4da] h-10 rounded px-3 bg-[#f6f8fa] focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <button type="submit" className="bg-blue-600 border border-blue-600 text-[#fff] font-aemibold rounded h-10 hover:bg-blue-700 transition">Login</button>
                </form>
            </div>
            <div className="m-auto text-center">
                <Link to='/register' className="text-lg text-blue-600 cursor-pointer hover:underline">No account? Create one for free!</Link>
            </div>

            <LoadingModal 
                isOpen={isLoading}
                onRequestClose={() => setIsLoading(!isLoading)}
                onMessage={message}
            />
        </div>
    )
}
