import React from 'react'
import { IoPersonSharp } from "react-icons/io5";
import "./PersonDetails.css"
import { MdDeleteForever } from "react-icons/md";

const PersonDetails = () => {

    return (
        <div className='box'>
            <div className='profilepicture'>
                <IoPersonSharp />
            </div>
            <div className='whitebox'>
                <div className='details'>
                    <div className='persondetails'>
                        <h1>name</h1>
                        <h1>Email:</h1>
                        <h1>Phone Number:</h1>
                    </div>
                    <div className='bookings'>
                        {/* {booking.map((booking,index)=>())} */}
                        <h2>MOVIE: KGF</h2>
                        <h3>Seats</h3>
                        <h3>Date:</h3>
                        <div className='delete-icon'><MdDeleteForever /></div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default PersonDetails;