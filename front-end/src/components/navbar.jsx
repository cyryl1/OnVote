import { useState } from 'react';
import Logo from '../components/logo';
import { Link } from 'react-router-dom';
import { IoMdMail } from "react-icons/io";
import { FaUser } from "react-icons/fa";
// import { TokenContext } from '../context/AuthContext';

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
//   const { name } = useContext(TokenContext);
  const admin_name = localStorage.getItem('admin_name');

  return (
    <nav className='flex items-center justify-end gap-6 lg:justify-between flex-row-reverse flex-wrap px-[2rem] lg:flex-row lg:px-[3.5rem] lg:py-[1rem] bg-[#0bacfa]'>
        <div className="flex justify-center mt-auto">
            <Logo
                imgWidth='4rem'
                textSize='2rem'
                color='white'
            />
        </div>
        <div className='block lg:hidden'>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='flex items-center px-3 py-2 rounded text-[#F5F5F5] hover:text-black-400 border'
            >
                <svg
                    className={`fill-current h-4 w-4 ${isOpen ? "hidden" : "block"}`}
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                </svg>
                <svg
                    className={`fill-current h-4 w-4 ${isOpen ? "block" : "hidden"}`}
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
                </svg>
            </button>
        </div>
        <div className={`w-full lg:ml-[10rem] block lg:flex flex-grow lg:flex-row lg:items-center lg:mb-3 lg:w-auto ${isOpen ? "block" : "hidden"} text-[#fffc] transition ease-in-out .3s`}>
            <div className='flex flex-col lg:flex-row gap-3 text-sm mt-4 lg:flex-grow '>
                <Link to='/dashboard' className='text-[1rem] font-bold'>Dashboard</Link>
                <Link to='/profile_settings' className='font-bold text-[1rem]'>Settings</Link>
            </div>
            <div className='flex flex-col lg:items-center gap-6 lg:flex-row font-semibold mt-[1rem]'>
                <div className='font-bold text-[1rem]'>
                    <IoMdMail />
                </div>
                <div className='flex gap-1 font-bold text-[1rem] items-center'>
                    <FaUser />
                    <p className=''>{admin_name || "Guest"}!</p>
                </div>
            </div>
        </div>
    </nav>
  )
}
