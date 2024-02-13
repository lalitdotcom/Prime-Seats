import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from "axios";
import "./Bookings.css"
import SeatSelection from './SeatSelect.js';

const Booking = () => {
  const [movie, setMovie] = useState()
  const id = useParams().id;

  const getMovieDetails = async (id) => {
    const res = await axios.get(`http://localhost:5000/movie/${id}`).catch(err => console.log(err));
    if (res.status !== 200) {
      return console.log("No data")
    }
    const resData = await res.data;
    return resData;
  }

  useEffect(() => {
    getMovieDetails(id)
      .then((res) => setMovie(res.movie))
      .catch((err) => console.log(err))
  }, [id])

  return (
    <div className="movie-page">
      <div className="movie-details">
        <div className="big-box">
          <h2>Movie Details</h2>
        </div>
      </div>
      <div className="booking-form">
        <div className="big-box">
          <h2>Timing of Slots</h2>
        </div>
      </div>
      <div>
        <div className="big-box">
          <SeatSelection/>
        </div>
      </div>
    </div>
  );
}

export default Booking;