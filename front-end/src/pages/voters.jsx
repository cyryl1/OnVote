import { useState, useContext } from "react";
import Sidebar from "../components/sidebar";
import { GiHamburgerMenu } from "react-icons/gi";
import { TokenContext } from "../context/AuthContext";

export default function Settings() {
    const [isOpen, setIsOpen] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const { electionDetails } = useContext(TokenContext);
    

    const handleButtonChange = () => {
        setIsOpen(!isOpen);
        setIsActive(!isActive);
    }

    return (
    <div className="relative">
        <div className={`fixed left-0 top-0 w-[12rem] h-full shadow-md transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 lg:block`}><Sidebar /></div>
        <div className={`whitespace-nowrap duration-300 ease-in-out ${isOpen ? "ml-[12rem]": "ml-0"} md:ml-[12rem]`}>
            <div className={`flex whitespace-nowrap w-[100%] gap-[0.2rem] items-center border border-l-0 border-r-0 border-t-0 `}>
                <div className={`flex lg:hidden justify-center items-center w-[5%] px-[1.5rem] py-[1rem] border border-l-0 border-t-0 border-b-0 ${isActive ? 'bg-[#f2f2f2]' : 'bg-[#f6f8fa]'}`}>
                    <button 
                        onClick={handleButtonChange}
                        className={``}
                    >
                        <GiHamburgerMenu />
                    </button>
                </div>
                <div className="font-bold px-[1rem] py-[1rem]">{electionDetails.title || "Election Name"}</div>
            </div>
            <div className="whitespace-nowrap">Hi</div>
        </div>
        
    </div>
    )
}
