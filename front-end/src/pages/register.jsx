// import React from 'react'
// import Logo from '../assets/onvote-high-resolution-logo.svg';
// import { Link} from 'react-router-dom';
import Logo from '../components/logo'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { TokenContext } from '../context/AuthContext';


export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    
    const [errors, setErrors] = useState({});
    const { setName } = useContext(TokenContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value });
    };

    const handleSignup = async(form) => {
        try {
            const formEncoded = new URLSearchParams();
            for (const key in form) {
                formEncoded.append(key, form[key]);;
            }

            const response = await fetch('http://127.0.0.1:5000/onvote/register', {
                method: "POST",
                body: formEncoded,
            });

            // if (!response.ok) {
            //     throw new Error('SignUp failed');
            // }
            const result = await response.json();
            if (response.status === 201) {
                alert(result.message)
                setName(form.name);
                // setRedirect(true)
                setTimeout(() => {
                    navigate("/login");
                }, 1000);
                
                // window.location.href='/login';
            }
            if (response.status === 403) {
                alert(result.message)
            }
            console.log(result)
        } catch (error) {
            console.error(error)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateForm(formData);
        setErrors(newErrors);
        console.log(formData)

        if (Object.keys(newErrors).length === 0) {
            console.log('Form submitted successfully!');
            handleSignup(formData);
        } else {
            console.log('Form submission failed');
        }
    };

    

    const validateForm = (data) => {
        const errors = {};

        if (!data.name.trim()) {
            errors.name = 'Name is required';
        }

        if (!data.email) {
            errors.email = 'Email address is required';
        } else if (!/^\S+@\S+\.\S+$/i.test(data.email)) {
            errors.email = 'Invalid email address';
        }

        if (!data.password) {
            errors.password = 'Password is required';
        } else if (data.password.length < 8) {
            errors.password = 'Password should be at least 8 characters long';
        }

        if (!data.confirmPassword) {
            errors.confirmPassword = 'Confirm Password is required';
        } else if (data.confirmPassword!== data.password) {
            errors.confirmPassword = 'Passwords do not match';
        }
        return errors;
    }

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200'>
            {/* <div className="row text-[3rem] flex justify-center ">
                <img src={Logo} alt="OnVote" className="h-[10rem] lg:h-[15rem]" />
            </div> */}
            <div className="flex justify-center m-6">
                <Logo
                    imgWidth='4rem'
                    textSize='2rem'
                    color='black'
                />
            </div>
            <div className="card-body border-[#ced4da]-50 border-[1px] w-[90%] md:w-[40%] lg:w-[30%] m-auto rounded bg-white shadow-md">
                <h3 className='text-center text-[2rem] font-semibold lg:font-bold text-gray-700 p-4'>Sign Up Here!</h3>
                <form onSubmit={handleSubmit} className='p-6 flex flex-col gap-3 lg:gap-[1rem]'>
                    <div className="form-group flex flex-col gap-1">
                        {errors.name && (
                            <p className='text-red-500 text-[0.6rem]'>{errors.name}</p>
                        )}
                        <label htmlFor="name" className='font-semibold lg:font-bold text-gray-700'>Name</label>
                        <input type="text" name='name' value={formData.username} onChange={handleChange} className="border border-[#ced4da] h-10 rounded bg-[#f6f8fa] px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder='Your First & Last Name'/>
                    </div>
                    <div className="form-group flex flex-col gap-1">
                        {errors.email && (
                            <p className='text-red-500 text-[0.6rem]'>{errors.email}</p>
                        )}
                        <label htmlFor="email" className='font-semibold lg:font-bold text-gray-700'>Email Address</label>
                        <input type="text" name='email' value={formData.email} onChange={handleChange} className="border border-[#ced4da] h-10 rounded bg-[#f6f8fa] px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder='Your email address'/>
                    </div>
                    <div className="form-group flex flex-col gap-1">
                        {errors.password && (
                            <p className='text-red-500 text-[0.6rem]'>{errors.password}</p>
                        )}
                        <label htmlFor="password" className='font-semibold lg:font-bold text-gray-700'>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} className="border border-[#ced4da] h-10 rounded bg-[#f6f8fa] px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder='Password'/>
                    </div>
                    <div className="form-group flex flex-col gap-1">
                        {errors.confirmPassword && (
                            <p className='text-red-500 text-[0.6rem]'>{errors.confirmPassword}</p>
                        )}
                        <label htmlFor="confirmPassword" className='font-semibold lg:font-bold text-gray-700'>Confirm Password</label>
                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="border border-[#ced4da] h-10 rounded bg-[#f6f8fa] px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder='Confirm Password'/>
                    </div>
                    <button type='submit' className="bg-blue-600 border border-blue-600 text-[#fff] font-aemibold rounded h-10 hover:bg-blue-700 transition">Continue <span>&gt;&gt;&gt;</span></button>
                </form>
            </div>
            <div className="m-auto text-center">
                <Link to='/login' className="text-lg text-blue-600 cursor-pointer hover:underline">Already have an account? Login here</Link>
            </div>
        </div>
    )
}
