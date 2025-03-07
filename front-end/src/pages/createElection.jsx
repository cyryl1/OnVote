import { useState, useContext } from 'react';
import Logo from '../components/logo';
import { FaChevronCircleRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { TokenContext } from '../context/AuthContext';
import axios from 'axios';

export default function CreateElection() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    start_date: '',
    end_date: ''
  })

  const [errors, setErrors] = useState({});
  const { saveElectionDetails} = useContext(TokenContext);
  // const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value})
  }

  const handleCreateElection = async (form) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      console.log(accessToken);
      console.log(form);
      const response = await axios.post('http://127.0.0.1:5000/onvote/election/create', JSON.stringify(form), {
        headers: { 
          'Authorization': `Bearer ${accessToken}`, 
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify(form)
      });

      if (response.status === 201 && response.data.message) {
        saveElectionDetails({
          id: response.data.id,
          title: response.data.message.title,
          start_date: response.data.message.start_date,
          end_date: response.data.message.end_date,
        });
        navigate(`/election/${response.data.id}/overview`);
        // setPageState(true);
      }
    } catch (err) {
      if (err.response.status === 401 && err.response.data.status === "token_expired") {
        navigate('/token_refresh');
      } else {
        console.error(`Failed to load: ${err.message || err}`);
      }
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

  // if (error) return <p>{error}</p>
  return (
    <div className='flex flex-col items-center '>
      {/* <div>
        <img src={Logo} alt="logo" className='h-[12rem]' />
      </div> */}
      <div className="flex justify-center items-center">
          <Logo
              imgWidth='4rem'
              textSize='2rem'
              color='black'
          />
      </div>
      <div className='text-center text-[2rem] font-semibold lg:font-bold text-gray-700 p-4'>Create a new Election</div>

      <div className="card-body border-[#ced4da]-50 border-[1px] w-[90%] md:w-[40%] lg:w-[30%] m-auto rounded bg-white shadow-md">
        <form onSubmit={handleSubmit} className='p-6 flex flex-col gap-3 lg:gap-[1rem]'>
          <div className="form-group flex flex-col gap-1">
            <label className='font-semibold lg:font-bold text-gray-700'>Title</label>
            {errors.title && (
              <p className='text-red-500 text-[0.6rem]'>{errors.title}</p>
            )}
            <input
              type="text" 
              className='border border-[#ced4da] h-10 rounded bg-[#f6f8fa] px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='e.g Class President Election'
              onChange={handleChange}
              name='title'
              value={formData.title}
            />
          </div>
          <div className="form-group flex flex-col gap-1">
            <label className='font-semibold lg:font-bold text-gray-700'>Start Date</label>
            {errors.start_date && (
              <p className='text-red-500 text-[0.6rem]'>{errors.start_date}</p>
            )}
            <input
              type="datetime-local" 
              className='border border-[#ced4da] h-10 rounded bg-[#f6f8fa] px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
              onChange={handleChange}
              name='start_date'
              value={formData.start_date}
            />
          </div>
          <div className="form-group flex flex-col gap-1">
            <label className='font-semibold lg:font-bold text-gray-700'>End Date</label>
            {errors.end_date && (
              <p className='text-red-500 text-[0.6rem]'>{errors.end_date}</p>
            )}
            <input
              type="datetime-local" 
              className='border border-[#ced4da] h-10 rounded bg-[#f6f8fa] px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
              onChange={handleChange}
              name='end_date'
              value={formData.end_date}
            />
          </div>
          <div className='w-fit'>
            <button type='submit' className='flex items-center gap-3 text-[1.2rem] px-[2rem] py-[.6rem] bg-blue-600 border border-blue-600 text-[#fff] font-aemibold rounded h-10 hover:bg-blue-700 transition'>
              <span>Continue</span>
              <span><FaChevronCircleRight className=''/></span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
