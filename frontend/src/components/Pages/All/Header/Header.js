import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import "./Header.css"
import { CgProfile } from "react-icons/cg";
import { useDispatch, useSelector } from 'react-redux';
import logo from "./logo/0ZIby5-LogoMakr.png"
import { adminActions, personActions } from '../../../../store';
import axios from 'axios';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    const isAdmin = useSelector((state) => state.setlogin.isAdmin)
    const isLoggedIn = useSelector((state) => state.login.isLoggedIn)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get("http://localhost:5000/user/user");
    //             const data = await response.json();
    //         } catch (error) {
    //             console.error("Error fetching user data:", error);
    //         }
    //     };

    //     fetchData();
    // }, []);


    const Logout = () => {
        if (isAdmin) {
            dispatch(adminActions.setlogout());
        } else {
            dispatch(personActions.logout());
        }
        navigate("/login")
    }
    return (
        <nav>
            <Link className="title" to="/homepage"><img src={logo} /></Link>
            <div className='menu' onClick={() => {
                setMenuOpen(!menuOpen)
            }}>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <ul className={menuOpen ? "open" : ""}>
                {isLoggedIn ? (
                    <>
                        {isAdmin && (
                            <li>
                                <NavLink to="/addmovie" >ADD NEW MOVIE</NavLink>
                            </li>
                        )}
                        <li>
                            <NavLink onClick={() => Logout()} to="/login" >LOG OUT</NavLink>
                        </li>
                        <li>
                            <NavLink to="/persondetails" className="icon"><CgProfile /></NavLink>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <NavLink to="/signup">SIGN UP</NavLink>
                        </li>
                        <li>
                            <NavLink to="/login">LOG IN</NavLink>
                        </li>
                    </>
                )}
            </ul>

        </nav>
    )
}

export default Header;
