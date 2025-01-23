import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import { GiHamburgerMenu } from "react-icons/gi";
// import { TokenContext } from "../context/AuthContext";
import { IoMdSettings } from "react-icons/io";
import { MdDateRange } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useParams } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router-dom";


export default function Settings() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isActive, setIsActive] = useState(false);
    // const { electionDetails } = useContext(TokenContext);
    // const [settings, setSettings] = useState(null);
    // const navigate = Navigate();
    const [error, setError] = useState('');
    

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

    const [generalFormData, setGeneralFormData] = useState({
      title: electionDetails.electionTitle,
      description: electionDetails.description,
    })
    

    const [dateFormData, setDateFormData] = useState({
      start_date: '',
      end_date: ''
    })

    const handleGeneralChange = (e) => {
      const { name,  value } = e.target;
      setGeneralFormData({ ...generalFormData, [name]: value });
    }

    const handleDateChange = (e) => {
      const { name, value } = e.target;
      setDateFormData({ ...dateFormData, [name]: value })
    }

    const fetchPageData = async (accessToken, id) => {
      try {
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
          setError(`Failed to load: ${err.message || err}`);
      }
    }

    useEffect(() => {
      const accessToken = localStorage.getItem('accessToken');
      fetchPageData(accessToken, id);
    }, [id]);

    useEffect(() => {
      if (electionDetails.electionTitle) {
        setGeneralFormData({
          title: electionDetails.electionTitle,
          description: electionDetails.description,
        });
      }
      if (electionDetails.electionTitle) {
        setDateFormData({
          start_date: electionDetails.startDate,
          end_date: electionDetails.endDate
        })
      }
      // console.log(dateFormData);
    }, [electionDetails]);

    const handleGeneralSettingsSave = async (e) => {
      e.preventDefault();
      const accessToken = localStorage.getItem('accessToken');
      try {
        const response = await axios.put(`http://127.0.0.1:5000/onvote/election/general_settings/${id}`, JSON.stringify(generalFormData), {
            headers: { 
              'Authorization': `Bearer ${accessToken}`, 
              'Content-Type': 'application/json'
            },
        });
        if (response.status === 201 && response.data.message) {
            alert(response.data.message)
            navigate(0);
        }
      } catch (err) {
          setError(`Failed to load: ${err.message || err}`);
      }
    }

    const handleDateSettingsSave = async (e) => {
      e.preventDefault();
      const accessToken = localStorage.getItem('accessToken');
      try {
        const response = await axios.put(`http://127.0.0.1:5000/onvote/election/election_dates/${id}`, JSON.stringify(dateFormData), {
            headers: { 
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
        });
        if (response.status === 201 && response.data.message) {
            alert(response.data.message);
            navigate(0);
        }
      } catch (err) {
          setError(`Failed to load: ${err.message || err}`);
      }
    }

    const handleElectionDelete = async (e) => {
      e.preventDefault();
      const accessToken = localStorage.getItem('accessToken');
      try {
        const response = await axios.delete(`http://127.0.0.1:5000/onvote/election/delete/${id}`, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        if (response.status === 201 && response.data.message) {
            alert(response.data.message)
            navigate('/dashboard');
        }
      } catch (err) {
          setError(`Failed to load: ${err.message || err}`);
      }
      
    }

    if (error) return <p>{error}</p>

    return (
    <div className="relative">
      <div className={`fixed left-0 top-0 w-[12rem] h-full shadow-md transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 lg:block`}>
        <Sidebar 
          id={id}
        />
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
            <div><IoMdSettings /></div>
            Settings
          </div>
          <div className="page-content mt-[2rem] flex flex-col items-center justify-center">
            <div className="general bg-white border w-[90%]">
              <div className="flex items-center gap-1 text-[1.2rem] px-[1rem] py-[0.5rem] border border-t-0 border-l-0 border-r-0"><IoMdSettings /> General Settings</div>
              <form action="" className="px-[1rem] py-[1rem]">
                <div className="form-group flex flex-col gap-1">
                  <label htmlFor="title" className="font-bold text-[0.8rem]">Title</label>
                  <input
                    type="text" 
                    name="title" 
                    onChange={handleGeneralChange}
                    className="px-[1rem] py-[0.5rem] rounded bg-[#f6f8fa] border-[#ced4da]" 
                    value={generalFormData.title || "Election name"} 
                  />
                </div>

                <div className="form-group flex flex-col gap-1 mt-[1rem]">
                  <label htmlFor="description" className="font-bold text-[0.8rem]">Description</label>
                  <textarea 
                    rows={10} 
                    name="description" 
                    onChange={handleGeneralChange}
                    value={generalFormData.description}
                    className="bg-[#f6f8fa] border-[#ced4da] px-[.5rem]" 
                    id=""></textarea>
                </div>
                <button 
                  type="submit" 
                  className="bg-[#2ecd10] text-[#fff] font-bold px-[1rem] py-[0.5rem] mt-[2rem] rounded"
                  onClick={handleGeneralSettingsSave}
                >
                  Save
                </button>
              </form>
            </div>
            <div className="dates mt-[1rem] bg-white border w-[90%]">
              <div className="flex items-center gap-1 text-[1.2rem] px-[1rem] py-[0.5rem] border border-t-0 border-l-0 border-r-0"><MdDateRange /> Election Dates</div>
              <form action="" className="px-[1rem] py-[1rem]">
                <div className="form-group flex flex-col gap-1">
                  <label htmlFor="start_date" className="font-bold text-[0.8rem]">Start Date</label>
                  <input 
                    type="datetime-local" 
                    name="start_date" 
                    className="px-[1rem] py-[0.5rem] rounded bg-[#f6f8fa] border-[#ced4da]" onChange={handleDateChange} defaultValue={electionDetails.start_date || "Election start_date"} 
                    
                  />
                </div>

                <div className="form-group flex flex-col gap-1 mt-[1rem]">
                  <label htmlFor="end_date" className="font-bold text-[0.8rem]">End Date</label>
                  <input type="datetime-local" name="end_date" className="px-[1rem] py-[0.5rem] rounded bg-[#f6f8fa] border-[#ced4da]" onChange={handleDateChange} defaultValue={electionDetails.end_date || "Election end_date"} />
                </div>
                <button 
                  type="submit" 
                  className="bg-[#2ecd10] text-[#fff] font-bold px-[1rem] py-[0.5rem] mt-[2rem] rounded"
                  onClick={handleDateSettingsSave}
                >
                  Save
                </button>
              </form>
            </div>
            <div className="delete mt-[1rem] bg-white border w-[90%]">
              <div className="flex items-center text-[#fff] bg-[#ff0000] gap-1 text-[1.2rem] px-[1rem] py-[0.5rem] border border-t-0 border-l-0 border-r-0">
                <RiDeleteBin6Line />
                Delete
              </div>
              <div className="px-[1rem] font-semibold py-[1rem] whitespace-normal overflow-hidden">
                Are you sure you want delete this election?
                This action is not reversible. Please contact support
                if you need to make a change to an election that has already launched.
              </div>
              <button 
                type="submit" 
                className="bg-[#ff0000] text-[#fff] font-bold px-[1rem] py-[0.5rem] mt-[2rem] ml-[1rem] mb-[1rem] rounded"
                onClick={handleElectionDelete}
              >
                Delete Election
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}
