// import React from 'react'
import { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import { FaEllipsisH } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";

export default function Voter({ form }) {

  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [isSearch, setIsSearch] = useState(false);

  const fetchData = () => {
    return fetch("https://jsonplaceholder.typicode.com/users")
     .then((res) => res.json())
     .then((data) => setData(data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const search_parameter = Object.keys(Object.assign({}, ...data));

  function search(data) {
    return data.filter((data) => 
      search_parameter.some((parameter) => 
        data[parameter].toString().toLowerCase().includes(query)
      )
    );
  }


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
            <button className="text-[#fff] bg-[#2ECD10] px-[.5rem] rounded">Add Voter</button>
          </div>
          <button  className="sticky top-[3rem] bg-[#E3E7EA] rounded px-[.7rem] py-[.5rem]"><FaEllipsisH /></button>
        </div>
      </div>
      <div className="page-content w-[90%] m-auto">
        <div className="flex items-center w-[100%] mt-[1rem]" onClick={() => setIsSearch(!isSearch)}>
          <div className="form-group w-[100%]">
            <input type="search" name="search-form" onChange={(e) => setQuery(e.target.value)} className="w-[100%] border px-[.5rem] py-[.3rem]" placeholder="Search..." />
          </div>
          <button className="border px-[.5rem] py-[.5rem]" type="submit">
            <IoSearchSharp />
          </button>
        </div>
        <div className="table mt-[1rem] w-[100%] overflow-x-auto ">
          <table className="w-[100%] whitespace-nowrap">
            <thead>
              <tr className="bg-[#1c2a39] text-[#fff] text-[.8rem]">
                <th className="text-left px-4 py-2">NAME</th>
                <th className="text-left px-4 py-2">VOTER ID</th>
                <th className="text-left px-4 py-2">EMAIL</th>
              </tr>
            </thead>

            <tbody>
              {!isSearch && (
                <tr>
                  <td className="px-4 py-2">{form.voter_name}</td>
                  <td className="px-4 py-2">{form.voter_id}</td>
                  <td className="px-4 py-2">{form.voter_email}</td>
                </tr>
              )}
              {isSearch && (
                search(data).map((item) => (
                  <tr key={item.name}>
                    <td className="px-4 py-2">{item.name || 'Praise'}</td>
                    <td className="px-4 py-2">{item.voter_id || '1234'}</td>
                    <td className="px-4 py-2">{item.email || 'aribisala@gmail.com'}</td>
                  </tr>
                ))
              )}
            </tbody>
            
            
            
          </table>
        </div>
      </div>
    </div>
  )
}
