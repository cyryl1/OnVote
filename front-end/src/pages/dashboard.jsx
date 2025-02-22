// import { useState } from 'react';
import Navbar from '../components/navbar.jsx';
import { useState, useEffect } from 'react';
import { IoIosAddCircle } from "react-icons/io";
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import LoadingModal from '../components/loadingModal';
import axios from 'axios';
import { MdDateRange } from "react-icons/md";

export default function Dashboard() {
  const navigate = useNavigate();
  // const [elec, setElec] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pageState, setPageState] = useState(false);

  const handleElectionClick = (electionId) => {
    navigate(`/election/${electionId}/overview`);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get('http://127.0.0.1:5000/onvote/get_all_elections', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (response.status === 200 && response.data.message && response.data.message.length > 0) {
          setData(response.data.message);
          setPageState(true);
        } else {
          setPageState(false);
        }
        
      } catch (err) {
        setError(`Failed to load data: ${err.message || err}`);
        setPageState(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [])
  console.log(data);

  if (error) return <p>{error}</p>
  // if (!data) return (() => setIsLoading(true))

  return (
    <>
      <Navbar />
      {!pageState && (
        <div className='flex flex-col justify-center items-center h-screen text-center'>
          <h1 className='text-[2.5rem] font-semibold mb-[0.5rem]'>Welcome to OnVote!</h1>
          <h3 className='text-[1.2rem] mb-[1rem]'>Get started by creating your first election.</h3>
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
      )}

      {pageState && (
        <div>
          <div className='flex items-center justify-between lg:px-[4rem] px-[2rem] py-[1.5rem] border border-r-0 border-l-0 border-t-0 bg-[#fff]'>
            <p className='lg:text-[1.8em] text-[1.4rem] font-bold'>Dashboard</p>
            <Link to='/election/create'>
              <button className='flex items-center gap-2 px-[.6rem] py-[.5rem] text-[.8rem] bg-[#2ecd10] border-[#2ecd10] rounded-sm text-[#fff]'>
                <span><IoIosAddCircle className='w-[1.5rem] h-[1.5rem]'/></span>
                <span className='text-semibold'>New Election</span>
              </button>
            </Link>
            
          </div>
          
          <div>
            {data && data.map((item, index) => (
              // <p key={index}>{item.title}</p>
              <div 
                key={index} 
                className='flex flex-col lg:flex-row bg-white border p-[1rem] w-[90%] m-auto mt-[1rem] border-[#ced4da]-50 rounded shadow-md cursor-pointer'
                onClick={() => handleElectionClick(item.id)}
              >
                <Link to={`election/${item.id}/overview`}>
                  <p className='font-bold'>{item.title}</p>
                  <div className='flex justify-between mt-[.6rem] text-[.8rem]'>
                    <div className='text-[#868e96]'>
                      <p className='flex items-center gap-1'>
                        <MdDateRange />
                        START DATE
                      </p>
                      <p>{item.start_date}</p>
                    </div>
                    <div className='text-[#868e96]'>
                      <p className='flex items-center gap-1'>
                        <MdDateRange />
                        END DATE
                      </p>
                      <p>{item.end_date}</p>
                    </div>
                  </div>
                </Link>
              </div> // Render fetched data
            ))}
          </div>
        </div>
      )}
       <LoadingModal 
          isOpen={isLoading}
          onRequestClose={() => setIsLoading(!isLoading)}
      />
    </>
  )
}
