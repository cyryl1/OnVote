import Modal from 'react-modal';
import { RiDeleteBinFill } from "react-icons/ri";
import BallotDeleteModal from "./ballotDeleteModal";
import { useState } from 'react';

Modal.setAppElement('#root');
export default function OptionModal({ isOpen, onRequestClose, onSave }) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [error, setError] = useState({});

    const [formData, setFormData] = useState({
        optionTitle: 'Option Title',
        description: '',
        image: '',
    })

    const handleFileSelect = (e) => {
        const file = e.target.file[0];
        setError({image: ''});
        
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError({image: 'Please select an image file'});
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setError({image: 'File must be less than 5MB'});
            }
            formData.image = file;
        }
    }

    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value});
    }


    const handleOptionSave = (e) => {
        e.preventDefault();
        // // handleBallotSave
        const newErrors = validate(formData);
        setError(newErrors);
        
        if (Object.keys(newErrors).length === 0) {
            onSave(formData);
            onRequestClose();
            // console.log(formData);
        }
        // // Save
        
    }

    const validate = (form) => {
        const errors = {}
        if (!form.optionTitle) {
            errors.optionTitle = 'Title is required';
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
    if (!isOpen) return null;
  return (
    <>
            <Modal
                isOpen={isOpen}
                onRequestClose={onRequestClose}
                contentLabel="Edit Ballot Question"
                className='modal mt-[.5rem] mb-[.5rem] overflow-y-auto scrollbar-hide no-scrollbar'
                overlayClassName={`overlay bg-[#000] fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center ${isOpen ? 'backdrop-blur-sm opacity-[.95]' : ''}`}
            >
                <div className="bg-[#fff] w-[96%] m-auto z-99">
                    <div className="flex justify-between px-[2rem] py-[1rem] bg-[#0bacfa]">
                        <div className="text-[1.5rem] text-[#fff] font-semibold">Edit Option</div>
                        <div className="text-[1rem] text-[#fff] font-bold" onClick={onRequestClose}>X</div>
                    </div>
                    <div className="py-[1.5rem]">
                        <form action="">
                            <div className="form-group text-[1.2rem] px-[2rem]">
                                <label htmlFor="">Question</label>
                                <p>Ballot title</p>
                            </div>
                            <div className='flex whitespace-normal'>
                                <div className="form-group w-[60%] px-[2rem] mt-[1rem] flex flex-col gap-1">
                                    {error.optionTitle && (
                                        <p className="text-red-600">{error.optionTitle}</p>
                                    )}
                                    <label htmlFor="optionTitle" className="text-[1rem] font-bold">Title</label>
                                    <input type="text" value={formData.optionTitle} onChange={handleChange} name="optionTitle" className="bg-[#f6f8fa] border px-[.5rem] text-[1.1rem] py-[.4rem] border-[#ced4da] rounded-sm" />
                                </div>
                                <div className="form-group w-[40%] flex flex-col gap-1 px-[1.5rem]">
                                    {error.image && (
                                        <p>{error.image}</p>
                                    )}
                                    <label htmlFor="photo" className='font-bold'>Photo(Optional)</label>
                                    <input type="file" name='photo' onChange={handleFileSelect} className='w-[90%] font-semibold whitespace-normal' placeholder='Choose File' />
                                </div>
                                
                            </div>
                            <div className="form-group px-[2rem] flex flex-col gap-1 mt-[1rem]">
                                <label htmlFor="description" className="text-[1rem] font-bold">Description(Optional)</label>
                                <textarea name="description" onChange={handleChange} className="bg-[#f6f8fa] border px-[.5rem] text-[1.1rem] py-[.4rem] border-[#ced4da] rounded-sm" rows={10} id=""></textarea>
                            </div>
                            
    
                            <div className="form-group mt-[2rem] px-[2rem] flex justify-between">
                                <button type="submit" onClick={handleOptionSave}  className="bg-[#2ecd10] text-white px-[1rem] py-[.5rem] rounded">Save</button>
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
