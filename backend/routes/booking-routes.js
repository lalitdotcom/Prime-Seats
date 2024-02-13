import express from "express";
import { deleteBooking, getBookingById, newBooking } from "../controllers/booking-controllers.js";

const bookingRouter = express.Router()

bookingRouter.post("/:id", newBooking)
bookingRouter.get("/:id", getBookingById)
bookingRouter.delete("/:id", deleteBooking)


export default bookingRouter;