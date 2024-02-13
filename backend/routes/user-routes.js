import express from "express";
import { getBookingOfUser, Signup, deleteUser, getAllUsers, login, updateUser, verifyToken, getUser } from "../controllers/user-controllers.js";
const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.post("/signup", Signup);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);
userRouter.post("/login", login)
userRouter.get("/user", verifyToken, getUser)

userRouter.get("/bookings/:id", getBookingOfUser)


export default userRouter;  