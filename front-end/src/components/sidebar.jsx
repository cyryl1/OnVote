// import Logo from '../assets/onvote-high-resolution-logo 2.svg';
import Logo from '../components/logo';
// import { useContext } from 'react';
// import { TokenContext } from '../context/AuthContext';
import { FaHome } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdBallot } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { MdPreview } from "react-icons/md";
import { FaDiceD20 } from "react-icons/fa";
import { HiRocketLaunch } from "react-icons/hi2";
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';


export default function Sidebar({ id }) {
    const start_date = localStorage.getItem(`election_${id}_startDate`);
    const end_date = localStorage.getItem(`election_${id}_endDate`);

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);

        const datePart = date.toISOString().slice(0, 10);

        const timePart = date.toLocaleTimeString('en-US', {
            hour12: true,
            hour: "numeric",
            minute: "2-digit",
        });

        return `${datePart} ${timePart}`;
    }

    const start = formatDateTime(start_date);
    const end = formatDateTime(end_date);
    // const { electionDetails} = useContext(TokenContext);
    return (
        <div  className='bg-[#1c2a39] h-full'>
            <Link to='/dashboard'>
                <div className='bg-[#0bacfa] w-full h-[3.6rem]'>
                     <Logo
                        imgWidth='3.5rem'
                        textSize='2rem'
                        color='white'
                    />
                </div>
            </Link>
            <div className='mt-[0.5rem]'>
                <div className='text-[#fff] font-semibold flex flex-col'>
                    <Link to={`/election/${id}/overview`}>
                        <div className='flex items-center gap-4 w-[100%] px-5 p-3 hover:bg-[#141d28]'>
                            <FaHome />
                            Overview
                        </div>
                    </Link>
                    <Link to={`/election/${id}/settings`}>
                        <div className='flex items-center gap-4 w-[100%] px-5 p-3 hover:bg-[#141d28]'>
                            <IoMdSettings />
                            Settings
                        </div>
                    </Link>
                    <Link to={`/election/${id}/ballots`}>
                        <div className='flex items-center gap-4 w-[100%] px-5 p-3 hover:bg-[#141d28]'>
                            <MdBallot />
                            Ballots
                        </div>
                    </Link>
                    <Link to={`/election/${id}/voters`}>
                        <div className='flex items-center gap-4  w-[100%] px-5 p-3 hover:bg-[#141d28]'>
                            <FaUsers />
                            Voters
                        </div>
                    </Link>
                    <Link to={`/election/${id}/preview`}>
                        <div className='flex items-center gap-4  w-[100%] px-5 p-3 hover:bg-[#141d28]'>
                            <MdPreview />
                            Preview
                        </div>
                    </Link>
                    <Link to={`/election/${id}/result`}>
                        <div className='flex items-center gap-4 active:bg-[#141d28] w-[100%] px-5 p-3 hover:bg-[#141d28]'>
                            <FaDiceD20 />
                            Results
                        </div>
                    </Link>
                    <div className='flex items-center gap-4 active:bg-[#141d28] w-[100%] px-5 p-3 hover:bg-[#141d28]'>
                        <HiRocketLaunch />
                        Launch
                    </div>
                </div>
                <hr className='mt-[1rem] mb-[1rem]' />
                <div className='mt-[2rem] px-4 '>
                    <div className=''>
                        <p className='text-[0.7rem] font-bold text-[#868e96]'>START DATE</p>
                        <p className='text-[#fff] decoration-dashed'>{start || "election start_date"}</p>
                    </div>
                    <div className='mt-[1rem]'>
                        <p className='text-[0.7rem] font-bold text-[#868e96]'>END DATE</p>
                        <p  className='text-[#fff] decoration-dashed'>{end || "election end_date"}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

Sidebar.propTypes = {
    id: PropTypes.number.isRequired,
}
