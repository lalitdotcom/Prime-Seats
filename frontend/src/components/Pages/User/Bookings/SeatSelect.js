import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SeatSelect.css"; // Import your CSS file
import { useParams } from "react-router-dom";

const SeatSelection = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  let { movieId } = useParams();
  console.log(movieId);
  const userId = localStorage.getItem("userId");
  console.log(userId);
  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/booking/${movieId}`
        );
        console.log(response.data.allSeats);
        setBookedSeats(response.data.allSeats);
      } catch (error) {
        console.error("Error fetching booked seats:", error);
      }
    };

    fetchBookedSeats();
  }, [movieId]);

  const toggleSeat = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  console.log(selectedSeats);

  const bookSeats = async () => {
    try {
      // Make a POST request to your backend API to book the selected seats
      await axios.post(`http://localhost:5000/booking/${movieId}`, {
        userId,
        seats: selectedSeats,
      });
      // Optionally, you can handle success or show a confirmation message
      console.log("Seats booked successfully!");
    } catch (error) {
      // Handle error
      console.error("Error booking seats:", error);
    }
  };

  return (
    <div className="seatSelectionContainer">
      <h2>Select Your Seats</h2>
      <div className="screen">Screen</div>

      <div class="color-box-container">
        <div>
          <div class="color-box available"></div>
          <span class="label">Available</span>
        </div>
        <div>
          <div class="color-box selected"></div>
          <span class="label">Selected</span>
        </div>
        <div>
          <div class="color-box booked"></div>
          <span class="label">Booked</span>
        </div>
      </div>
      <div className="seats">
        {Array.from({ length: 6 }, (_, row) => (
          <div key={row} className="row">
            <div className="rowLabel">{String.fromCharCode(65 + row)}</div>
            {Array.from({ length: 10 }, (_, col) => (
              <div
                key={col}
                className={`seat ${
                  selectedSeats.includes(
                    `${String.fromCharCode(65 + row)}-${col}`
                  )
                    ? "selected"
                    : bookedSeats.includes(
                        `${String.fromCharCode(65 + row)}-${col}`
                      )
                    ? "booked"
                    : ""
                }`}
                onClick={() =>
                  toggleSeat(`${String.fromCharCode(65 + row)}-${col}`)
                }
              >
                {col + 1}
              </div>
            ))}
          </div>
        ))}
        {/* <div className="columnLabels">
          <div></div>
          {Array.from({ length: 10 }, (_, index) => (
            <div key={index} className="columnLabel">{index + 1}</div>
          ))}
        </div> */}
      </div>
      <button onClick={bookSeats}>Book Selected Seats</button>
    </div>
  );
};

export default SeatSelection;
