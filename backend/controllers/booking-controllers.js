import Booking from "../models/Bookings.js";
import Movie from "../models/Movie.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// export const newBooking = async (req, res, next) => {
//   const { userId, date, seats, is_deleted } = req.body;
//   const movieId  = req.params.id;
//   console.log(userId)
//   let existingMovie;
//   let existingUser;
//   try {
//     existingMovie = await Movie.findById(movieId);
//     existingUser = await User.findById(userId);
//   } catch (err) {
//     return console.log(err);
//   }
//   if (!existingMovie) {
//     return res.status(404).json({ message: "Movie not found" });
//   }
//   if (!userId) {
//     return res.status(404).json({ message: "user not found" });
//   }

//   let booking;
//   try {
//     booking = new Booking({
//       movieId,

//       seats,
//       userId,

//     });
//     const session = await mongoose.startSession();
//     session.startTransaction();
//     existingUser.booking.push(booking);
//     existingMovie.booking.push(booking);
//     await existingUser.save({ session });
//     await existingMovie.save({ session });
//     await booking.save({ session });
//     session.commitTransaction();
//   } catch (err) {
//     return console.log(err);
//   }
//   if (!booking) {
//     return res.status(500).json({ message: "Unable to create booking" });
//   }
//   return res.status(201).json({ booking: booking });
// };
export const newBooking = async (req, res, next) => {
  const { userId, seats } = req.body;
  const movieId = req.params.id;

  // Validation
  if (!userId && !seats && !movieId) {
    return res
      .status(400)
      .json({ message: "userId, date, and seats are required" });
  }
  if (!movieId) {
    return res.status(400).json({ message: "movieId is required" });
  }
  if (!Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({ message: "seats must be a non-empty array" });
  }
  let existingMovie;
  let existingUser;

  try {
    existingMovie = await Movie.findById(movieId);
    existingUser = await User.findById(userId);

    if (!existingMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const booking = new Booking({
      movieId,
      seats,
      userId,
      is_deleted: false,
    });

    const session = await mongoose.startSession();
    session.startTransaction();

    existingUser.booking.push(booking);
    existingMovie.booking.push(booking);

    await existingUser.save({ session });
    await existingMovie.save({ session });
    await booking.save({ session });

    await session.commitTransaction();
    // await booking.save()

    return res.status(201).json(booking);
  } catch (err) {
    // Rollback transaction if an error occurs
    if (session) {
      await session.abortTransaction();
    }
    console.error(err);
    return res.status(500).json({ message: "Unable to create booking" });
  }
};

export const getBookingById = async (req, res, next) => {
  const movieId = req.params.id;
  //   console.log(req.params.id)

  let movies;
  let allSeats = [];
  try {
    
    movies = await Movie.findById(movieId).populate("booking");
    movies = movies.booking;

    // Loop through each booking
    for (let booking of movies) {
      // Loop through each seat in the booking and push it to the allSeats array
      for (let seat of booking.seats) {
        allSeats.push(seat);
      }
    }
  } catch (err) {
    return console.log(err);
  }
  if (!movies) {
    return res.status(500).json({ message: "Booking not found" });
  }
  return res.status(200).json({ allSeats });
};

export const deleteBooking = async (req, res, next) => {
  const id = req.params.id;

  let booking;
  try {
    booking = await Booking.findByIdAndUpdate(id, { is_deleted: true });
    if (!booking) {
      return res.status(500).json({ message: "Booking not found" });
    }

    const session = await mongoose.startSession();

    if (booking.userId && booking.userId.booking) {
      await booking.user.booking.pull(booking);
      await booking.user.save({ session });
    }

    if (booking.movieId && booking.movieId.booking) {
      await booking.movieId.booking.pull(booking);
      await booking.movieId.save({ session });
    }

    session.commitTransaction();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
  return res.status(200).json({ message: "Booking Deleted successfully" });
};
