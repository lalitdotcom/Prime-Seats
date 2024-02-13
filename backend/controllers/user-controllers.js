import User from "../models/User.js";
import Booking from "../models/Bookings.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";



export const getAllUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find()
    } catch (err) {
        return next(err);
    }
    if (!users) {
        return res.status(500).json({ message: "unexpected Error Occcured" });
    }

    return res.status(200).json({ users })
}






export const Signup = async (req, res, next) => {
    const { first_name, last_name, email, password, contact_number } = req.body;
    if (
        !first_name &&
        first_name.trim() === "" &&
        !last_name &&
        last_name.trim() === "" &&
        !email &&
        email.trim() === "" &&
        !password &&
        password.trim() === "" &&
        !contact_number &&
        contact_number.trim() === ""
    ) {
        return res.status(422).json({ message: "Invalid Inputs" })
    }
    let existingUser;
    try {
        existingUser = await User.findOne({ email })

    } catch (err) {
        return console.log(err)
    }
    if (existingUser) {
        return res.status(400).json({ message: "User already exists! Login instead" })
    }

    const hashedPassword = bcrypt.hashSync(password);
    let users;
    try {
        users = new User({ first_name, last_name, email, password: hashedPassword, contact_number, is_active: false, is_deleted: false });
        users = await users.save();
    } catch (err) {
        return console.log(err);
    }
    if (!users) {
        return res.status(500).json({ message: "unexpected Error Occcured" });
    }

    return res.status(201).json({ id: users._id });
};






export const updateUser = async (req, res, next) => {
    const id = req.params.id;
    const { first_name, last_name, email, password, contact_number, is_active, is_deleted } = req.body;
    if (
        !first_name &&
        first_name.trim() === "" &&
        !last_name &&
        last_name.trim() === "" &&
        !email &&
        email.trim() === "" &&
        !password &&
        password.trim() === "" &&
        !contact_number &&
        contact_number.trim() === ""
    ) {
        return res.status(422).json({ message: "Invalid Inputs" })
    }
    let user;
    try {
        user = await User.findByIdAndUpdate(id, { first_name, last_name, email, password, contact_number, is_active, is_deleted })
    } catch (err) {
        return console.log(err)
    }
    if (!user) {
        return res.status(500).json({ message: "Something went wrong" })
    }
    res.status(200).json({ message: "Updated successfully" })
}




export const deleteUser = async (req, res, next) => {
    const id = req.params.id;
    let user;
    try {
        user = await User.findByIdAndUpdate(id, { is_deleted: true });
    } catch (err) {
        return console.log(err)
    }
    if (!user) {
        return res.status(500).json({ message: "Something went wrong" });
    }
    return res.status(200).json({ message: "User Deleted successfully" })
}



export const login = async (req, res, next) => {
    const { email, password } = req.body;
    if (
        !email &&
        email.trim() === "" &&
        !password &&
        password.trim() === ""
    ) {
        return res.status(422).json({ message: "Invalid Inputs" })
    }

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch (err) {
        return console.log(err)
    }
    if (!existingUser) {
        {
            return res.status(404).json({ message: "User not found!, Signup please" })
        }
    }
    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password)

    if (!isPasswordCorrect) {
        return res.status(400).json({ message: " Incorrect Password" })

    }
    const token = jwt.sign({ id: existingUser.id }, process.env.SECRET_KEY, {
        expiresIn: "30s"
    })
    res.cookie(String(existingUser.id), token, {
        path: '',
        expires: new Date(Date.now() + 1000 * 30),
        httpOnly: true,
        sameSite: "lax"
    });


    return res.status(200).json({ message: 'User Login successful', id: existingUser._id })
}




export const verifyToken = (req, res, next) => {
    const cookies = req.headers.cookie;
    console.log(cookies);
    const extractedToken = cookies.split("=")[1];
    console.log(extractedToken);
    if (!extractedToken) {
        return res.status(404).json({ message: "No token found" })
    }
    jwt.verify(extractedToken, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(400).json({ message: "Invalid Token" });
        } else {
            req.id = user.id;
        }
    });
    next();
}


export const getUser = async (req, res, next) => {
    const userId = req.params.id;
    let user;
    try {
        user = await User.findById(userId, "-password")
    } catch (err) {
        return console.log(err);
    }
    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }
    return res.status(200).json({ user })
}





export const getBookingOfUser = async (req, res, next) => {
    const id = req.params.id;
    let booking;
    try {
        booking = await Booking.find({ user: id })
    } catch (err) {
        return console.log(err);
    }
    if (!booking) {
        return res.status(500).json({ message: "Unable to get bookings" });
    }
    return res.status(200).json({ booking })
}
