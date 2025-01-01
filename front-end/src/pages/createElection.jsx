import { useState, useContext } from 'react';
import Logo from '../assets/onvote-high-resolution-logo.svg';
import { FaChevronCircleRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { TokenContext } from '../context/AuthContext';

export default function CreateElection() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    start_date: '',
    end_date: ''
  })

  const [errors, setErrors] = useState({});
  const { setElectionDetails} = useContext(TokenContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value})
  }

  const handleCreateElection = (form) => {
    if (form) {
      setElectionDetails({
        title: form.title,
        start_date: form.start_date,
        end_date: form.end_date
      })
      setTimeout(() => {
        navigate('/overview');
      }, 1000)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validateForm(formData);
    setErrors(newErrors);
    
    if(Object.keys(newErrors).length === 0) {
      console.log("Election created");
      handleCreateElection(formData);    
      console.log(formData);
    } else {
      console.log("Form submission failed");
    }
    
    // TODO: Submit form data to server
  }

  const validateForm = (form) => {
    const errors = {};

    if (!form.title) {
      errors.title = 'Title is required';
    }
    if (!form.start_date) {
      errors.start_date = 'Start date is required';
    }
    if (!form.end_date) {
      errors.end_date = 'End date is required';
    }

    return errors;
  }
  return (
    <div className='flex flex-col items-center justify-center'>
      <div>
        <img src={Logo} alt="logo" className='h-[12rem]' />
      </div>
      <div className='text-center text-[3rem]'>Create a new Election</div>

      <div className="mb-[12rem] w-[90%] lg:w-[40%] card-body p-[1rem] bg-[#fff] border border-[#dee2e6] mt-[1rem] rounded-sm">
        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
          <div className="form-group flex flex-col gap-1">
            <label className='font-bold'>Title</label>
            {errors.title && (
              <p className='text-red-500 text-[0.6rem]'>{errors.title}</p>
            )}
            <input
              type="text" 
              className='bg-[#f6f8fa] text-[1.3rem] px-[0.5rem] border border-[#dee2e6] rounded-sm h-[2.5rem]'
              placeholder='e.g Class President Election'
              onChange={handleChange}
              name='title'
              value={formData.title}
            />
          </div>
          <div className="form-group flex flex-col gap-1">
            <label className='font-bold'>Start Date</label>
            {errors.start_date && (
              <p className='text-red-500 text-[0.6rem]'>{errors.start_date}</p>
            )}
            <input
              type="datetime-local" 
              className='bg-[#f6f8fa] text-[1rem] px-[0.5rem] border border-[#dee2e6] rounded-sm h-[2.5rem]'
              onChange={handleChange}
              name='start_date'
              value={formData.start_date}
            />
          </div>
          <div className="form-group flex flex-col gap-1">
            <label className='font-bold'>End Date</label>
            {errors.end_date && (
              <p className='text-red-500 text-[0.6rem]'>{errors.end_date}</p>
            )}
            <input
              type="datetime-local" 
              className='bg-[#f6f8fa] text-[1rem] px-[0.5rem] border border-[#dee2e6] rounded-sm h-[2.5rem]'
              onChange={handleChange}
              name='end_date'
              value={formData.end_date}
            />
          </div>
          <div className='w-fit'>
            <button type='submit' className='flex items-center gap-3 text-[1.2rem]  text-[#fffc] px-[2rem] py-[.6rem] bg-[#2ecd10] border-[#2ecd10] rounded-sm'>
              <span>Continue</span>
              <span><FaChevronCircleRight className=''/></span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
