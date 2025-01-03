// import { useState, useContext } from "react";
import { MdBallot } from "react-icons/md";

export default function Ballot() {
    // const { electionDetails } = useContext(TokenContext);


    return (
        <div className="relative">
            <div className="whitespace-nowrap">
                <div className="page-header lg:flex lg:justify-between sticky top-[3rem] px-[1rem] py-[.5rem] bg-[#fff]  border border-r-0 border-l-0 border-t-0 ">
                    <div className="flex items-center gap-2 text-[1.2rem]">
                        <div className="text-[1.5rem]"><MdBallot /></div>
                        <div className="text-[1.3rem]">Ballot</div>
                    </div>
                    <div className="flex items-center justify-between lg:justify-normal lg:gap-2 mt-[.5rem]">
                        <div className="flex gap-1">
                            <button className="border border-[#0bacfa] text-[#0bacfa] text-[.9rem] px-[.5rem] py-[0.3rem] rounded">Import</button>
                            <button className="text-[#fff] border border-[#2ecd10] bg-[#2ecd10] px-[.5rem] py-[0.3rem] rounded">Add Question</button>
                        </div>
                        <button className=" flex items-center justify-center px-[1rem] py-[.3rem] rounded bg-[#e3e7ea] border border-[#e3e7ea] font-bold">...</button>
                    </div>
                </div>
                <div>
                    <div>
                       <h1>Ballot Name</h1>
                       <button>...</button>
                    </div>
                </div>
            </div>
        </div> 
    )
}
