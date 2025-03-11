// import React from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import LoadingModal from '../components/loadingModal';
import axios from 'axios';

export default function VotePage() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [electionName, setElectionName] = useState('');
  const [candidates, setCandidates] = useState({});
  const [ballots, setBallots] = useState([]);

  const [selectedCandidates, setSelectedCandidates] = useState({});
  const navigate = useNavigate();


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

    const voterId = localStorage.getItem(`voter_id_${id}`);

    try {
      console.log(`ballots: ${ballots}`);
      for (const ballot of ballots) {
        // console.log(`ballot: ${ballot}`);
        const candidateId = selectedCandidates[ballot.id];
        if (!candidateId) {
          alert(`Please select a candidate for ballot: ${ballot.title}`);
          setIsLoading(false);
          return;
        }
        const payload = {
          voter_id: voterId,
          ballot_id: ballot.id,
          candidate_id: candidateId,
        };
        const response = await axios.post(
          `http://127.0.0.1:5000/onvote/election/${ballot.election_id}/cast_vote`,
          payload
        );
        // Optionally, handle individual responses:
        if (response.data.status !== 'success') {
          alert(`Error: ${response.data.message}`);
          setIsLoading(false);
          return;
        }
      }
      alert("Votes successfully cast!");
      localStorage.setItem(`voter_voted_${id}`, "true");
      navigate(`/election/${id}/lastPage`);
    } catch (error) {
      console.error("Error casting vote:", error);
      alert("There was an error casting your vote.");
    } finally {
      setIsLoading(false);
    }

  }

  return (
    <>
      <div className="m-auto p-[1.5rem]" >
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
        <button 
          className="mt-5 border border-green-500 px-3 py-1 font-bold text-white bg-green-500 m-auto rounded lg:w-[50%]"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      <LoadingModal 
        isOpen={isLoading}
        onRequestClose={() => setIsLoading(!isLoading)}
      />
    </>
  )
}
