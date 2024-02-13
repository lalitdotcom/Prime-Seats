import React, { useState } from 'react';
import "./SignUp.css"
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [inputs, setInputs] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        contact_number: ""
    });


    const handleChange = (e) => {
        setInputs((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    const sendRequest = async () => {
        try {
            if (inputs.secret_key) {
                const res = await axios.post("http://localhost:5000/admin/signup", {
                    first_name: inputs.first_name,
                    last_name: inputs.last_name,
                    email: inputs.email,
                    password: inputs.password,
                    contact_number: inputs.contact_number,
                    secret_key: inputs.secret_key
                });
                const data = res.data;
                setMessage(data.message);
                return data;
            } else {
                const res = await axios.post("http://localhost:5000/user/signup", {
                    first_name: inputs.first_name,
                    last_name: inputs.last_name,
                    email: inputs.email,
                    password: inputs.password,
                    contact_number: inputs.contact_number,
                });
                const data = res.data;
                setMessage(data.message);
                return data;
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        sendRequest().then(() => navigate("/login"))
    }

    return (
        <form className='signup-container' onSubmit={handleSubmit}>
            <div className='signup-header'>
                <div className='signup-text'>SIGN UP</div>
                <span className='signup-underline' ></span>
            </div>
            <div className='signup-inputs'>
                <div className="signup-inputs">
                    <input className="signup-input" type="text" name="first_name" placeholder="  First Name" value={inputs.first_name} onChange={handleChange} />
                    <input className="signup-input" type="text" name="last_name" placeholder="  Last Name" value={inputs.last_name} onChange={handleChange} />
                    <input className="signup-input" type="email" name="email" placeholder="  Email Id" value={inputs.email} onChange={handleChange} />
                    <input className="signup-input" type="password" name="password" placeholder="  Password" value={inputs.password} onChange={handleChange} />
                    <input className="signup-input" type="tel" name="contact_number" placeholder=" Contact Number" value={inputs.contact_number} onChange={handleChange} />
                    <input className="signup-input" type="password" name="secret_key" placeholder=" Secret Key(Only for Admins)" value={inputs.secret_key} onChange={handleChange} />
                    <div className="signup-message">{message}</div>
                </div>
                <div className='signup-submit-container'>
                    <button type="signup" className="signup-submit">SIGN UP</button>
                </div>
            </div>
        </form >
    )
}

export default SignUp;
