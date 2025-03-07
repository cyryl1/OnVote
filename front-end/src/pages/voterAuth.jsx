import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import LoadingModal from '../components/loadingModal';

export default function VoterAuth() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [errors, setErrors] = useState({});
    const [electionName, setElectionName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        voter_key: "",
        voter_password: "",
    });

    useEffect(() => {
        const fetchElection = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`http://127.0.0.1:5000/onvote/get_election/${id}`);
                if (response.status === 200 && response.data.message) {
                    setElectionName(response.data.message.title)
                } else {
                    alert("Error fetching election data");
                }
            } catch (err) {
                console.error(`Failed to load: ${err.message || err}`);
            } finally {
                setIsLoading(false);
            }
            
        };

        fetchElection();
    }, [id]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleLogin = async (form) => {
        console.log(form);
        console.log(id)
        setIsLoading(true);
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

            if (response.status === 201 && response.data.message) {
                localStorage.setItem(`voter_auth_${id}`, "true");
                localStorage.setItem(`voter_id_${id}`, response.data.id);
                setTimeout(() => {
                    navigate(`/election/${id}/vote_page`);
                }, 1000);
            }
        } catch (error) {
            if(error.response.status === 400) {
                alert(error.response.data.message);
                navigate(0);
            } else if (error.response.status === 404) {
                alert(error.response.data.message);
                navigate(0);
            } else {
                console.error(error);
            }
            
        } finally {
            setIsLoading(false);
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
        <div className="m-auto p-[1.5rem]">
            <div className="text-center">
                <h3 className="font-bold text-[2rem]">{electionName}</h3>
                <p className="mt-2 text-red-500">Please provide your voter key and password to proceed.</p>
            </div>
            <form onSubmit={handleLogin} className="border shadow-md mt-[4rem] rounded">
                <div className="font-semibold p-[.8rem] text-[1.2rem] bg-[#0bacfa] text-white rounded-t">Login to vote</div>
                <div className="form-group flex flex-col p-[.8rem]">
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

                <div className="form-group flex flex-col p-[.8rem]">
                    {errors && <p style={{ color: "red" }}>{errors.voter_password}</p>}
                    <label htmlFor="voter_password" className='font-semibold lg:font-bold text-gray-700'>Voter Password</label>
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
                <div className="flex justify-center items-center p-[1rem]">
                    <button 
                        type="submit" 
                        onClick={handleSubmit}
                        className="bg-green-500 border border-green-500 text-[#fff] font-aemibold rounded h-10 w-[90%] hover:bg-blue-700 transition "
                    >
                        Authenticate
                    </button>
                </div>
            
            </form>
        </div>
        <LoadingModal 
            isOpen={isLoading}
            onRequestClose={() => setIsLoading(!isLoading)}
        />
    </>
  )
}
