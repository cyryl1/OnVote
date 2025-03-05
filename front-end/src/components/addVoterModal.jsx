// import React from 'react'
import { useState, useEffect } from "react";
import Modal from "react-modal";
import { HiQuestionMarkCircle } from "react-icons/hi";
import { CgDanger } from "react-icons/cg";
import { BsFillLightningChargeFill, BsLightningCharge } from "react-icons/bs";
import PropTypes from "prop-types";
import axios from 'axios';

Modal.setAppElement("#root"); //set app for accessibility


export default function AddVoterModal({ isOpen, onRequestClose, onSave, initialData, isEditMode }) {
    const [error, setError] = useState({});
    const [isvoterCredetials, setIsVoterCredentials] = useState(false);

    const initialState = {
        voter_name: '',
        voter_key: '',
        voter_password: '',
        voter_email: '',
    }
    const [formData, setFormData] = useState(initialState);

    useEffect(() => {
        console.log(initialData);
        if (isEditMode && initialData) {
            setFormData({
                voter_name: initialData.voter_name,
                voter_key: initialData.voter_key,
                voter_password: initialData.voter_password,
                voter_email: initialData.voter_email
            });
        } else {
            setFormData({
                voter_name: '',
                voter_key: '',
                voter_password: '',
                voter_email: '',
            })
        }
    }, [isEditMode, initialData])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
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
            setFormData(initialState);
            setIsVoterCredentials(false);
            // console.log(formData);
            // setFormData({name: "", voter_key: "", email: ""});
        }
        // // Save
        
    }

    const handleDeleteVoter = async () => {
        try {
            const response = await axios.delete(`http://127.0.0.1:5000/onvote/election/${initialData.election_id}/delete_voter/${initialData.voter_id}`)

            if (response.status === 200 && response.data.message) {
                alert(response.data.message);
                onRequestClose();
            }
        } catch(err) {
            // setError(`Error fetching voters: ${err.message || err}`)
            console.error(`Failed to load: ${err.message || err}`);
        }
    }


    const handleVoterCredential = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/onvote/get_voters_credentials`);

            if (response.status === 200 && response.data.message) {
                const credentials = {
                    voter_key: response.data.message.voter_key,
                    voter_password: response.data.message.voter_password
                }
                setIsVoterCredentials(true);

                setFormData((prevFormData) => ({
                    ...prevFormData,
                    voter_key: credentials.voter_key,
                    voter_password: credentials.voter_password
                }));
                console.log(response.data.message);
            }
        } catch (err) {
            console.error(`Error fetching voter credentials: ${err.message || err}`);
            // setError(`Error fetching voters: ${err.message || err}`);
        }
    }

    const validate = (form) => {
        const errors = {}
        if (!form.voter_name) {
            errors.voter_name = 'Title is required';
        }

        if (!form.voter_key) {
            errors.voter_key = "Voter's Id is required";
        }

        if (!form.voter_password) {
            errors.voter_password = "Voter's Key is required";
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
            className='modal mt-[.5rem] mb-[1rem] overflow-y-auto scrollbar-hide no-scrollbar w-[90%]'
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
                                <div className={`flex items-center gap-1 ${error.voter_key ? 'text-red-500' : ''}`}>
                                    <label htmlFor="voter_key" className={`text-[1rem] font-bold`}>Voter ID</label>
                                    {!error.voter_key && (<HiQuestionMarkCircle />)}
                                    {error.voter_key && (<CgDanger />)}
                                </div>
                                {/* <label htmlFor="voter-id" className={`text-[1rem] font-bold ${error.voter_key ? 'text-red-500' : ''}`}>Voter ID</label> */}
                                {error.voter_key && (
                                    <p className="text-red-600 text-[.8rem]">{error.voter_key}</p>
                                )}
                                <input 
                                    type="text" 
                                    name="voter_key" 
                                    value={formData.voter_key} 
                                    onChange={handleChange} 
                                    placeholder="Voter's ID" 
                                    className="bg-[#f6f8fa] border px-[.5rem] text-[.8rem] py-[.4rem] border-[#ced4da] rounded-sm" 
                                    disabled={isEditMode}
                                />
                            </div>
                            <div className="form-group flex flex-col gap-1 mt-[1rem] w-[40%]">
                                <div className={`flex items-center gap-1 ${error.voter_password ? 'text-red-500' : 'text-[#000]'}`}>
                                    <label htmlFor="voter_password" className={`text-[1rem] font-bold`}>Voter Key</label>
                                    {!error.voter_password && (<HiQuestionMarkCircle />)}
                                    {error.voter_password && (<CgDanger />)}
                                </div>
                                {/* <label htmlFor="voter-key" className={`text-[1rem] font-bold ${error.voter_password ? 'text-red-500' : ''}`}>Voter Key</label> */}
                                {error.voter_password && (
                                    <p className="text-red-600 text-[.8rem]">{error.voter_password}</p>
                                )}
                                <input 
                                    type="text" 
                                    name="voter_password" 
                                    value={formData.voter_password} 
                                    onChange={handleChange} 
                                    placeholder="Voter's Key" 
                                    className="bg-[#f6f8fa] border px-[.5rem] text-[.8rem] py-[.4rem] border-[#ced4da] rounded-sm" 
                                    disabled={isEditMode}
                                />
                            </div>
                        </div>
                        {!isEditMode ? (
                            <div className="mt-1 font-semibold text-[.9rem] flex items-center" onClick={handleVoterCredential}>
                                <span>{isvoterCredetials ? (<BsFillLightningChargeFill />) : (<BsLightningCharge />) }</span>
                                <span>Generate?</span>
                            </div>
                        ) : (<div></div>)}
                        

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

                        <div className='flex items-center justify-between'>
                            <div className="form-group mt-[2rem] flex gap-2">
                                <button type="submit" onClick={handleAddVoter} className="bg-[#2ecd10] text-white px-[1rem] py-[.5rem] rounded">{isEditMode ? 'Save' : 'Add Voter'}</button>
                                <button type="submit" onClick={onRequestClose} className="border py-[.5rem] px-[1rem] rounded">
                                    Close
                                </button>
                            </div>
                            <div className="mt-[2rem]">
                                <button
                                 className={`bg-red-500 text-white px-[1rem] py-[.5rem] rounded ${!isEditMode ? 'hidden' : 'block'}`}
                                 onClick={handleDeleteVoter}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    </>
  )
}

AddVoterModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    initialData: PropTypes.object,
    isEditMode: PropTypes.bool.isRequired
    // randomEnabled: PropTypes.bool.isRequired,
    // handleRandom: PropTypes.func.isRequired,
}
