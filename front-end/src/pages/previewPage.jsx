import { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/sidebar";
import { GiHamburgerMenu } from "react-icons/gi";
// import { TokenContext } from "../context/AuthContext";
import { MdPreview } from "react-icons/md";
import { useParams } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import LoadingModal from '../components/loadingModal';


export default function PreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [electionName, setElectionName] = useState('');
  const [candidates, setCandidates] = useState({});
  const [ballots, setBallots] = useState([]);

  const [selectedCandidates, setSelectedCandidates] = useState({});
  const [preview, setPreview] = useState(false);
  // const { electionDetails } = useContext(TokenContext);
  // const [settings, setSettings] = useState(null);
  // const navigate = Navigate();
  // const [error, setError] = useState('');
  

  const handleButtonChange = () => {
      setIsOpen(!isOpen);
      setIsActive(!isActive);
  }

  const [electionDetails, setElectionDetails] = useState({
    electionTitle: '',
    startDate: '',
    endDate: '',
    description: ''
  })


  const fetchPageData = useCallback(async () => {
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

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  const fetchBallot = useCallback(async (election_id) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://127.0.0.1:5000/onvote/election/${election_id}/vote/get_ballots`
      );
      if (
        response.status === 200 &&
        response.data.message &&
        response.data.message.length > 0
      ) {
        setBallots(response.data.message);
        // console.log("Ballots:", response.data.message);
      }
    } catch (err) {
      if (err.response?.status === 401 && err.response?.data?.status === "token_expired") {
        console.error(`Failed to load ballots: ${err.message || err}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCandidate = useCallback(async (election_id, ballot_id) => {
    try {
        setIsLoading(true);
        const response = await axios.get(`http://127.0.0.1:5000/onvote/election/${election_id}/ballot/${ballot_id}/vote/get_candidates`);
        if (response.status === 200 && response.data.message && response.data.message.length > 0) {
            setCandidates((prev) => ({
                ...prev,
                [ballot_id]: response.data.message,
            }));
            // console.log(response.data.message);
        } 
    } catch (err) {
        // setError(`Failed to load: ${err.message || err}`);
        if (err.response.status === 401 && err.response.data.status === "token_expired") {
            console.error(`Failed to load: ${err.message || err}`);
        }
        
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchBallot(id);
    }
  }, [id, fetchBallot]); // you can add fetchBallot here if it's not memoized: [id, fetchBallot]
  
  // Fetch candidates whenever ballots update
  useEffect(() => {
    if (ballots && ballots.length > 0) {
      ballots.forEach((item) => {
        fetchCandidate(item.election_id, item.id);
      });
    }
  }, [ballots, fetchCandidate]);

  useEffect(() => {
    const fetchElection = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://127.0.0.1:5000/onvote/get_election/${id}`);
            if (response.status === 200 && response.data.message) {
                setElectionName(response.data.message.title)
            } else {
                alert("Error fetching election data");
            }
        } catch (err) {
            console.error(`Failed to load: ${err.message || err}`);
        } finally {
            setIsLoading(false);
        }
        
    };

    if (id) {
      fetchElection();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // const voterId = localStorage.getItem(`voter_id_${id}`);

    try {
      alert("Votes successfully cast!");
      navigate(0);
    } catch (error) {
      console.error("Error casting vote:", error);
      alert("There was an error casting your vote.");
    } finally {
      setIsLoading(false);
    }

  }




  // if (error) return <p>{error}</p>

  return (
    <>
      <div className="relative">
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
              <div><MdPreview /></div>
              Preview
            </div>

            {preview ? (
                <div className="page-body m-auto p-[1.5rem]" >
                    <div className="text-center text-[2rem] font-bold">{electionName}</div>
                    {ballots && ballots.map((item, index) => (
                    <div key={index}>
                        <form className="border shadow-md mt-[3rem] m-auto rounded lg:w-[50%]">
                        <div className="font-semibold p-[.8rem] text-[1.2rem] bg-[#0bacfa] text-white rounded-t">{item.title}</div>
                        <div className="head p-[.8rem]">
                            <p className="text-[.8rem] font-bold">INSTRUCTIONS</p>
                            <div className="border rounded p-[.8rem]">
                            Select <span className="border px-[.4rem] py-.5 rounded bg-[#0bacfa] text-white font-bold">1</span> option from the list below
                            <p className="text-red-600 text-[.8rem]">* Required</p>
                            </div>
                        </div>
                        <div>
                            {candidates[item.id]?.map((candidate, idx) => (
                            <div key={idx} className="form-group flex item-center p-[1rem] gap-3">
                                <input 
                                type="radio" 
                                className="w-6" 
                                name={`ballot-${item.id}`}
                                value={candidate.id}
                                checked={selectedCandidates[item.id] === candidate.id}
                                onChange={() => 
                                    setSelectedCandidates(prev => ({
                                    ...prev,
                                    [item.id]: candidate.id
                                    }))
                                }
                                />
                                <div>{candidate.title}</div>
                            </div>
                            ))}
                            
                        </div>
                        </form>
                    </div>
                    ))}
                    <div className="flex items-center gap-4 lg:w-[50%] m-auto">
                        <button 
                        className="mt-5 border border-green-500 px-3 py-1 font-bold text-white bg-green-500 rounded"
                        onClick={handleSubmit}
                        >
                        Submit
                        </button>
                        <button 
                            className="mt-5 border-2 border-grey-600 px-3 py-1 font-bold rounded"
                            onClick={() => setPreview(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            ) : (
                <div onClick={() => setPreview(true)} className="mt-5 m-auto border w-[60%] text-center p-[1.rem] border-blue-400  rounded bg-blue-400 text-white font-bold nowrap">Click to Preview</div>
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
