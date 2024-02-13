import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "./Login.css";
import { useDispatch } from 'react-redux';
import { personActions } from '../../../../store';
import { adminActions } from '../../../../store';
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';


const Login = () => {
    const dispatch = useDispatch();
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    });

    const onResReceived = async (data) => {
        try {
            let person = isAdmin ? "admin" : "user"
            await dispatch(personActions.login());
            localStorage.setItem(`${person}Id`, data.id);
            if (person === "admin") {
                await dispatch(adminActions.setlogin());
                localStorage.setItem("token", data.token)
            }
            navigate("/homepage");
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e) => {
        setInputs((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    const sendRequest = async () => {
        try {
            let url = isAdmin ? "http://localhost:5000/admin/login" : "http://localhost:5000/user/login";
            const res = await axios.post(url, {
                email: inputs.email,
                password: inputs.password,
            });
            const data = res.data;
            console.log(data);
            if (res.status === 200) {
                onResReceived(data)
            } else {
                toast.error("invalid credentials")
            }
        } catch (err) {
            toast.error("invalid credentials")
            console.log(err);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        sendRequest();
    };

    return (
        <div className='login-container'>
            <form onSubmit={handleSubmit}>
                <div className='login-header'>
                    <div className='login-text'>LOG IN</div>
                    <div className='login-underline'></div>
                </div>
                <div className='login-inputs'>
                    <div className="login-inputs">
                        <input className='login-input' name='email' type="email" placeholder="  Email Id" onChange={handleChange} />
                        <input className='login-input' name='password' type="password" placeholder="  Password" onChange={handleChange} />
                    </div>
                    <div className='login-checkbox'>
                        <input type='checkbox' onChange={() => setIsAdmin(true)} />
                        <label className='login-label' >
                            Are you an Admin?
                        </label>
                    </div>

                    <div className='login-submit-container'>
                        <button type="submit" className="login-submit">LOG IN</button>
                        <ToastContainer position="bottom-right" />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Login;
 