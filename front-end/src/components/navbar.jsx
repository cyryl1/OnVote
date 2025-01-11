import { useContext, useState } from 'react';
import Logo from '../assets/onvote-high-resolution-logo 2.svg';
import { Link } from 'react-router-dom';
import { IoMdMail } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { TokenContext } from '../context/AuthContext';

export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const { name } = useContext(TokenContext);

  return (
    <nav className='flex items-center justify-between flex-row-reverse flex-wrap px-[2rem] lg:flex-row lg:px-[8.5rem] lg:py-[1rem] bg-[#0bacfa]'>
        <div className='flex items-center flex-shrink-0 text-white mr-auto lg:mr-22 lg:h-[3rem]'>
            <img src={Logo} alt="OnVote" className="w-[10rem] " />
        </div>
        <div className='block lg:hidden'>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='flex items-center px-3 py-2 rounded text-[#F5F5F5] hover:text-black-400 border '
            >
                <svg
                    className={`fill-current h-3 w-3 ${isOpen ? "hidden" : "block"}`}
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                    </svg>
                <svg
                    className={`fill-current h-3 w-3 ${isOpen ? "block" : "hidden"}`}
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
                </svg>
            </button>
        </div>
        <div className={`w-full block lg:flex flex-grow lg:flex-row lg:items-center lg:mb-3 lg:w-auto ${isOpen ? "block" : "hidden"} text-[#fffc]`}>
            <div className='flex flex-col lg:flex-row gap-3 text-sm mt-4 lg:flex-grow '>
                <Link to='/dashboard' className='text-[1rem] font-semibold'>Dashboard</Link>
                <Link to='/profile_settings' className='font-semibold text-[1rem]'>Settings</Link>
            </div>
            <div className='flex flex-col gap-6 lg:flex-row font-semibold mt-[1rem]'>
                <div>
                    <IoMdMail />
                </div>
                <div className='flex gap-4 font-semibold items-center'>
                    <FaUser />
                    <p className=''>{name || "Guest"}!</p>
                </div>
            </div>
        </div>
    </nav>
  )
}
