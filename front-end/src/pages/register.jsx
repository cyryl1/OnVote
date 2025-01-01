// import React from 'react'
import Logo from '../assets/onvote-high-resolution-logo.svg';
// import { Link} from 'react-router-dom';
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
        <>
            <div className="row text-[3rem] flex justify-center ">
                <img src={Logo} alt="OnVote" className="h-[10rem] lg:h-[15rem]" />
            </div>
            <div className="card-body p-[5%] lg:p-[2%] border-[#ced4da]-50 border-[1px] w-[90%] md:w-[50%] lg:w-[30%] m-auto rounded bg-[#fff]">
                <h3 className='text-center text-[2rem] font-semibold'>Sign Up Here!</h3>
                <form onSubmit={handleSubmit} className='p-[5%] lg:p-[0.5%] flex flex-col gap-[1rem]'>
                    <div className="form-group flex flex-col gap-[0.5rem]">
                        {errors.name && (
                            <p className='text-red-500 text-[0.6rem]'>{errors.name}</p>
                        )}
                        <label htmlFor="name">Name</label>
                        <input type="text" name='name' value={formData.username} onChange={handleChange} className="border-[#ced4da] border-[1px] h-9 rounded bg-[#f6f8fa] p-[0.5rem]" placeholder='Your First & Last Name'/>
                    </div>
                    <div className="form-group flex flex-col gap-[0.5rem]">
                        {errors.email && (
                            <p className='text-red-500 text-[0.6rem]'>{errors.email}</p>
                        )}
                        <label htmlFor="email">Email Address</label>
                        <input type="text" name='email' value={formData.email} onChange={handleChange} className="border-[#ced4da] border-[1px] h-9 rounded bg-[#f6f8fa] p-[0.5rem]" placeholder='Your email address'/>
                    </div>
                    <div className="form-group flex flex-col gap-[0.5rem]">
                        {errors.password && (
                            <p className='text-red-500 text-[0.6rem]'>{errors.password}</p>
                        )}
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} className="border-[#ced4da] border-[1px] h-9 rounded bg-[#f6f8fa] p-[0.5rem]" placeholder='Password'/>
                    </div>
                    <div className="form-group flex flex-col gap-[0.5rem]">
                        {errors.confirmPassword && (
                            <p className='text-red-500 text-[0.6rem]'>{errors.confirmPassword}</p>
                        )}
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="border-[#ced4da] border-[1px] h-9 rounded bg-[#f6f8fa] p-[0.5rem]" placeholder='Confirm Password'/>
                    </div>
                    <button type='submit' className="bg-[#2ecd10] border-[#2ecd10] border-[1px] text-[#fff] rounded h-9">Continue <span>&gt;&gt;&gt;</span></button>
                </form>
            </div>
            <div className="m-auto text-center">
                <Link to='/login' className="text-[1.4rem] text-[#2b8357] cursor-pointer">Already have an account? Login here</Link>
            </div>
        </>
    )
}
