import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";

export default function VoterAuth() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        voter_key: "",
        voter_password: "",
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleLogin = async (form) => {
        console.log(form);
        console.log(id)
        try {
            const formEncoded = new URLSearchParams();
            for (const key in form) {
                formEncoded.append(key, form[key]);
            }

            const response = await axios.post(`http://127.0.0.1:5000/onvote/election/${id}/validate_voter`, {
                voter_key: form.voter_key,
                voter_password: form.voter_password
            },
            { 
                headers: { 'Content-Type': 'application/json' } 
            }
        );

            if (response.status === 200 && response.data.message) {
                localStorage.setItem(`voter_auth_${id}`, "true");
                setTimeout(() => {
                    navigate(`/election/${id}/vote_page`);
                }, 1000);
            }

            if (response.status === 400) {
                alert(response.data.message);
            }

            if (response.status === 404) {
                alert(response.data.message);
            }
        } catch (error) {
            console.error(error);
        } 
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateForm(formData);
        setErrors(newErrors);
        console.log(formData);

        if (Object.keys(newErrors).length === 0) {
            console.log("Form submitted successfully");
            handleLogin(formData);
            console.log(formData);
        } else {
            console.log("Form submission failed");
        }
    };

    const validateForm = (data) => {
        const errors = {};

        if (!data.voter_key) {
            errors.voter_key = 'voter_key is required';
        }

        if (!data.voter_password) {
            errors.voter_password = 'voter_password is required';
        }

        return errors;
    }

  return (
    <>
    <div>
      <h2>Voter Authentication</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group flex flex-col">
            {errors && <p style={{ color: "red" }}>{errors.voter_key}</p>}
            <label htmlFor="voter_key" className='font-semibold lg:font-bold text-gray-700'>Voter Key</label>
            <input
                type="text"
                name="voter_key"
                placeholder="Voter Key"
                value={formData.voter_key}
                onChange={handleChange}
                className='border border-[#ced4da] h-10 rounded bg-[#f6f8fa] px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
                required
            />
        </div>

        <div className="form-group flex flex-col">
            {errors && <p style={{ color: "red" }}>{errors.voter_password}</p>}
            <label htmlFor="voter_password" className='font-semibold lg:font-bold text-gray-700'>voter_password</label>
            <input
            type="password"
            name="voter_password"
            placeholder="Password"
            value={formData.voter_password}
            onChange={handleChange}
            className='border border-[#ced4da] h-10 rounded bg-[#f6f8fa] px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
            />
        </div>
        <button type="submit" onClick={handleSubmit}>Authenticate</button>
      </form>
    </div></>
  )
}
