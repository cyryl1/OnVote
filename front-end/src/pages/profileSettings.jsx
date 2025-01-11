// import React from 'react'
import NavBar from '../components/navbar';
import { FaUser } from "react-icons/fa";
import { FaKey } from "react-icons/fa";

export default function ProfileSettings() {
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
                            <input type="text" id="name" name="name" className="form-control bg-[#f6f8fa] rounded border border-[#ced4da] px-[.5rem] py-[.5rem]" placeholder="Enter your name" />
                        </div>
                        <div className="form-group flex flex-col gap-1 px-[1rem] py-[1rem]">
                            <label htmlFor="email" className='font-bold'>Email Address</label>
                            <input type="text" id="email" name="email" className="form-control bg-[#f6f8fa] rounded border border-[#ced4da] px-[.5rem] py-[.5rem]" placeholder="Enter your email" />
                        </div>
                    </form>
                    <div className='px-[1rem] py-[1rem]'>
                        <button type='submit' className='text-[#fff] bg-[#2ecd10] px-[1rem] py-[.5rem] rounded'>Save Settings</button>
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
                            <input type="text" id='current_password' name='current_password'  className="form-control bg-[#f6f8fa] rounded border border-[#ced4da] px-[.5rem] py-[.5rem]" placeholder="Enter current password" />
                        </div>
                        <div className="form-group  flex flex-col gap-1 px-[1rem] py-[1rem]">
                            <label htmlFor="new_password">New Password</label>
                            <input type="text" id='new_password' name='new_password'  className="form-control bg-[#f6f8fa] rounded border border-[#ced4da] px-[.5rem] py-[.5rem]" placeholder="Enter new password" />
                        </div>
                    </form>
                    <div className='px-[1rem] py-[1rem]'>
                        <button type='submit' className='text-[#fff] bg-[#2ecd10] px-[1rem] py-[.5rem] rounded'>Save Settings</button>
                    </div>
                </div>
            </div>
        </div>
        
    </>
    
  )
}
