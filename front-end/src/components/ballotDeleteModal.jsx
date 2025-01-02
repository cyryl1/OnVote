import { useState } from "react";
import Modal from "react-modal";
import { PiWarningCircleThin } from "react-icons/pi";

Modal.setAppElement("#root");

export default function BallotDeleteModal({ isOpen, onRequestClose, onDelete }) {

    const handleDelete = () => {
        onDelete();
        onRequestClose();
    }

    if (!isOpen) return null;
  return (
    <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Delete ballot"
        className="deleteModal flex items-center h-screen mt-[1rem] mb-[1rem] overflow-y-auto scrollbar-hide no-scrollbar "
        overlayClassName={`overlay bg-[#000] fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center ${isOpen ? 'backdrop-blur-sm opacity-[.95]' : ''}`}
    >
        <div className="px-[2rem] py-[1rem] rounded bg-white w-[90%] m-auto z-99 flex flex-col justify-center items-center text-center">
            <div className="text-[#ff6900] border-[#ff6900] font-semibold text-[8rem]"><PiWarningCircleThin /></div>
            <div>
                <p className="font-bold text-[1.5rem]">Warning!</p>
                <p className="text-[1.1rem]">Are you sure you want to delete this ballot? This action cannot be undone.</p>
            </div>
            <div className="flex gap-1 mt-[2rem]">
                <button type="submit" className="text-white bg-[#3085d6] px-[2rem] py-[.5rem] font-bold rounded" onClick={handleDelete}>Yes</button>
                <button type="submit" className="text-white bg-[#aaaaaa] px-[2rem] py-[.5rem] font-bold rounded" onClick={onRequestClose}>No</button>
            </div>
        </div>
    </Modal>
  )
}
