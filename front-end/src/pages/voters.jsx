import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import Sidebar from "../components/sidebar";
import { GiHamburgerMenu } from "react-icons/gi";
// import { TokenContext } from "../context/AuthContext";
import { FaUsers } from "react-icons/fa";
import { FaCloudArrowUp } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import AddVoterModal from "../components/addVoterModal";
import Voter from "./voter";
import axios from 'axios';

export default function Voters() {
    const { id } = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [isActive, setIsActive] = useState(false);
    // const { electionDetails } = useContext(TokenContext);
    const [openVoterModal, setOpenVoterModal] = useState(false);
    const [voters, setVoters] = useState([]);
    const [saveVoters, setSaveVoters] = useState(false);

    const [error, setError] = useState(null);
    const [electionTitle, setElectionTitle] = useState('');

    // const [voters, setVoters] = useState([]);
    

    const handleButtonChange = () => {
        setIsOpen(!isOpen);
        setIsActive(!isActive);
    }

    const handleAddVoter = () => {
        setOpenVoterModal(true);
    }

    const fetchVoters = async (election_id) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.get(`http://127.0.0.1:5000/onvote/election/${election_id}/get_voters`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (response.status === 200 && response.data.message && response.data.message.length > 0) {
                setVoters(response.data.message);
                setSaveVoters(true);
                setElectionTitle(response.data.election_title);
                console.log(response.data.message);
            } else {
                setElectionTitle(response.data.election_title);
            }
        } catch (err) {
            setError(`Error fetching voters: ${err.message || err}`)
        }
    }

    const handleVoterSave = async (form) => {
        // if (form) {
        //     setFormData({
        //         voter_name: form.voter_name,
        //         voter_id: form.voter_id,
        //         voter_key: form.voter_key,
        //         voter_email: form.voter_email,
        //     })
        //     console.log(form);
        //     setAddVoters(true);
        // }
        // setVoters((prevvoters) => [...prevvoters, newVoter]);
        // console.log(newVoter);
        // setAddVoters(true);
        // console.log(voters);
        try {
            const payload = { ...form };
            const accessToken = localStorage.getItem('accessTooken');
            const response = await axios.post(`http://127.0.0.1:5000/onvote//election/${id}/add_voter`, JSON.stringify(payload), {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 201 && response.data.message) {
                fetchVoters(id);
            }
        } catch (err) {
            setError(`Error saving ballot: ${err.message || err}`)
        }
    }

    useEffect(() => {
        fetchVoters(id);
    }, [id])

    if (error) return <p>{error}</p>

    return (
        <>
            <div className="relative">
                <div className={`fixed left-0 top-0 w-[12rem] h-full shadow-md transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 lg:block`}>
                    <Sidebar id={id} />
                </div>
                <div className={`whitespace-nowrap duration-300 ease-in-out ${isOpen ? "ml-[12rem]": "ml-0"} md:ml-[12rem]`}>
                    <div className={`flex whitespace-nowrap w-[100%] gap-[0.2rem] items-center border border-l-0 border-r-0 border-t-0 `}>
                        <div className={`flex lg:hidden justify-center items-center w-[5%] px-[1.5rem] py-[1rem] border border-l-0 border-t-0 border-b-0 ${isActive ? 'bg-[#f2f2f2]' : 'bg-[#f6f8fa]'}`}>
                            <button 
                                onClick={handleButtonChange}
                                className={``}
                            >
                                <GiHamburgerMenu />
                            </button>
                        </div>
                        <div className="font-bold px-[1rem] py-[1rem]">{electionTitle || "Election Name"}</div>
                    </div>
                    <div className="whitespace-nowrap">
                        {!saveVoters && (
                            <>
                                <div className="page-content bg-white flex flex-col items-center justify-center h-screen">
                                    <div className="flex items-center gap-3 text-[#212529] font-semibold">
                                        <FaUsers className="text-[4rem]" />
                                        <p className="text-[2.25rem]">Add Voters</p>
                                    </div>
                                    <p className="text-[1.5rem] text-[#212529]">Add voters to this election.</p>
                                    <div  className="flex items-center gap-1 text-[1.3rem] mt-[1rem]">
                                        <button className="flex items-center gap-1 border border-[#0bacfa] text-[#0bacfa] px-[1rem] py-[0.5rem] rounded-sm">
                                            <FaCloudArrowUp />
                                            Import
                                        </button>
                                        <button 
                                            className="flex items-center gap-1  font-semibold border border-[#2ecd10] bg-[#2ecd10] py-[0.5rem] px-[1rem] rounded-sm text-[#fff]"
                                            onClick={handleAddVoter}
                                        >
                                            <IoMdAdd />
                                            Add Voter
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                        {saveVoters && (
                            <Voter
                                form={voters}
                                onOpenModal={handleAddVoter}
                             />
                        )}
                        
                    </div>
                </div>
                
            </div>

            <AddVoterModal 
                isOpen={openVoterModal}
                onRequestClose={() => setOpenVoterModal(false)}
                onSave={handleVoterSave}
            />
        </>
    )
}
