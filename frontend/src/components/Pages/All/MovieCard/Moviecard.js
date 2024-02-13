import React from 'react'
import "./Moviecard.css"
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import axios from 'axios';


const Moviecard = (props) => {
    const isAdmin = useSelector((state) => state.setlogin.isAdmin)

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    const handlePatch = async (id) => {
        console.log(id)
        const res = await axios.patch(`http://localhost:5000/movie/${id}`, {
            is_active: false,
        }).catch((err) => console.log(err));

        if (res.status !== 200) {
            return console.log("Unexpected Error")
        }
        const resdata = res.data
        return resdata;
    }
    return (
        <div className="homepage-card">
            <img
                className="homepage-posterImg"
                src={props.image}
                alt={props.name}
            />
            <div className="movieInfo">
                <span className="movieCard-movieName">{props.name}</span>
                <span className='genre'>{props.genre}</span>
                <span className=''>{`Release Date: ${formatDate(props.releasedate)}`}</span>
                <div className='homepage-button-container'>
                    {isAdmin ?
                        (<div className='homepage-button-div'>
                            <button className="book">
                                <NavLink className="homepage-navlink" to={`/editmovie/${props.id}`}>
                                    EDIT MOVIE
                                </NavLink>
                            </button>
                            <div className="homepage-navlink">
                                <button className="book" onClick={() => handlePatch(props.id)}>
                                    INACTIVE MOVIE
                                </button>
                            </div>
                        </div>
                        ) :
                        (
                            <button className="book">
                                <NavLink className="homepage-navlink" to={`/booking/${props.id}`} >
                                    BOOK TICKETS
                                </NavLink>
                            </button>
                        )
                    }
                </div>
            </div>
        </div >
    )
}
export default Moviecard;


