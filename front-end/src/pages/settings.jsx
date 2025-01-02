import { useState, useContext } from "react";
import Sidebar from "../components/sidebar";
import { GiHamburgerMenu } from "react-icons/gi";
import { TokenContext } from "../context/AuthContext";
import { IoMdSettings } from "react-icons/io";
import { MdDateRange } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
// import { Navigate } from "react-router-dom";


export default function Settings() {
    const [isOpen, setIsOpen] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const { electionDetails } = useContext(TokenContext);
    const [settings, setSettings] = useState(null);
    // const navigate = Navigate();
    

    const handleButtonChange = () => {
        setIsOpen(!isOpen);
        setIsActive(!isActive);
    }

    const [generalFormData, setGeneralFormData] = useState({
      title: '',
      description: '',
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

    const handleSaveSettings = (e) => {
      e.preventDefault();
      if (settings === 'general') {
        // Save general settings here
      }
      if (settings === 'date') {
        // Save date settings here
      }

      if (settings === 'delete') {
        // Delete election here
        // navigate('/overview');
      }
    }

    return (
    <div className="relative">
      <div className={`fixed left-0 top-0 w-[12rem] h-full shadow-md transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 lg:block`}><Sidebar /></div>
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
          <div className=" font-bold px-[1rem] py-[1rem]">{electionDetails.title || "Election Name"}</div>
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
                    defaultValue={electionDetails.title || "Election name"} 
                  />
                </div>

                <div className="form-group flex flex-col gap-1 mt-[1rem]">
                  <label htmlFor="description" className="font-bold text-[0.8rem]">Description</label>
                  <textarea 
                    rows={10} 
                    name="description" 
                    onChange={handleGeneralChange}
                    className="bg-[#f6f8fa] border-[#ced4da]" 
                    id=""></textarea>
                </div>
                <button 
                  type="submit" 
                  className="bg-[#2ecd10] text-[#fff] font-bold px-[1rem] py-[0.5rem] mt-[2rem] rounded"
                  onClick={() => {
                    setSettings('general');
                    handleSaveSettings;
                  }}
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
                  <input type="datetime-local" name="start_date" className="px-[1rem] py-[0.5rem] rounded bg-[#f6f8fa] border-[#ced4da]" onChange={handleDateChange} defaultValue={electionDetails.start_date || "Election start_date"} />
                </div>

                <div className="form-group flex flex-col gap-1 mt-[1rem]">
                  <label htmlFor="end_date" className="font-bold text-[0.8rem]">End Date</label>
                  <input type="datetime-local" name="end_date" className="px-[1rem] py-[0.5rem] rounded bg-[#f6f8fa] border-[#ced4da]" onChange={handleDateChange} defaultValue={electionDetails.end_date || "Election end_date"} />
                </div>
                <button 
                  type="submit" 
                  className="bg-[#2ecd10] text-[#fff] font-bold px-[1rem] py-[0.5rem] mt-[2rem] rounded"
                  onClick={() => {
                    setSettings('date');
                    handleSaveSettings;
                  }}
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
                onClick={() => {
                  setSettings('delete');
                  handleSaveSettings;
                }}
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
