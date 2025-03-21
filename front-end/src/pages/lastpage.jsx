// import React from 'react'
// import Logo from '../assets/onvote-high-resolution-logo.svg';
import { useNavigate } from 'react-router-dom';
// import { useState, useContext } from 'react';
// import { TokenContext } from '../context/AuthContext';
import LoadingModal from '../components/loadingModal';

import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';

export default function LastPage() {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [checkResult, setCheckResult] = useState(false);
    const [electionDetails, setElectionDetails] = useState({
        electionTitle: '',
        startDate: '',
        endDate: '',
        description: ''
    });
    const [electionResult, setElectionResult] = useState([]);

    const navigate = useNavigate();

    
    const fetchElectionResult = useCallback(async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            // Optionally handle the missing token scenario
            return;
        }
        console.log(accessToken)

        try {
            const response = await axios.get(`http://127.0.0.1:5000/onvote/election/${id}/candidate_votes/result`, {
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

    const handleCheckResult = async () => {
        setCheckResult(!checkResult);
    }

    const fetchElectionData = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`http://127.0.0.1:5000/onvote/get_election/${id}`);
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

    useEffect(() => {
        fetchElectionData();
    }, [fetchElectionData]);

    return (
        <>
            <div className='px-6'>
                <h3 className='text-center  text-[2rem] font-bold mt-3 text-blue-500'>{electionDetails.electionTitle}</h3>

                {checkResult ? (
                    electionResult && electionResult.length > 0 ? (
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
                        <p>Result is not available</p>
                    )
                ) : (
                    <div className="flex flex-col justify-center items-center">
                        <p className='text-center text-[.9rem] mt-4'>Thanks for submitting, click on the button below to view the results as the election is ongoing</p>

                        <div className='flex mt-6'>
                            <button onClick={() => {
                                setTimeout(() => {
                                    setCheckResult(true);
                                    handleCheckResult();
                                }, 1000);
                                
                                
                            }} className='m-auto border bg-green-400 px-3 py-1 font-bold text-white'>Click here!!</button>
                        </div>
                    </div>
                )}

                <div className={`${checkResult ? 'block' : 'hidden'} flex`}>
                    <button onClick={() => {
                        setTimeout(() => {
                            setCheckResult(false);
                        }, 1000)
                    }} className='m-auto border px-3 py-1'>Close</button>
                </div>
                

                
                
            </div>

             <LoadingModal 
                isOpen={isLoading}
                onRequestClose={() => setIsLoading(!isLoading)}
            />
        </>
        
    )
}