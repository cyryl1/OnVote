// import React from 'react'
import { useState } from "react";
import Modal from "react-modal";
import ToggleSwitch from "./toggleSwitch";

Modal.setAppElement("#root"); //set app for accessibility


export default function AddBallotModal({ isOpen, onRequestClose, onSave }) {
    const [randomEnabled, setRandomEnabled] = useState(false);

    if (!isOpen) return null;
  return (
    <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Edit Ballot Question"
        className='modal mt-[1rem] mb-[1rem] overflow-y-auto scrollbar-hide'
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
                        <label htmlFor="ballotTitle" className="text-[1rem] font-bold">Title</label>
                        <input type="text" name="ballotTitle" className="bg-[#f6f8fa] border px-[.5rem] text-[1.1rem] py-[.4rem] border-[#ced4da] rounded-sm"  defaultValue={'Ballot Title'}/>
                    </div>
                    <div className="form-group flex flex-col gap-1 mt-[1rem]">
                        <label htmlFor="description" className="text-[1rem] font-bold">Description</label>
                        <textarea name="description" className="bg-[#f6f8fa] border px-[.5rem] text-[1.1rem] py-[.4rem] border-[#ced4da] rounded-sm" rows={10} id=""></textarea>
                    </div>

                    <div className="form-group border border-[#ced4da] mt-[2rem] px-[1rem] py-[1rem]">
                        <label htmlFor="" className="text-[.8rem] font-bold">Randomize options?</label>
                        <p>Randomly sorts the list of options on the ballot for each voter</p>
                        <div className="flex justify-between">
                            <div></div>
                            <ToggleSwitch 
                                enabled={randomEnabled}
                                onChange={() => setRandomEnabled(!randomEnabled)}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </Modal>
  )
}
