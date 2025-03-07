// import React from 'react'
// import { useEffect, useState } from "react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FaUsers } from "react-icons/fa";
import { FaEllipsisH } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
import { TiExport } from "react-icons/ti";
import PropTypes from "prop-types";
import axios from 'axios';
import LoadingModal from '../components/loadingModal';

export default function Voter({ form, addVoter, onEditVoter }) {

  // const [data, setData] = useState([]);
  // const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [isSearch, setIsSearch] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredVoters = form.filter((voter) => 
    `${voter.voter_name} ${voter.voter_key} ${voter.voter_email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleDropdown = () => {
    setDropDown(!dropDown);
  }

  const handleAdd = () => {
    addVoter(true);
  }

  const handleDeleteAllVoters = async () => {
    try {
      setIsLoading(true);
        const response = await axios.delete(`http://127.0.0.1:5000/onvote/election/${filteredVoters[0].election_id}/delete_voters`)

        if (response.status === 200 && response.data.message) {
            alert(response.data.message);
            navigate(0)
        }
    } catch(err) {
      if (err.response.status === 401 && err.response.data.status === "token_expired") {
        navigate('/token_refresh');
      } else {
          console.error(`Failed to load: ${err.message || err}`);
      }
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <>
      <div>
        <div className="px-[1rem] py-[.5rem] border border-l-0 border-r-0 border-t-0">
          <div className="flex items-center gap-2 text-[1.2rem]">
            <FaUsers />
            <p>Voters (<span>{filteredVoters.length}</span>)</p>
          </div>
          <div className="mt-[.5rem] flex items-center justify-between">
            <div className="flex gap-3">
              <button className="text-[#0BACFA] border border-[#0BACFA] px-[.5rem] py-[.2rem] rounded ">Import</button>
              <button className="text-[#fff] bg-[#2ECD10] px-[.5rem] rounded" onClick={handleAdd}>Add Voter</button>
            </div>
            <button className="sticky top-[3rem] bg-[#E3E7EA] rounded px-[.7rem] py-[.5rem]" onClick={handleDropdown}><FaEllipsisH /></button>
            <div className={`mt-[.3rem] border top-[8.2rem] left-[11.913rem] flex flex-col shadow absolute  bg-white ${dropDown ? 'block' : 'hidden'}`}>
              <p className="flex items-center gap-3 border border-t-0 border-l-0 border-r-0 px-[1rem] py-[.5rem]">
                <TiExport />
                Export Voters
              </p>
              <p 
                className="px-[1rem] py-[.5rem]"
                onClick={handleDeleteAllVoters}
              >
                Delete All Voters
              </p>
            </div>
          </div>
        </div>
        <div className="page-content w-[90%] m-auto">
          <div className="flex items-center w-[100%] mt-[1rem]" onClick={() => setIsSearch(!isSearch)}>
            <div className="form-group w-[100%]">
              <input 
                type="search" 
                name="search-form" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-[100%] border px-[.5rem] py-[.3rem]" placeholder="Search..." 
              />
            </div>
            <button className="border px-[.5rem] py-[.5rem]" type="submit">
              <IoSearchSharp />
            </button>
          </div>
          <div className="table mt-[1rem] w-[100%] ">
            <div className="overflow-x-auto ">
              <div className="w-max min-w-full">
                <table className="whitespace-nowrap w-full">
                  <thead>
                    <tr className="bg-[#1c2a39] text-[#fff] text-[.8rem]">
                      <th className="text-left px-4 py-2">NAME</th>
                      <th className="text-left px-4 py-2">VOTER KEY</th>
                      <th className="text-left px-4 py-2">EMAIL</th>
                    </tr>
                  </thead>

                  <tbody className="border">
                    {filteredVoters.length > 0 ? (
                      filteredVoters.map((item, index) => (
                        <tr key={index} className="text-[.9rem] cursor-pointer hover:bg-yellow-100 transition-colors duration-300" onClick={() => onEditVoter(item)}>
                          <td className="px-4 py-2">{item.voter_name}</td>
                          <td className="px-4 py-2">{item.voter_key}</td>
                          <td className="px-4 py-2">{item.voter_email}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center py-4">
                          No results found
                        </td>
                      </tr>
                    )
                  }
                  </tbody>
                </table>
                <div className="px-4 py-2 border border-t-0">
                  <p>{filteredVoters.length} Voter(s)</p>
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

Voter.propTypes = {
  form: PropTypes.array.isRequired,
  addVoter: PropTypes.func.isRequired,
  onEditVoter: PropTypes.func.isRequired
};
