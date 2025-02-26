import Modal from 'react-modal';
import { RiDeleteBinFill } from "react-icons/ri";
import BallotDeleteModal from "./ballotDeleteModal";
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

Modal.setAppElement('#root');
export default function OptionModal({ isOpen, onRequestClose, onSave, candidateInfo, initialData, isEditMode }) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [error, setError] = useState({});

    const initialFormData = {
        title: 'Candidate Title',
        bio: '',
        image: '',
    }

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        console.log(isEditMode);
        console.log(initialData);
        if (isEditMode && initialData) {
            setFormData({
                title: initialData.title,
                bio: initialData.bio,
                image: '',
            });
        } else {
            setFormData({
                title: 'Candidate Title',
                bio: '',
                image: '',
            });
        }
    }, [isEditMode, initialData]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        setError({image: ''});
        
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError({image: 'Please select an image file'});
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setError({image: 'File must be less than 5MB'});
            }
            setFormData((prev) => ({
                ...prev,
                image: file, // Update formData with the selected file
            }));
        }
    }

    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }


    const handleOptionSave = (e) => {
        e.preventDefault();
        // // handleBallotSave
        const newErrors = validate(formData);
        setError(newErrors);
        
        if (Object.keys(newErrors).length === 0) {
            if (isEditMode && initialData) {
                const updatedFormData = {
                    ...formData,          // Spread existing formData
                    election_id: candidateInfo.election_id,     // Spread candidateInfo
                    ballot_id: candidateInfo.ballot_id,
                    candidate_id: initialData.id || 0,
                };

                onSave(updatedFormData);
            } else {
                const updatedFormData = {
                    ...formData,
                    ...candidateInfo,
                }

                onSave(updatedFormData);
            }
            
            
            onRequestClose();
            setFormData(initialFormData);
            // console.log(formData);
        }
        // // Save
        
    }

    const validate = (form) => {
        const errors = {}
        if (!form.title) {
            errors.title = 'Title is required';
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
                className='modal mt-[.5rem] w-[95%] mb-[.5rem] overflow-y-auto scrollbar-hide no-scrollbar'
                overlayClassName={`overlay bg-[#000] fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center ${isOpen ? 'backdrop-blur-sm opacity-[.95]' : ''}`}
            >
                <div className="bg-[#fff]  m-auto z-99">
                    <div className="flex justify-between px-[2rem] py-[1rem] bg-[#0bacfa]">
                        <div className="text-[1.5rem] text-[#fff] font-semibold">Edit Candidate</div>
                        <div className="text-[1rem] text-[#fff] font-bold" onClick={onRequestClose}>X</div>
                    </div>
                    <div className="py-[1rem]">
                        <form action="">
                            <div className="form-group text-[1.5rem] px-[1rem] mb-5">
                                {/* <label htmlFor="" className='font-bold'>Ballot</label> */}
                                <p className='font-semibold'>{candidateInfo.ballot_title || 'Ballot title'}</p>
                            </div>
                            <div className='flex whitespace-normal'>
                                <div className="form-group px-[1rem] mt-[1rem] flex flex-col gap-1">
                                    {error.title && (
                                        <p className="text-red-600">{error.title}</p>
                                    )}
                                    <label htmlFor="title" className="text-[1rem] font-bold">Title</label>
                                    <input type="text" value={formData.title} onChange={handleChange} name="title" className="bg-[#f6f8fa] border px-[.5rem] text-[0.9rem] py-[.4rem] w-[8rem] border-[#ced4da] rounded-sm" />
                                </div>
                                <div className="form-group  flex flex-col gap-1 px-[1.5rem]">
                                    {error.image && (
                                        <p>{error.image}</p>
                                    )}
                                    <label htmlFor="photo" className='font-bold'>Photo(Optional)</label>
                                    <input type="file" name='photo' onChange={handleFileSelect} className='w-[90%] font-semibold whitespace-normal' placeholder='Choose File' />
                                </div>
                                
                            </div>
                            <div className="form-group px-[2rem] flex flex-col gap-1 mt-[1rem]">
                                <label htmlFor="bio" className="text-[1rem] font-bold">Bio (Optional)</label>
                                <textarea 
                                    name="bio" 
                                    onChange={handleChange} className="bg-[#f6f8fa] border px-[.5rem] text-[1.1rem] py-[.4rem] border-[#ced4da] rounded-sm" 
                                    rows={10} id=""
                                    value={formData.bio}
                                ></textarea>
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

OptionModal.propTypes = {
    candidateInfo: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    initialData: PropTypes.object,
    isEditMode: PropTypes.bool.isRequired
}
