// import React from 'react'
import { useState } from "react";
import Modal from "react-modal";
import ToggleSwitch from "./toggleSwitch";
import { RiDeleteBinFill } from "react-icons/ri";
import BallotDeleteModal from "./ballotDeleteModal";
import PropTypes from "prop-types";
// import axios from 'axios';

Modal.setAppElement("#root"); //set app for accessibility


export default function AddBallotModal({ isOpen, onRequestClose, onSave}) {
    const [randomEnabled, setRandomEnabled] = useState(false);
    const [formError, setFormError] = useState({});
    // const [error, setError] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        ballotTitle: 'Ballot Title',
        description: '',
        random: '',
    })

    // const [ballotId, setBallotId] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value});
    }

    


    const handleBallotSave = (e) => {
        e.preventDefault();
        // // handleBallotSave
        const newErrors = validate(formData);
        setFormError(newErrors);
        
        if (Object.keys(newErrors).length === 0) {
            if (randomEnabled) {
                formData.random = 'on';
            } else {
                formData.random = 'off';
            }
            onSave(formData);
            onRequestClose();
            console.log(formData);
            
        }
        // // Save
        
    }

    const validate = (form) => {
        const errors = {}
        if (!form.ballotTitle) {
            errors.ballotTitle = 'Title is required';
        }

        return errors;
    }


    const handleDeleteModal = (e) => {
        e.preventDefault();
        // e.stopPropagation();
        setIsDeleteModalOpen(true);
        // handleDelete
        // Delete
    }

    const handleBallotDelete = () => {
        // Handle delete
    }

    // const handleRandom = (state) => {
    //     setRandomEnabled(state);
    //     console.log(randomEnabled);
    // }

    if (!isOpen) return null;
    // if (error) return <p>{error}</p>
  return (
    <>
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Edit Ballot Question"
            className='modal mt-[1rem] mb-[1rem] overflow-y-auto scrollbar-hide no-scrollbar'
            overlayClassName={`overlay bg-[#000] fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center ${isOpen ? 'backdrop-blur-sm opacity-[.95]' : ''}`}
        >
            <div className="bg-[#fff] w-[90%] m-auto z-99">
                <div className="flex justify-between px-[2rem] py-[1rem] bg-[#0bacfa]">
                    <div className="text-[1.5rem] text-[#fff] font-semibold">Edit Ballot</div>
                    <div className="text-[1rem] text-[#fff] font-bold" onClick={onRequestClose}>X</div>
                </div>
                <div className="px-[2rem] py-[1.5rem]">
                    <form action="">
                        <div className="form-group text-[1.2rem]">
                            <p>Voters can select only one option</p>
                        </div>
                        <div className="form-group mt-[1rem] flex flex-col gap-1">
                            {formError.ballotTitle && (
                                <p className="text-red-600">{formError.ballotTitle}</p>
                            )}
                            <label htmlFor="ballotTitle" className="text-[1rem] font-bold">Title</label>
                            <input type="text" onChange={handleChange} value={formData.ballotTitle} name="ballotTitle" className="bg-[#f6f8fa] border px-[.5rem] text-[1.1rem] py-[.4rem] border-[#ced4da] rounded-sm" />
                        </div>
                        <div className="form-group flex flex-col gap-1 mt-[1rem]">
                            <label htmlFor="description" className="text-[1rem] font-bold">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} className="bg-[#f6f8fa] border px-[.5rem] text-[1.1rem] py-[.4rem] border-[#ced4da] rounded-sm" rows={10} id=""></textarea>
                        </div>

                        <div className="form-group border border-[#ced4da] mt-[2rem] px-[1rem] py-[1rem]">
                            <label htmlFor="" className="text-[.8rem] font-bold">Randomize options?</label>
                            <p>Randomly sorts the list of options on the ballot for each voter</p>
                            <div className="flex justify-between">
                                <div></div>
                                <ToggleSwitch 
                                    enabled={randomEnabled}
                                    onChange={() => {setRandomEnabled(!randomEnabled); console.log(randomEnabled)}}
                                />
                            </div>
                        </div>

                        <div className="form-group mt-[2rem] flex justify-between">
                            <button type="submit" onClick={handleBallotSave} className="bg-[#2ecd10] text-white px-[1rem] py-[.5rem] rounded">Save</button>
                            <button type="submit" onClick={handleDeleteModal} className="bg-[#ff0000] text-white flex items-center gap-2 py-[.5rem] px-[1rem] rounded">
                                <RiDeleteBinFill />
                                Delete
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
        <BallotDeleteModal 
            isOpen={isDeleteModalOpen} 
            onRequestClose={() => setIsDeleteModalOpen(false)}
            onDelete={handleBallotDelete}
        />
    </>
  )
}

AddBallotModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
}
