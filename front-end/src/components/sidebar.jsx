import Logo from '../assets/onvote-high-resolution-logo 2.svg';
import { useContext } from 'react';
import { TokenContext } from '../context/AuthContext';
import { FaHome } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdBallot } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { MdPreview } from "react-icons/md";
import { FaDiceD20 } from "react-icons/fa";
import { HiRocketLaunch } from "react-icons/hi2";
import { Link } from 'react-router-dom';


export default function Sidebar() {
    const { electionDetails} = useContext(TokenContext);
    return (
        <div  className='bg-[#1c2a39] h-full'>
            <div className='bg-[#0bacfa] w-full px-[1rem] h-[3.6rem]'>
                <img src={Logo} alt="logo" className='object-fit w-[100%] h-[100%]' />
            </div>
            <div className='mt-[0.5rem]'>
                <div className='text-[#fff] font-semibold flex flex-col'>
                    <Link to="/overview">
                        <div className='flex items-center gap-4 active:bg-[#141d28] w-[100%] px-5 p-3'>
                            <FaHome />
                            Overview
                        </div>
                    </Link>
                    <Link to="/settings">
                        <div className='flex items-center gap-4 active:bg-[#141d28] w-[100%] px-5 p-3'>
                            <IoMdSettings />
                            Settings
                        </div>
                    </Link>
                    <Link to="/ballots">
                        <div className='flex items-center gap-4 active:bg-[#141d28] w-[100%] px-5 p-3'>
                            <MdBallot />
                            Ballots
                        </div>
                    </Link>
                    <Link to="/voters">
                        <div className='flex items-center gap-4 active:bg-[#141d28] w-[100%] px-5 p-3'>
                            <FaUsers />
                            Voters
                        </div>
                    </Link>
                    <div className='flex items-center gap-4 focus:bg-[#141d28] active:bg-[#141d28] w-[100%] px-5 p-3'>
                        <MdPreview />
                        Preview
                    </div>
                    <div className='flex items-center gap-4 active:bg-[#141d28] w-[100%] px-5 p-3'>
                        <FaDiceD20 />
                        Add-ons
                    </div>
                    <div className='flex items-center gap-4 active:bg-[#141d28] w-[100%] px-5 p-3'>
                        <HiRocketLaunch />
                        Launch
                    </div>
                </div>
                <hr className='mt-[1rem] mb-[1rem]' />
                <div className='mt-[2rem] px-4 '>
                    <div className=''>
                        <p className='text-[0.7rem] font-bold text-[#868e96]'>START DATE</p>
                        <p className='text-[#fff] decoration-dashed'>{electionDetails.start_date || "election start_date"}</p>
                    </div>
                    <div className='mt-[1rem]'>
                        <p className='text-[0.7rem] font-bold text-[#868e96]'>END DATE</p>
                        <p  className='text-[#fff] decoration-dashed'>{electionDetails.end_date || "election end_date"}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
