// import { useState, useContext } from "react";
import { MdBallot } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { FaEllipsisH } from "react-icons/fa";
import OptionModal from "../components/optionModal";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { GrClear } from "react-icons/gr";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoCheckmarkCircleSharp } from "react-icons/io5";

export default function Ballot() {
    // const { electionDetails } = useContext(TokenContext);

    const [isOpen, setIsOpen] = useState(false);
    const [ballotDropdown, setBallotDropdown] = useState(false);
    const [questionDropdown, setQuestionDropdown] = useState(false);
    const [options, setOptions] = useState(false);
    // const [counter, setCounter] = useState(0);
    

    const handleSave = (form) => {
        console.log(form);
        setOptions(true);
        // setCounter(counter + 1);
        // if (form) {
        //     setOptions({counter: {
        //         optionTitle: form.optionTitle,
        //         description: form.description,
        //         image: form.image
        //     } })
        // }
    }

    const handleAddOption = () => {
        setIsOpen(true);
    }

    const handleBallotDropdown = () => {
        setBallotDropdown(!ballotDropdown);
    }

    const handleQuestionDropdown = () => {
        setQuestionDropdown(!questionDropdown);
    }

    return (
        <>
            <div className="relative">
                <div className="whitespace-nowrap">
                    <div className=" page-header lg:flex lg:justify-between sticky top-[3rem] px-[1rem] py-[.5rem] bg-[#fff]  border border-r-0 border-l-0 border-t-0 ">
                        <div className="flex items-center gap-2 text-[1.2rem]">
                            <div className="text-[1.5rem]"><MdBallot /></div>
                            <div className="text-[1.3rem]">Ballot</div>
                        </div>
                        <div className="flex items-center justify-between lg:justify-normal lg:gap-2 mt-[.5rem]">
                            <div className="flex gap-1">
                                <button className="border border-[#0bacfa] text-[#0bacfa] text-[.9rem] px-[.5rem] py-[0.3rem] rounded">Import</button>
                                <button className="text-[#fff] border border-[#2ecd10] bg-[#2ecd10] px-[.5rem] py-[0.3rem] rounded">Add Question</button>
                            </div>
                            <button onClick={handleBallotDropdown} className="flex items-center justify-center px-[1rem] py-[.3rem] rounded bg-[#e3e7ea] border border-[#e3e7ea] font-bold text-[1.3rem]"><FaEllipsisH /></button>
                            <div className={`mt-[.3rem] border  flex flex-col gap-3 px-[1rem] py-[.5rem] right-4 shadow absolute top-[5rem] bg-white ${ballotDropdown ? 'block' : 'hidden'}`}>
                                <div>Clear Ballot</div>
                                <div>Export Ballot</div>
                            </div>
                        </div>
                        
                    </div>
                    <div className="whitespace-normal bg-[#fff] mt-[.5rem] lg:mt-[1rem] rounded border w-[90%] lg:w-[60%] m-auto">
                        <div className=" bg-[#f3f6f8] px-[1rem] border border-[#dee2e6] border-t-0 border-l-0 border-r-0">
                            <div className="flex justify-between py-[.5rem]">
                                <h1 className="text-[1.5rem] font-bold">Ballot Name</h1>
                                <button className="bg-[#e3e7ea] px-[.5rem] py-[.7rem] rounded" onClick={handleQuestionDropdown}><FaEllipsisH /></button>

                                <div className={`mt-[.3rem] border top-[9rem] left-[17.813rem] flex flex-col gap-3 px-[1rem] py-[.5rem] shadow absolute  bg-white ${questionDropdown ? 'block' : 'hidden'}`}>
                                    <div className="flex items-center gap-3">
                                        <FaEdit />
                                        Edit
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <GrClear />
                                        Clear
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <RiDeleteBin6Line />
                                        Delete
                                    </div>
                                </div>
                            </div>
                            <div className="mt-[1rem] rounded px-[1rem] py-[.5rem] bg-[#fff] border border-[#dee2e6] -mb-px w-fit border-b-[#fff]">Options</div>
                        </div>
                        <div className="w-[90%] m-auto  py-[1rem]">
                            {!options && (
                                <div className=" bg-[#ecf9ff] text-[#076796] rounded px-[1.25rem] py-[.75rem] text-[1.1rem] border border-[#c1eafe]">
                                    Click the &quot;Add Options&quot; button below to add an options to this ballot
                                </div>
                            )}

                            {options && (
                                <div className="option flex items-center justify-between bg-[#f3f6f8] px-[1rem] py-[.5rem] rounded">
                                    <div className="flex items-center gap-2">
                                        <IoCheckmarkCircleSharp />
                                        {'Options'}
                                    </div>
                                    <button></button>
                                    <FaEllipsisH />
                                </div>
                            )}
                            
                        
                            <button onClick={handleAddOption} className="mt-[1rem] w-fit text-white font-semibold flex items-center gap-1 border-[#2ecd10] bg-[#2ecd10] px-[.5rem] py-[0.3rem] rounded">
                                <IoMdAdd />
                                Add Option
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <OptionModal
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                onSave={handleSave}
             />
        </>
    )
}
