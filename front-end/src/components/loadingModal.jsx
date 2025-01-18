import Modal from 'react-modal';

Modal.setAppElement('#root')

export default function LoadingModal({ isOpen, onRequestClose }) {
    return (
        <>
            <Modal
                isOpen={isOpen}
                onRequestClose={onRequestClose}
                contentLabel="Loading"
                className='modal mt-[.5rem] w-[95%] mb-[.5rem] overflow-y-auto scrollbar-hide no-scrollbar'
                overlayClassName={`overlay bg-[#000] fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center ${isOpen ? 'backdrop-blur-sm opacity-[.75]' : ''}`}
            >
                <div className='text-white text-[2rem] flex items-center justify-center h-screen'>
                    Loading...
                </div>
            </Modal>
        </>
    )
}
