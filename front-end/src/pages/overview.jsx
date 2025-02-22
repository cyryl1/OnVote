import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import Sidebar from "../components/sidebar";
import { GiHamburgerMenu } from "react-icons/gi";
// import { TokenContext } from "../context/AuthContext";
import { FaHome } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { BiWorld } from "react-icons/bi";
import { FaRegCopy } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { HiMiniQuestionMarkCircle } from "react-icons/hi2";
import { IoIosOptions } from "react-icons/io";
import LoadingModal from '../components/loadingModal';
import axios from 'axios';
// import io from 'socket.io-client';

export default function Overview() {
    const { id } = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [isActive, setIsActive] = useState(false);
    // const { electionDetails } = useContext(TokenContext);
    const [isLoading, setIsLoading] = useState(false);
    const [electionDetails, setElectionDetails] = useState({
        electionTitle: "",
        startDate: "",
        endDate: "",
    })

    const [error, setError] = useState('');
    // const socket = io("http://localhost:5000")

    const [electionUrl, setElectionURL] = useState(null);
    const [isUrlActive, setIsUrlActive]= useState(false);

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

    const fetchUrl = async (id) => {
        try {
            const response = await axios.post(`http://127.0.0.1:5000/onvote/election_url`, {
                id: id,
                start_date: electionDetails.startDate,
                end_date: electionDetails.endDate
            });
            
            if (response.status === 200 && response.data.message) {
                setElectionURL(response.data.message);
                setIsUrlActive(response.data.is_active);
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (err) {
            setError(`Failed to load: ${err.message || err}`);
        }
    }

    const fetchPageData = async (accessToken, id) => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/onvote/get_election/${id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (response.status === 200 && response.data.message) {
                setElectionDetails({
                    electionTitle: response.data.message.title,
                    startDate: formatDateTime(response.data.message.start_date),
                    endDate: formatDateTime(response.data.message.end_date)
                });

                localStorage.setItems(`election_${id}_startDate`, response.data.message.start_date);
                localStorage.setItem(`election_${id}_endDate`, response.data.message.end_date);
            }
        } catch (err) {
            setError(`Failed to load: ${err.message || err}`);
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const accessToken = localStorage.getItem('accessToken');
                if (!accessToken) {
                    throw new Error('Access token not found in localStorage');
                }

                // await Promise.all([
                //     fetchPageData(accessToken, election_id),
                //     fetchUrl(accessToken, election_id)
                // ]);

                console.log(id);
                await fetchPageData(accessToken, id);
                console.log(id);
                await fetchUrl(id)

                const interval = setInterval(fetchUrl(id), 30000) //Polls every 30 seconds

                return () => clearInterval(interval); // clears interval after ever poll
                
            } catch (err) {
                setError(`Failed to load data: ${err.message || err}`);
            } finally {
            setIsLoading(false);
            }
        };
        fetchData(id);
    }, [id])
    

    const handleButtonChange = () => {
        setIsOpen(!isOpen);
        setIsActive(!isActive);
    }
    // if (error) return <p>{error}</p>
    console.log(error)
    console.log(electionDetails);

    if (!id) return <p>Loading...</p>;

    return (
        <>
            <div className="">
                <div className={`fixed left-0 top-0 w-[12rem] h-full shadow-md transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 lg:block`}>
                    <Sidebar
                        id={id}
                    />
                </div>
                <div className={`whitespace-nowrap flex flex-col duration-300 ease-in-out ${isOpen ? "ml-[12rem]": "ml-0"} md:ml-[12rem]`}>
                    <div className={`flex-grow sticky top-0 bg-[#fff] flex whitespace-nowrap w-[100%] gap-[0.2rem] items-center border border-l-0 border-r-0 border-t-0`}>
                        <div className={`flex lg:hidden justify-center items-center w-[5%] px-[1.5rem] py-[1rem] border border-l-0 border-t-0 border-b-0 ${isActive ? 'bg-[#f2f2f2]' : 'bg-[#f6f8fa]'}`}>
                            <button 
                                onClick={handleButtonChange}
                                className={``}
                            >
                                <GiHamburgerMenu />
                            </button>
                        </div>
                        <div className="font-bold px-[1rem] py-[1rem]">{electionDetails.electionTitle}</div>
                    </div>
                    <div className="">
                        <div className="page-header sticky top-[3rem] bg-[#fff] flex items-center gap-3 p-[1rem] text-[1.2rem] border border-r-0 border-l-0 border-t-0 ">
                            <div><FaHome /></div>
                            Overview
                        </div>
                        {/* <div className={`lg:hidden transition-transform duration-300 ease-in-out ${isActive ? ' fixed top-0 left-0 right-0 bottom-0 bg-[#0b1117] overflow-hidden z-99 opacity-[.7]' : 'hidden'} `}></div> */}
                        <div className="page-content px-[2rem] lg:px-[0] mt-[2rem] m-auto flex flex-col lg:flex-row gap-10 justify-center">
                            <div className="">
                                <div className="flex flex-col lg:flex-row gap-[1rem]">
                                    <div className="border flex flex-col rounded-sm m-auto bg-[#fff] w-[100%]">
                                        <div className="flex items-center gap-1 text-[1.1rem] font-semibold px-[1rem] py-[0.5rem] border border-t-0 border-l-0 border-r-0">
                                            <MdDateRange />
                                            Start Date
                                        </div>
                                        <div className="text-[1.1rem] px-[1rem] py-[0.5rem] border border-t-0 border-l-0 border-r-0">
                                            {electionDetails.startDate}
                                        </div>
                                    </div>
                                    <div className="border rounded-sm w-full m-auto bg-[#fff]">
                                        <div className="flex items-center gap-1 text-[1.1rem] font-semibold px-[1rem] py-[0.5rem] border border-t-0 border-l-0 border-r-0">
                                            <MdDateRange />
                                            End Date
                                        </div>
                                        <div className="text-[1.1rem] px-[1rem] py-[0.5rem] border border-t-0 border-l-0 border-r-0">
                                            {electionDetails.endDate}
                                        </div>
                                    </div>
                                </div>

                                <div className=" mt-[1rem] border flex flex-col flex-grow flex-shrink-0 rounded-sm m-auto bg-[#fff] w-[100%]">
                                    <div className="flex items-center gap-1 text-[1.1rem] font-semibold px-[1rem] py-[0.5rem] border border-t-0 border-l-0 border-r-0">
                                        <BiWorld />
                                        Election URLs
                                    </div>
                                    <div className="card-body px-[1rem] py-[1rem]">
                                        <form action="">
                                            <div className="form-group">
                                                <label htmlFor="" className="font-bold text-[0.9rem]">Election URL</label>
                                                <div className="flex">
                                                    <input 
                                                        type="text" 
                                                        className="text-[1rem] px-[0.4rem] py-[0.3rem] rounded-sm border border-[#ced4da] bg-[#f6f8fa] text-[#495057] lg:w-[90%]" 
                                                        value={
                                                            isUrlActive && electionUrl
                                                            ? electionUrl
                                                            : "Election URL is not yet active."
                                                        }
                                                        readOnly
                                                    />
                                                    <button 
                                                        className="flex items-center gap-1 px-[0.4rem] shodow-md active:scale-95 active:shadow-inner transition bg-[#f0f0f0] border border-[#ced4da]"
                                                        onClick={() => navigator.clipboard.writeText(electionUrl)}
                                                        disabled={!isUrlActive}
                                                    >
                                                        <FaRegCopy />
                                                        Copy
                                                    </button>
                                                </div>
                                                <div className="w-full flex mt-[0.5rem] whitespace-normal text-[#868e96] text-[0.7rem] items-center gap-1">
                                                    <FaInfoCircle className="text-[1.5rem]" /> This URL will not be accessible until after the election has been launched.
                                                </div>
                                            </div>
                                            <div className="form-group mt-[1rem]">
                                                <label htmlFor="" className="font-bold text-[0.9rem]">Short URL</label>
                                                <div className="flex">
                                                    <input type="text"  className="lg:w-[90%] text-[1rem] px-[0.4rem] py-[0.3rem] rounded-sm border border-[#ced4da] bg-[#f6f8fa] text-[#495057]" />
                                                    <button className="flex items-center gap-1 px-[0.4rem] shodow-md active:scale-95 active:shadow-inner transition bg-[#f0f0f0] border border-[#ced4da]">
                                                        <FaRegCopy />
                                                        Copy
                                                    </button>
                                                </div>
                                                <div className="flex mt-[0.5rem] whitespace-normal text-[#868e96] text-[0.7rem] items-center gap-1">
                                                    <FaInfoCircle className="text-[1.5rem] whitespace-nowrap" /> This URL will not be accessible until after the election has been launched.
                                                </div>
                                            </div>
                                            <div className="form-group mt-[1rem]">
                                                <label htmlFor="" className="font-bold text-[0.9rem]">Preview URL</label>
                                                <div className="flex">
                                                    <input type="text"  className="lg:w-[90%] text-[1rem] px-[0.4rem] py-[0.3rem] rounded-sm border border-[#ced4da] bg-[#f6f8fa] text-[#495057]" />
                                                    <button className="flex items-center gap-1 px-[0.4rem] shodow-md active:scale-95 active:shadow-inner transition bg-[#f0f0f0] border border-[#ced4da]">
                                                        <FaRegCopy />
                                                        Copy
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-[1rem] ">
                                <div className="rounded text-[#fff] bg-[#ff6900] p-[1rem] flex items-center justify-between">
                                    <FaUsers className="text-[4rem] opacity-[.6]" />
                                    <div className="flex flex-col items-end">
                                        <h2 className="text-[2rem] font-bold">0</h2>
                                        <span>Voters</span>
                                    </div>
                                </div>
                                <div className="rounded mt-[1rem] text-[#fff] bg-[#ef0872] p-[1rem] flex items-center justify-between">
                                    <HiMiniQuestionMarkCircle className="text-[4rem] opacity-[.6]" />
                                    <div className="flex flex-col items-end">
                                        <h2 className="text-[2rem] font-bold">0</h2>
                                        <span>Ballot Questions</span>
                                    </div>
                                </div>
                                <div className="rounded mt-[1rem] text-[#fff] bg-[#502ac1] p-[1rem] flex items-center justify-between whitespace-nowrap">
                                    <IoIosOptions className="text-[4rem] opacity-[.6]" />
                                    <div className="flex flex-col items-end">
                                        <p className="text-[2rem] font-bold">0</p>
                                        <p>Options</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            <LoadingModal 
                isOpen={isLoading}
                onRequestClose={() => setIsLoading(!isLoading)}
            />
        </>
    
    )
}
