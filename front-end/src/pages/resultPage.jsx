// import React from 'react'
import { GiHamburgerMenu } from "react-icons/gi";
import Sidebar from "../components/sidebar";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from 'react'
import LoadingModal from '../components/loadingModal';
import axios from 'axios';
import { FaDiceD20 } from "react-icons/fa";


export default function ResultPage() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    // const [electionActive, setElectionActive] = useState(false);
    const [electionResult, setElectionResult] = useState([]);


    const handleButtonChange = () => {
        setIsOpen(!isOpen);
        setIsActive(!isActive);
    }

    const [electionDetails, setElectionDetails] = useState({
        electionTitle: '',
        startDate: '',
        endDate: '',
        description: ''
    });

    const fetchElectionResult = useCallback(async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            // Optionally handle the missing token scenario
            return;
        }
        console.log(accessToken)

        try {
            const response = await axios.get(`http://127.0.0.1:5000/onvote/election/${id}/candidate_votes`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (response.status === 200 && response.data.message) {
                setElectionResult(response.data.message);
                // console.log(electionResult);
            }
        } catch (err) {
            // setError(`Failed to load: ${err.message || err}`);
            if (err.response.status === 401 && err.response.data.status === "token_expired") {
            navigate('/token_refresh');
            } else {
                console.error(`Failed to load: ${err.message || err}`);
            }
        }
    }, [id, navigate]);

    useEffect(() => {
        const currentDate = new Date();
        const startDate = new Date(electionDetails.startDate);
        let intervalId;
        let timeoutId;

        if (currentDate < startDate) {
            const delay = startDate - currentDate;
            timeoutId = setTimeout(() => {
                fetchElectionResult();
                intervalId = setInterval(fetchElectionResult, 5000);
            }, delay);
        } else {
            fetchElectionResult();
            intervalId = setInterval(fetchElectionResult, 5000);
        }

        return () => {
            clearTimeout(timeoutId);
            clearInterval(intervalId);
        }
    }, [fetchElectionResult, electionDetails.startDate]);
    
    
    const fetchElectionData = useCallback(async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            // Optionally handle the missing token scenario
            return;
        }
        try {
            setIsLoading(true);
            const response = await axios.get(`http://127.0.0.1:5000/onvote/get_election/${id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (response.status === 200 && response.data.message) {
            setElectionDetails({
                electionTitle: response.data.message.title,
                startDate: response.data.message.start_date,
                endDate: response.data.message.end_date,
                description: response.data.message.description
            });
            console.log(response.data.message)
            }
        } catch (err) {
            // setError(`Failed to load: ${err.message || err}`);
            if (err.response.status === 401 && err.response.data.status === "token_expired") {
            navigate('/token_refresh');
            } else {
                console.error(`Failed to load: ${err.message || err}`);
            }
        } finally {
            setIsLoading(false);
        }
    }, [id, navigate]);

    // const checkElectionActive = useCallback(() => {
    //     const currentDate = new Date();
    //     const startDate = new Date(electionDetails.startDate);
    //     const endDate = new Date(electionDetails.endDate);
    //     return currentDate >= startDate && currentDate <= endDate;
    // }, [electionDetails.startDate, electionDetails.endDate]);

    // useEffect(() => {
    //     setElectionActive(checkElectionActive());
    // }, [checkElectionActive]);
    
    useEffect(() => {
     fetchElectionData();
    }, [fetchElectionData]);
  
  return (
    <>
        <div>
            <div className={`fixed left-0 top-0 w-[12rem] h-full shadow-md transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 lg:block`}>
                <Sidebar id={id} />
            </div>
            <div className={`whitespace-nowrap duration-300 ease-in-out ${isOpen ? "ml-[12rem]": "ml-0"} md:ml-[12rem]`}>
                <div className={`sticky top-0 bg-[#fff] flex whitespace-nowrap w-[100%] gap-[0.2rem] items-center border border-l-0 border-r-0 border-t-0 `}>
                    <div className={`flex lg:hidden justify-center items-center w-[5%] px-[1.5rem] py-[1rem] border border-l-0 border-t-0 border-b-0 ${isActive ? 'bg-[#f2f2f2]' : 'bg-[#f6f8fa]'}`}>
                        <button 
                        onClick={handleButtonChange}
                        className={``}
                    >
                        <GiHamburgerMenu />
                        </button>
                    </div>
                    <div className=" font-bold px-[1rem] py-[1rem]">{electionDetails.electionTitle || "Election Name"}</div>
                </div>
                <div className="whitespace-nowrap">
                    <div className="page-header sticky top-[3rem] bg-[#fff] flex items-center gap-3 p-[1rem] text-[1.2rem] border border-r-0 border-l-0 border-t-0 ">
                        <div><FaDiceD20 /></div>
                        Result
                    </div>

                    {electionResult && electionResult.length > 0 ? (
                        electionResult.map((ballot) => {
                            const totalVotes = ballot.candidates.reduce((acc, candidate) => acc + candidate.votes, 0);
                            return (
                                <div key={ballot.ballot_id} className="ballot-result my-4 p-4 border rounded m-auto lg:w-[50%] w-[90%]">
                                    <h3 className="font-bold text-xl">{ballot.ballot_title}</h3>
                                    <ul>
                                        {ballot.candidates.map((candidate) => {
                                            // Calculate percentage; if no votes, show 0.00%
                                            const percentage = totalVotes ? ((candidate.votes / totalVotes) * 100).toFixed(2) : "0.00";
                                            return (
                                                <li key={candidate.candidate_id} className="flex justify-between my-2">
                                                    <span>{candidate.candidate_name}</span>
                                                    <span>{percentage}%</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center">No results available</p>
                    )}
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
