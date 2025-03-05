// import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/navbar';
import { FaUser } from "react-icons/fa";
import { FaKey } from "react-icons/fa";
import axios from 'axios';

export default function ProfileSettings() {
    const navigate = useNavigate();
    const [profileSettings, setProfileSettings] = useState({
        name: '',
        email: ''
    });

    const [password, setPassword] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });

    const [passwordError, setPasswordError] = useState('');

    const checkPassword = (new_password, confirm_password) => {
        if (new_password !== confirm_password) {
            return false;
        } else {
            return true;
        }
    }

    const handleProfileSettingsChange = (e) => {
        setProfileSettings({...profileSettings, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPassword({...password, [e.target.name]: e.target.value });
    };

    const handleProfileSettings = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.put('http://127.0.0.1:5000/onvote/auth/update_general_profile', JSON.stringify(profileSettings), {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 201 && response.data.message) {
                alert(response.data.message);
                if (response.data.new_token) {
                    localStorage.setItem("accessToken", response.data.new_token);

                }
                fetchProfile();
            }
        } catch (err) {
            console.error(err);
        }
    }

    const handleUpdatePassword = async () => {
        try{
            const accessToken = localStorage.getItem('accessToken');
            const ifPasswordCorrelate = checkPassword(password.new_password, password.confirm_password)
            if (ifPasswordCorrelate) {
                const response = await axios.put('http://127.0.0.1:5000/onvote/auth/update_password', {
                    current_password: password.current_password,
                    new_password: password.new_password
                }, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 201 && response.data.message) {
                    alert(response.data.message);
                    navigate(0);
                }
            } else {
                setPasswordError("Password doesn't match");
            }
        } catch (err) {
            if (err.response && err.response.status === 403) {
                alert(err.response.data.message);
            } else if (err.response.status === 401 && err.response.data.status === "token_expired") {
                navigate('/token_refresh');
            } else {
                console.error(`Failed to load: ${err.message || err}`);
            }

        }
    }

    const fetchProfile = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            console.log(accessToken);
            const response = await axios.get('http://127.0.0.1:5000/onvote/auth/profile', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });

            if (response.status === 200 && response.data.message) {
                setProfileSettings({
                    name: response.data.profile.name,
                    email: response.data.profile.email
                })
            }
        } catch (err) {
            if (err.response.status === 401) {
                navigate('/token_refresh');
            } else {
                console.error(`Failed to load: ${err.message || err}`);
            }
        };
    };

    useEffect(() => {
        fetchProfile();
    }, [])
  return (
    <>
        <NavBar />
        <div className=''>
            <div className='text-[1.8em] border border-t-0 border-l-0 border-r-0 bg-[#fff] font-bold px-[1rem] py-[1.5rem]'>
                <h1>Account Settings</h1>
            </div>
            <div className='mt-[2rem] mb-[2rem]'>
                <div className="profile-settings bg-white w-[90%] m-auto border rounded">
                    <div className='flex items-center gap-2 px-[1rem] py-[1rem] font-bold border border-l-0 border-r-0 border-t-0'>
                        <FaUser />
                        Profile Settings
                    </div>
                    <form action="">
                        <div className="form-group flex flex-col gap-1 px-[1rem] py-[1rem]">
                            <label htmlFor="name" className='font-bold'>Name</label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                className="form-control bg-[#f6f8fa] rounded border border-[#ced4da] px-[.5rem] py-[.5rem]" 
                                placeholder="Enter your name"
                                value={profileSettings.name}
                                onChange={handleProfileSettingsChange}
                            />
                        </div>
                        <div className="form-group flex flex-col gap-1 px-[1rem] py-[1rem]">
                            <label htmlFor="email" className='font-bold'>Email Address</label>
                            <input 
                                type="text" 
                                id="email" 
                                name="email" 
                                className="form-control bg-[#f6f8fa] rounded border border-[#ced4da] px-[.5rem] py-[.5rem]" 
                                placeholder="Enter your email" 
                                value={profileSettings.email}
                                onChange={handleProfileSettingsChange}
                            />
                        </div>
                    </form>
                    <div className='px-[1rem] py-[1rem]'>
                        <button 
                            type='submit' 
                            className='text-[#fff] bg-[#2ecd10] px-[1rem] py-[.5rem] rounded'
                            onClick={handleProfileSettings}
                        >
                            Save Settings
                        </button>
                    </div>
                </div>
                <div className='bg-white w-[90%] m-auto mt-[2rem] border rounded'>
                    <div className='flex items-center gap-2 px-[1rem] py-[1rem] font-bold border border-l-0 border-r-0 border-t-0'>
                        <FaKey />
                        Change Password
                    </div>
                    <form action="">
                        <div className="form-group flex flex-col gap-1 px-[1rem] py-[1rem]">
                            <label htmlFor="current_password ">Current Password</label>
                            <input 
                                type="text" 
                                id='current_password' 
                                name='current_password'  
                                className="form-control bg-[#f6f8fa] rounded border border-[#ced4da] px-[.5rem] py-[.5rem]" 
                                placeholder="Enter current password" 
                                value={password.current_password}
                                onChange={handlePasswordChange}
                            />
                        </div>
                        <div className="form-group  flex flex-col gap-1 px-[1rem] py-[1rem]">
                            <label htmlFor="new_password">New Password</label>
                            <input 
                                type="text" 
                                id='new_password' 
                                name='new_password' 
                                className="form-control bg-[#f6f8fa] rounded border border-[#ced4da] px-[.5rem] py-[.5rem]" 
                                placeholder="Enter new password"
                                value={password.new_password}
                                onChange={handlePasswordChange}
                            />
                        </div>
                        <div className="form-group  flex flex-col gap-1 px-[1rem] py-[1rem]">
                            <label htmlFor="confirm_password">Confirm Password</label>
                            {passwordError && (<p className="text-red-600 text-[.8rem]">{passwordError}</p>)}
                            <input 
                                type="text" 
                                id='confirm_password' 
                                name='confirm_password' 
                                className="form-control bg-[#f6f8fa] rounded border border-[#ced4da] px-[.5rem] py-[.5rem]" 
                                placeholder="Enter new password" 
                                value={password.confirm_password}
                                onChange={handlePasswordChange}
                            />
                        </div>
                    </form>
                    <div className='px-[1rem] py-[1rem]'>
                        <button 
                            type='submit' 
                            className='text-[#fff] bg-[#2ecd10] px-[1rem] py-[.5rem] rounded'
                            onClick={handleUpdatePassword}
                        >
                            Save Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
    </>
    
  )
}
