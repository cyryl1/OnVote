// import React from 'react'
import Logo from '../assets/onvote-high-resolution-logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { TokenContext } from '../context/AuthContext';

export default function Login() {
    // const [accessToken, setAccessToken] = useState('');
    // const [resetToken, setResetToken] = useState('');
    const { setTokens } = useContext(TokenContext);
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
                alert(result.message);
                setTokens({
                    accessToken: result.tokens.access,
                    resetToken: result.tokens.reset
                });
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1000);
            }

            if (response.status === 404) {
                alert(result.message);
            }
        } catch (error) {
            console.error(error);
        }
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateForm(formData);
        setErrors(newErrors);
        console.log(formData);

        if (Object.keys(newErrors).length === 0) {
            console.log("Form submitted successfully");
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
        <>
            <div className="row text-[3rem] flex justify-center ">
                <img src={Logo} alt="OnVote" className="h-[10rem] lg:h-[15rem]" />
            </div>
            <div className="card-body border-[#ced4da]-50 border-[1px] w-[90%] md:w-[40%] lg:w-[30%] m-auto rounded bg-[#fff]">
                <form onSubmit={handleSubmit} className="p-[5%] flex flex-col gap-[0.5rem] lg:gap-[1rem]">
                    <div className="form-group flex flex-col gap-[0.5rem]">
                        {errors.email && (
                            <p className='text-red-500 text-[0.6rem]'>{errors.email}</p>
                        )}
                        <label htmlFor="email" className="font-semibold lg:font-bold">Email Address</label>
                        <input type="text" value={formData.email} onChange={handleChange} name="email" className="border-[#ced4da] border-[1px] h-9 rounded bg-[#f6f8fa] p-[0.5rem]" />
                    </div>
                    <div className="form-group flex flex-col gap-[0.5rem]">
                        {errors.password && (
                            <p className='text-red-500 text-[0.6rem]'>{errors.password}</p>
                        )}
                        <label htmlFor="password" className="font-semibold lg:font-bold"><span>Password</span><span className="text-[0.6rem] lg:text-[0.7rem] float-right text-[#2b8357]">I CAN&apos;T REMEMBER</span></label>
                        <input type="password" value={formData.password} onChange={handleChange} name="password" className="border-[#ced4da] border-[1px] h-9 rounded bg-[#f6f8fa] p-[0.5rem]" />
                    </div>
                    <button type="submit" className="bg-[#2ecd10] border-[#2ecd10] border-[1px] text-[#fff] rounded h-9">Login</button>
                </form>
            </div>
            <div className="m-auto text-center">
                <Link to='/register' className="text-[1.4rem] text-[#2b8357] cursor-pointer">No account? Create one for free!</Link>
            </div>
        </>
    )
}
