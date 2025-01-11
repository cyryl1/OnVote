// import React from 'react'
import { useState } from "react";
import Modal from "react-modal";
import { HiQuestionMarkCircle } from "react-icons/hi";
import { CgDanger } from "react-icons/cg";

Modal.setAppElement("#root"); //set app for accessibility


export default function AddVoterModal({ isOpen, onRequestClose, onSave }) {
    const [error, setError] = useState({});

    const [formData, setFormData] = useState({
        voter_name: '',
        voter_id: '',
        voter_key: '',
        voter_email: '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value});
    }


    const handleAddVoter = (e) => {
        e.preventDefault();
        setError({});
        // // handleBallotSave
        const newErrors = validate(formData);
        setError(newErrors);
        
        if (Object.keys(newErrors).length === 0) {
            onSave(formData);
            onRequestClose();
            console.log(formData);
            // setFormData({name: "", voter_id: "", email: ""});
        }
        // // Save
        
    }

    const validate = (form) => {
        const errors = {}
        if (!form.voter_name) {
            errors.voter_name = 'Title is required';
        }

        if (!form.voter_id) {
            errors.voter_id = "Voter's Id is required";
        }

        if (!form.voter_key) {
            errors.voter_key = "Voter's Key is required";
        }

        if (!form.voter_email) {
            errors.voter_email = "Voter's email is required";
        } else if (!/^\S+@\S+\.\S+$/i.test(form.voter_email)) {
            errors.voter_email = 'Invalid email address;'
        }


        return errors;
    }

    // const handleRandom = (state) => {
    //     setRandomEnabled(state);
    //     console.log(randomEnabled);
    // }

    if (!isOpen) return null;
  return (
    <>
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Add Voter"
            className='modal mt-[.5rem] mb-[1rem] overflow-y-auto scrollbar-hide no-scrollbar'
            overlayClassName={`overlay bg-[#000] fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center ${isOpen ? 'backdrop-blur-sm opacity-[.95]' : ''}`}
        >
            <div className="bg-[#fff] w-[80%] m-auto z-99">
                <div className="flex justify-between px-[2rem] py-[1rem] bg-[#0bacfa]">
                    <div className="text-[1.5rem] text-[#fff] font-semibold">Add Voter</div>
                    <div className="text-[1rem] text-[#fff] font-bold" onClick={onRequestClose}>X</div>
                </div>
                <div className="px-[1rem] py-[1rem]">
                    <form action="">
                        <div className="form-group mt-[1rem] flex flex-col gap-1">
                            <div className={`flex items-center gap-1 ${error.voter_name ? 'text-red-500' : 'text-[#000]'}`}>
                                <label htmlFor="voter_name" className={`text-[1rem] font-bold`}>Name</label>
                                {!error.voter_name && (<HiQuestionMarkCircle />)}
                                {error.voter_name && (<CgDanger />)}
                            </div>
                            {error.voter_name && (
                                <p className="text-red-600 text-[.8rem]">{error.voter_name}</p>
                            )}
                            <input type="text" onChange={handleChange} value={formData.voter_name} placeholder="Voter's Name" name="voter_name" className="bg-[#f6f8fa] border px-[.5rem] text-[1.1rem] py-[.4rem] border-[#ced4da] rounded-sm" />
                        </div>
                        <div className="flex whitespace-normal justify-between">
                            <div className="form-group flex flex-col gap-1 mt-[1rem] w-[40%]">
                                <div className={`flex items-center gap-1 ${error.voter_id ? 'text-red-500' : ''}`}>
                                    <label htmlFor="voter_id" className={`text-[1rem] font-bold`}>Voter ID</label>
                                    {!error.voter_id && (<HiQuestionMarkCircle />)}
                                    {error.voter_id && (<CgDanger />)}
                                </div>
                                {/* <label htmlFor="voter-id" className={`text-[1rem] font-bold ${error.voter_id ? 'text-red-500' : ''}`}>Voter ID</label> */}
                                {error.voter_id && (
                                    <p className="text-red-600 text-[.8rem]">{error.voter_id}</p>
                                )}
                                <input type="text" name="voter_id" value={formData.voter_id} onChange={handleChange} placeholder="Voter's ID" className="bg-[#f6f8fa] border px-[.5rem] text-[1.1rem] py-[.4rem] border-[#ced4da] rounded-sm"></input>
                            </div>
                            <div className="form-group flex flex-col gap-1 mt-[1rem] w-[40%]">
                                <div className={`flex items-center gap-1 ${error.voter_key ? 'text-red-500' : 'text-[#000]'}`}>
                                    <label htmlFor="voter_key" className={`text-[1rem] font-bold`}>Voter Key</label>
                                    {!error.voter_key && (<HiQuestionMarkCircle />)}
                                    {error.voter_key && (<CgDanger />)}
                                </div>
                                {/* <label htmlFor="voter-key" className={`text-[1rem] font-bold ${error.voter_key ? 'text-red-500' : ''}`}>Voter Key</label> */}
                                {error.voter_key && (
                                    <p className="text-red-600 text-[.8rem]">{error.voter_key}</p>
                                )}
                                <input type="text" name="voter_key" value={formData.voter_key} onChange={handleChange} placeholder="Voter's Key" className="bg-[#f6f8fa] border px-[.5rem] text-[1.1rem] py-[.4rem] border-[#ced4da] rounded-sm"></input>
                            </div>
                        </div>

                        <div className="form-group border-[#ced4da] flex flex-col gap-1 mt-[1rem]">
                            <div className={`flex items-center gap-1 ${error.voter_email ? 'text-red-500' : 'text-[#000]'}`}>
                                <label htmlFor="voter_email" className={`text-[1rem] font-bold`}>Voter Email</label>
                                {!error.voter_email && (<HiQuestionMarkCircle />)}
                                {error.voter_email && (<CgDanger />)}
                            </div>
                            {/* <label htmlFor="voter_email" className={`text-[.8rem] font-bold ${error.voter_email ? 'text-red-500' : ''}`}>Email Address</label> */}
                            {error.voter_email && (
                                <p className="text-red-600 text-[.8rem]">{error.voter_email}</p>
                            )}
                            <input type="text" name="voter_email" value={formData.voter_email} onChange={handleChange} placeholder="Voter's Email Address" className="bg-[#f6f8fa] border px-[.5rem] text-[1.1rem] py-[.4rem] border-[#ced4da] rounded-sm" />
                        </div>

                        <div className="form-group mt-[2rem] flex gap-2">
                            <button type="submit" onClick={handleAddVoter} className="bg-[#2ecd10] text-white px-[1rem] py-[.5rem] rounded">Add Voter</button>
                            <button type="submit" onClick={onRequestClose} className="border py-[.5rem] px-[1rem] rounded">
                                Close
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    </>
  )
}
