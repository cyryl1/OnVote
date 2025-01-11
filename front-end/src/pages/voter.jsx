// import React from 'react'
import { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import { FaEllipsisH } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
import { TiExport } from "react-icons/ti";

export default function Voter({ form, onOpenModal }) {

  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  // const [tableData, setTableData] = useState(false);
  // const [filteredVoters, setFilteredVoters] = useState(voters);

  // const searchVoters = (query) => {
  //   if (!query.trim()) {
  //     setFilteredVoters(voters);
  //     return;
  //   }

  //   const searchParamter = ["name", "voter_id", "email"];
  //   const lowercasedQuery = query.toLowerCase();

  //   const results = voters.filter((voter) => 
  //     searchParamter.some((parameter) =>
  //       voter[parameter].toString().toLowerCase().includes(lowercasedQuery)
  //     )
  //   );
  //   setFilteredVoters(results);
  // };

  // useEffect(() => {
  //   searchVoters(query);
  // }, [query, voters]);

  const handleDropdown = () => {
    setDropDown(!dropDown);
  }

  const fetchData = async () => {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/users");
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const search_parameter = Object.keys(Object.assign({}, ...data));

  const search = (data) => {
    return data.filter((data) => 
      search_parameter.some((parameter) => 
        data[parameter].toString().toLowerCase().includes(query)
      )
    );
  };

  // const displayedData = isSearch && query.trim() ? search(data) : data;


  return (
    <div>
      <div className="px-[1rem] py-[.5rem] border border-l-0 border-r-0 border-t-0">
        <div className="flex items-center gap-2 text-[1.2rem]">
          <FaUsers />
          <p>Voters (<span>{1}</span>)</p>
        </div>
        <div className="mt-[.5rem] flex items-center justify-between">
          <div className="flex gap-3">
            <button className="text-[#0BACFA] border border-[#0BACFA] px-[.5rem] py-[.2rem] rounded ">Import</button>
            <button className="text-[#fff] bg-[#2ECD10] px-[.5rem] rounded" onClick={onOpenModal}>Add Voter</button>
          </div>
          <button className="sticky top-[3rem] bg-[#E3E7EA] rounded px-[.7rem] py-[.5rem]" onClick={handleDropdown}><FaEllipsisH /></button>
          <div className={`mt-[.3rem] border top-[8.2rem] left-[11.913rem] flex flex-col shadow absolute  bg-white ${dropDown ? 'block' : 'hidden'}`}>
            <p className="flex items-center gap-3 border border-t-0 border-l-0 border-r-0 px-[1rem] py-[.5rem]">
              <TiExport />
              Export Voters
            </p>
            <p className="px-[1rem] py-[.5rem]">Delete All Voters</p>
          </div>
        </div>
      </div>
      <div className="page-content w-[90%] m-auto">
        <div className="flex items-center w-[100%] mt-[1rem]" onClick={() => setIsSearch(!isSearch)}>
          <div className="form-group w-[100%]">
            <input type="search" name="search-form" value={query} onChange={(e) => setQuery(e.target.value)} className="w-[100%] border px-[.5rem] py-[.3rem]" placeholder="Search..." />
          </div>
          <button className="border px-[.5rem] py-[.5rem]" type="submit">
            <IoSearchSharp />
          </button>
        </div>
        <div className="table mt-[1rem] w-[100%] overflow-x-auto ">
          <table className="w-[100%] whitespace-nowrap">
            <thead>
              <tr className="bg-[#1c2a39] text-[#fff] text-[.8rem]">
                <th className="text-left px-4 py-2 max-w-[4rem] overflow-hidden text-ellipsis whitespace-nowrap">NAME</th>
                <th className="text-left px-4 py-2 max-w-[4rem] overflow-hidden text-ellipsis whitespace-nowrap">VOTER ID</th>
                <th className="text-left px-4 py-2 max-w-[4rem] overflow-hidden text-ellipsis whitespace-nowrap">EMAIL</th>
              </tr>
            </thead>

            <tbody className="border">
              <tr>
                <td className="px-4 py-2 max-w-[6rem] overflow-hidden text-ellipsis whitespace-nowrap">{form.voter_name}</td>
                <td className="px-4 py-2 max-w-[4rem] overflow-hidden text-ellipsis whitespace-nowrap">{form.voter_id}</td>
                <td className="px-4 py-2 max-w-[4rem] overflow-hidden text-ellipsis whitespace-nowrap">{form.voter_email}</td>
              </tr>
              {/* {filteredVoters.length > 0 ? (
                filteredVoters.map((voter, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 max-w-[6rem] overflow-hidden text-ellipsis whitespace-nowrap">{voter.name || 'Praise'}</td>
                    <td className="px-4 py-2 max-w-[4rem] overflow-hidden text-ellipsis whitespace-nowrap">{voter.voter_id || '1234'}</td>
                    <td className="px-4 py-2 max-w-[4rem] overflow-hidden text-ellipsis whitespace-nowrap">{voter.email || 'aribisala@gmail.com'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4">No results found</td>
                </tr>
              )} */}
              {/* {!isSearch && (
                <tr>
                  <td className="px-4 py-2 max-w-[6rem] overflow-hidden text-ellipsis whitespace-nowrap">{form.voter_name}</td>
                  <td className="px-4 py-2 max-w-[4rem] overflow-hidden text-ellipsis whitespace-nowrap">{form.voter_id}</td>
                  <td className="px-4 py-2 max-w-[4rem] overflow-hidden text-ellipsis whitespace-nowrap">{form.voter_email}</td>
                </tr>

              )}
              {isSearch && (
                <tr>
                  <td className="px-4 py-2 max-w-[2rem] overflow-hidden text-ellipsis whitespace-nowrap">{item.name || 'Praise'}</td>
                  <td className="px-4 py-2 max-w-[2rem] overflow-hidden text-ellipsis whitespace-nowrap">{item.voter_id || '1234'}</td>
                  <td className="px-4 py-2 max-w-[2rem] overflow-hidden text-ellipsis whitespace-nowrap">{item.email || 'aribisala@gmail.com'}</td>
                </tr>
              )} */}
            </tbody>
          </table>
          <div className="px-4 py-2 border border-t-0">
            <p>1 Voters</p>
          </div>
        </div>
      </div>
    </div>
  )
}
