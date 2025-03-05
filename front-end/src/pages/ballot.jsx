import { useEffect, useRef, useState } from "react";
import { MdBallot } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { FaEllipsisH, FaEdit } from "react-icons/fa";
import OptionModal from "../components/optionModal";
import { GrClear } from "react-icons/gr";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import PropTypes from 'prop-types';
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";
import LoadingModal from '../components/loadingModal';

export default function Ballot({ pageData, addBallot, onEditBallot }) {
    const navigate = useNavigate();
    const { id } = useParams();

    const [isOpen, setIsOpen] = useState(false);
    const [ballotDropdown, setBallotDropdown] = useState(false);
    const [activeDropDown, setActiveDropDown] = useState(null);
    const [candidateDropdown, setCandidateDropdown] = useState({});
    const [candidateInfo, setCandidateInfo] = useState({
        election_id: 0,
        ballot_id: 0,
    });

    const [candidates, setCandidates] = useState({});
    // const [error, setError] = useState('');
    const [candidateToEdit, setCandidateToEdit] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const dropdownRefs = useRef({});
    const buttonRefs = useRef({});
    const ballotDropdownRef = useRef(null);
    const ballotButtonRef = useRef(null);
    const candidateDropdownRef = useRef({});
    const candidateButtonRef = useRef({});

    useEffect(() => {
        if (pageData && pageData.length > 0) {
            pageData.forEach((item) => {
                fetchCandidate(item.election_id, item.id);
            });
        }
    }, [pageData]);

    const fetchCandidate = async (election_id, ballot_id) => {
        try {
            setIsLoading(true);
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.get(`http://127.0.0.1:5000/onvote/election/${election_id}/ballot/${ballot_id}/get_candidates`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (response.status === 200 && response.data.message && response.data.message.length > 0) {
                setCandidates((prev) => ({
                    ...prev,
                    [ballot_id]: response.data.message,
                }));
                console.log(response.data.message);
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
    }

    const handleSave = async (form) => {
        console.log(form);

        try {
            setIsLoading(true);
            const accessToken = localStorage.getItem('accessToken');
            let response;

            if (isEditMode) {
                response = await axios.put(`http://127.0.0.1:5000/onvote/election/${form.election_id}/ballot/${form.ballot_id}/update_candidate`, JSON.stringify({ ...form, id: candidateToEdit.id }), {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                });
            } else {
                response = await axios.post(`http://127.0.0.1:5000/onvote/election/${form.election_id}/ballot/add_candidate`, JSON.stringify(form), {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                });
            }
            if (response.status === 201 && response.data.message) {
                alert(response.data.message);
                fetchCandidate(form.election_id, form.ballot_id);
            }
        } catch (err) {
            if (err.response.status === 401 && err.response.data.status === "token_expired") {
                navigate('/token_refresh');
            } else {
                console.error(`Failed to load: ${err.message || err}`);
            }
        } finally {
            setIsLoading(false);
        }
    }

    const handleAdd = () => {
        addBallot(true);
    }

    const handleAddCandidate = (election_id, ballot_id, ballot_title) => {
        setCandidateInfo({
            election_id: election_id,
            ballot_id: ballot_id,
            ballot_title: ballot_title
        });
        console.log(candidateInfo);
        setIsOpen(true);
    }

    const handleEditCandidate = (candidate, election_id, ballot_id, ballot_title) => {
        console.log(candidate);
        setCandidateToEdit(candidate);
        setCandidateInfo({
            election_id: election_id,
            ballot_id: ballot_id,
            ballot_title: ballot_title
        });
        setCandidateDropdown({});
        setIsEditMode(true);
        setIsOpen(true);
    };

    const handleBallotDropdown = () => {
        setBallotDropdown(!ballotDropdown);
        setActiveDropDown(null);
        setCandidateDropdown({});
    }

    const handleQuestionDropdown = (index) => {
        setActiveDropDown((prev) => (prev === index ? null : index));
        setBallotDropdown(false);
        setCandidateDropdown({});
    }

    const handleCandidateDropdown = (ballotId, candidateIdx) => {
        const dropdownKey = `${ballotId}-${candidateIdx}`;
        setCandidateDropdown((prev) => ({
            ...prev,
            [dropdownKey]: !prev[dropdownKey]
        }));
        setActiveDropDown(null);
        setBallotDropdown(false);
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (activeDropDown != null) {
                const dropdownEl = dropdownRefs.current[activeDropDown];
                const buttonEl = buttonRefs.current[activeDropDown];
                if (dropdownEl && !dropdownEl.contains(e.target) && buttonEl && !buttonEl.contains(e.target)) {
                    setActiveDropDown(null);
                }
            }

            if (ballotDropdown) {
                if (ballotDropdownRef.current &&
                    !ballotDropdownRef.current.contains(e.target) &&
                    ballotButtonRef.current &&
                    !ballotButtonRef.current.contains(e.target)
                ) {
                    setBallotDropdown(false);
                }
            }

            Object.keys(candidateDropdown).forEach((key) => {
                const candidateDropdownEl = candidateDropdownRef.current[key];
                const candidateButtonEl = candidateButtonRef.current[key];

                if (candidateDropdown[key] && candidateDropdownEl &&
                    !candidateDropdownEl.contains(e.target) &&
                    candidateButtonEl &&
                    !candidateButtonEl.contains(e.target)
                ) {
                    setCandidateDropdown((prev) => ({
                        ...prev,
                        [key]: false
                    }));
                }
            });
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [activeDropDown, ballotDropdown, candidateDropdown]);

    const handleDeleteBallot = async (election_id, id) => {
        try {
            setIsLoading(true);
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.delete(`http://127.0.0.1:5000/onvote/election/${election_id}/delete_ballot/${id}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
            });
            if (response.status === 200 && response.data.message) {
                alert(response.data.message)
                navigate(0);
            }
        } catch (err) {
            if (err.response.status === 401 && err.response.data.status === "token_expired") {
                navigate('/token_refresh');
            } else {
                console.error(`Failed to load: ${err.message || err}`);
            }
        } finally {
            setIsLoading(false);
        }
    }

    const clearAllBallot = async () => {
        try {
            setIsLoading(true);
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.delete(`http://127.0.0.1:5000/onvote/election/${id}/delete_ballots`, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
            });
            if (response.status === 200 && response.data.message) {
                alert(response.data.message)
                navigate(0);
            }
        } catch (err) {
            if (err.response.status === 401 && err.response.data.status === "token_expired") {
                navigate('/token_refresh');
            } else {
                console.error(`Failed to load: ${err.message || err}`);
            }
        } finally {
            setIsLoading(false);
        }
    }

    const handleCandidateDelete = async (election_id, ballot_id, candidate_id) => {
        try {
            setIsLoading(true);
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.delete(`http://127.0.0.1:5000/onvote/election/${election_id}/ballot/${ballot_id}/delete_candidate/${candidate_id}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
            });
            if (response.status === 200 && response.data.message) {
                alert(response.data.message)
            }
        } catch (err) {
            if (err.response.status === 401 && err.response.data.status === "token_expired") {
                navigate('/token_refresh');
            } else {
                console.error(`Failed to load: ${err.message || err}`);
            }
        } finally {
            setIsLoading(false);
        }
    }

    const clearAllCandidate = async (ballot_id) => {
        try {
            setIsLoading(true);
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.delete(`http://127.0.0.1:5000/onvote/election/${id}/ballot/${ballot_id}/delete_candidates`, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
            });
            if (response.status === 200 && response.data.message) {
                alert(response.data.message)
                navigate(0);
            }
        } catch (err) {
            if (err.response.status === 401 && err.response.data.status === "token_expired") {
                navigate('/token_refresh');
            } else {
                console.error(`Failed to load: ${err.message || err}`);
            }
        } finally {
            setIsLoading(false);
        }
    }

    // if (error) return <p>{error}</p>
    return (
        <>
            <div className="relative">
                <div className="whitespace-nowrap">
                    <div className="page-header lg:flex lg:justify-between sticky top-[3rem] px-[1rem] py-[.5rem] bg-[#fff] border border-r-0 border-l-0 border-t-0">
                        <div className="flex items-center gap-2 text-[1.2rem]">
                            <div className="text-[1.5rem]"><MdBallot /></div>
                            <div className="text-[1.3rem]">Ballot</div>
                        </div>
                        <div className="flex items-center justify-between lg:justify-normal lg:gap-2 mt-[.5rem]">
                            <div className="flex gap-1">
                                <button className="border border-[#0bacfa] text-[#0bacfa] text-[.9rem] px-[.5rem] py-[0.3rem] rounded">Import</button>
                                <button
                                    className="text-[#fff] border border-[#2ecd10] bg-[#2ecd10] px-[.5rem] py-[0.3rem] rounded"
                                    onClick={handleAdd}
                                >Add Ballot</button>
                            </div>
                            <button ref={ballotButtonRef} onClick={handleBallotDropdown} className="flex items-center justify-center px-[1rem] py-[.3rem] rounded bg-[#e3e7ea] border border-[#e3e7ea] font-bold text-[1.3rem]"><FaEllipsisH /></button>
                            <div ref={ballotDropdownRef} className={`mt-[.3rem] border flex flex-col gap-3 px-[1rem] py-[.5rem] right-4 shadow absolute top-[5rem] lg:top-[3rem] bg-white ${ballotDropdown ? 'block' : 'hidden'}`}>
                                <div className="cursor-pointer" onClick={clearAllBallot}>Clear Ballot</div>
                                <div className="cursor-pointer">Export Ballot</div>
                            </div>
                        </div>
                    </div>
                    {pageData && pageData.map((item, index) => (
                        <div key={index} className="whitespace-normal bg-[#fff] mt-[.5rem] lg:mt-[1rem] rounded border w-[90%] lg:w-[60%] m-auto">
                            <div className="bg-[#f3f6f8] px-[1rem] border border-[#dee2e6] border-t-0 border-l-0 border-r-0">
                                <div className="flex justify-between py-[.5rem]">
                                    <h1 className="text-[1.5rem] font-bold">{item.title}</h1>
                                    <button
                                        ref={(el) => (buttonRefs.current[index] = el)}
                                        className="bg-[#e3e7ea] px-[.5rem] py-[.7rem] rounded"
                                        onClick={() => handleQuestionDropdown(index)}
                                    >
                                        <FaEllipsisH />
                                    </button>

                                    <div ref={(el) => (dropdownRefs.current[index] = el)} className={`border flex flex-col gap-3 px-[1rem] py-[.5rem] shadow absolute bg-white ${activeDropDown === index ? 'block mt-[2.5rem] right-10 lg:right-[15rem]' : 'hidden'}`}>
                                        <div
                                            className="flex items-center gap-3 cursor-pointer"
                                            onClick={() => onEditBallot(item)}
                                        >
                                            <FaEdit />
                                            Edit
                                        </div>
                                        <div
                                            className="flex items-center gap-3 cursor-pointer"
                                            onClick={() => clearAllCandidate(item.id)}
                                        >
                                            <GrClear />
                                            Clear
                                        </div>
                                        <div
                                            className="flex items-center gap-3 cursor-pointer"
                                            onClick={() => handleDeleteBallot(item.election_id, item.id)}
                                        >
                                            <RiDeleteBin6Line />
                                            Delete
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-[1rem] rounded px-[1rem] py-[.5rem] bg-[#fff] border border-[#dee2e6] -mb-px w-fit border-b-[#fff]">Candidates</div>
                            </div>
                            <div className="w-[90%] m-auto py-[1rem]">
                                {!candidates[item.id] || candidates[item.id].length === 0 ? (
                                    <div className="bg-[#ecf9ff] text-[#076796] rounded px-[1.25rem] py-[.75rem] text-[1.1rem] border border-[#c1eafe]">
                                        Click the &quot;Add Candidate&quot; button below to add a candidate to this ballot
                                    </div>
                                ) : (
                                    candidates[item.id].map((candidate, idx) =>{
                                        const dropdownKey = `${item.id}-${idx}`;
                                        return (
                                            <div key={idx} className="option flex items-center justify-between bg-[#f3f6f8] px-[1rem] py-[.5rem] rounded mb-[.5rem]">
                                                <div className="flex items-center gap-2">
                                                    <IoCheckmarkCircleSharp />
                                                    {candidate.title}
                                                </div>
                                                <button
                                                    ref={(el) => (candidateButtonRef.current[dropdownKey] = el)}
                                                    className="bg-[#e3e7ea] px-[.5rem] py-[.7rem] rounded"
                                                    onClick={() => handleCandidateDropdown(item.id, idx)}
                                                >
                                                    <FaEllipsisH />
                                                </button>
                                                <div
                                                    ref={(el) => (candidateDropdownRef.current[dropdownKey] = el)}
                                                    className={`border flex flex-col gap-3 px-[1rem] py-[.5rem] shadow absolute bg-white ${candidateDropdown[dropdownKey] ? 'block mt-[7.5rem] right-[3.5rem] lg:right-[15rem]' : 'hidden'}`}
                                                >
                                                    <div
                                                        className="flex items-center gap-3 cursor-pointer"
                                                        onClick={() => handleEditCandidate(candidate, item.election_id, item.id, item.title)}
                                                    >
                                                        <FaEdit />
                                                        Edit
                                                    </div>
                                                    <div
                                                        className="flex items-center gap-3 cursor-pointer"
                                                        onClick={() => handleCandidateDelete(item.election_id, candidate.ballot_id, candidate.id)}
                                                    >
                                                        <RiDeleteBin6Line />
                                                        Delete
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                )}

                                <button onClick={() => handleAddCandidate(item.election_id, item.id, item.title)} className="mt-[1rem] w-fit text-white font-semibold flex items-center gap-1 border-[#2ecd10] bg-[#2ecd10] px-[.5rem] py-[0.3rem] rounded">
                                    <IoMdAdd />
                                    Add Candidate
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <OptionModal
                isOpen={isOpen}
                onRequestClose={() => {
                    setIsOpen(false);
                    setIsEditMode(false);
                }}
                onSave={handleSave}
                candidateInfo={candidateInfo}
                initialData={candidateToEdit}
                isEditMode={isEditMode}
            />

            <LoadingModal 
                isOpen={isLoading}
                onRequestClose={() => setIsLoading(!isLoading)}
            />
        </>
    )
};

Ballot.propTypes = {
    pageData: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    addBallot: PropTypes.string.isRequired,
    onEditBallot: PropTypes.func.isRequired,
};