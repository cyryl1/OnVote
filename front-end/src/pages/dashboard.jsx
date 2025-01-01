// import { useState } from 'react';
import Navbar from '../components/navbar.jsx';
import { IoIosAddCircle } from "react-icons/io";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  // const [elec, setElec] = useState(false);

  return (
    <>
      <Navbar />
      <div className='flex flex-col justify-center items-center h-screen'>
        <h1 className='text-[2.5rem] mb-[0.5rem]'>Welcome to OnVote!</h1>
        <h3 className='text-[1.25rem] mb-[1rem]'>Get started by creating your first election.</h3>
        <div>
          <Link to='/election/create'>
            <motion.button 
            className='flex gap-3 text-[#fffc] px-[2rem] py-[.6rem] bg-[#2ecd10] border-[#2ecd10] rounded-sm'
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            >
              <span><IoIosAddCircle className='w-[1.5rem] h-[1.5rem]'/></span>
              <span className='text-semibold text-[1.2rem]'>New Election</span>
            </motion.button>
          </Link>
        </div>
      </div>

    </>
  )
}
