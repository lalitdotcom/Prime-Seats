import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Types.ObjectId,
    ref: "Movie",

  },
 
  seats: [
    {
      type: String,

    },  
  ],
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",

  },
  is_deleted: {
    type: Boolean,
    default: false
   
  },
});

export default mongoose.model("Booking", BookingSchema);
