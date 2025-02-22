import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import { GiHamburgerMenu } from "react-icons/gi";
// import { TokenContext } from "../context/AuthContext";
import { MdBallot } from "react-icons/md";
import { FaCloudArrowUp } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import AddBallotModal from "../components/addBallotModal";
import Ballot from "./ballot";
import { useParams } from "react-router-dom";
import axios from 'axios';
// import { useNavigate } from "react-router-dom";

export default function Ballots() {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  // const { electionDetails } = useContext(TokenContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [countBallot, setCountBallot] = useState(0);
  const [saveBallot, setSaveBallot] = useState(false);
  const [pageData, setPageData] = useState([]);
  const [electionTitle, setElectionTitle] = useState('');
  
  // const navigate = useNavigate();

  const [error, setError] = useState('');

  const handleButtonChange = () => {
      setIsOpen(!isOpen);
      setIsActive(!isActive);
  }

  const handleAddBallot = (bool) => {
    setIsModalOpen(bool);
  }

  const fetchBallot = async (election_id) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(`http://127.0.0.1:5000/onvote/election/${election_id}/get_ballots`, {
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200 && response.data.message && response.data.message.length > 0) {
        setPageData(response.data.message);
        setElectionTitle(response.data.election_title);
        console.log(response.data.message);
        setSaveBallot(true);
      }
    } catch (err) {
      setError(`Error fetching ballot: ${err.message || err}`)
    }
  }

  const handleSave = async (form) => {
    try {
      const payload = { ...form, election_id: id };
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post(`http://127.0.0.1:5000/onvote/election/${id}/create_ballot`, JSON.stringify(payload), {
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.status === 201 && response.data.message) {
        fetchBallot(id);
      }
    
    } catch (err) {
      setError(`Error saving ballot: ${err.message || err}`);
    }
    
  }

  useEffect(() => {
    fetchBallot(id);
  }, [id])

  if (error) return <p>{error}</p>;

  return (
    <>
    <div className="relative">
        <div className={`fixed left-0 top-0 w-[12rem] h-full shadow-md transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 lg:block`}>
          <Sidebar
            id={id}
          />
        </div>
        <div className={`whitespace-nowrap duration-300 ease-in-out ${isOpen ? "ml-[12rem]": "ml-0"} md:ml-[12rem]`}>
          <div className={`sticky top-0 flex whitespace-nowrap w-[100%] gap-[0.2rem] items-center border border-l-0 border-r-0 border-t-0 `}>
            <div className={`flex lg:hidden justify-center items-center w-[5%] px-[1.5rem] py-[1rem] border border-l-0 border-t-0 border-b-0 ${isActive ? 'bg-[#f2f2f2]' : 'bg-[#f6f8fa]'}`}>
              <button 
                onClick={handleButtonChange}
                className={``}
            >
                <GiHamburgerMenu />
              </button>
            </div>
            <div className="font-bold px-[1rem] py-[1rem]">{electionTitle || "Election Title"}</div>
          </div>
          
          {!saveBallot && (
            <>
              <div className="page-content bg-white flex flex-col items-center justify-center h-screen">
                <div className="flex items-center gap-1 font-semibold text-[2.25rem]">
                  <MdBallot />
                  Build Your Ballot
                </div>
                <p className="text-[1.2rem]">Get started by adding your first ballot</p>
                <div  className="flex items-center gap-1 text-[1.3rem] mt-[1rem]">
                  <button className="flex items-center gap-1 border border-[#0bacfa] text-[#0bacfa] px-[1rem] py-[0.5rem] rounded-sm">
                    <FaCloudArrowUp />
                    Import
                  </button>
                  <button 
                    className="flex items-center gap-1  font-semibold border border-[#2ecd10] bg-[#2ecd10] py-[0.5rem] px-[1rem] rounded-sm text-[#fff]"
                    onClick={handleAddBallot}
                  >
                    <IoMdAdd />
                    Add Question
                  </button>
                </div>
              </div>
            </>
          )}
          {saveBallot && (
            <Ballot
              pageData={pageData}
              addBallot={handleAddBallot}
            />
          )}
            
          
        </div>
        
    </div>
    <AddBallotModal
      isOpen={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      onSave={handleSave}
    />
  </>
)}
