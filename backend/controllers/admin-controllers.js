import Admin from "../models/Admin.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";


export const AdminSignup = async (req, res, next) => {
    const { first_name, last_name, email, password, contact_number, secret_key } = req.body;
    const secretkey = "123456"
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
        contact_number.trim() === "" &&
        !secret_key &&
        secret_key.trim() === "" &&
        secret_key !== secretkey
    ) {
        return res.status(422).json({ message: "Invalid Inputs" })
    }
    let existingAdmin;
    try {
        existingAdmin = await Admin.findOne({ email })

    } catch (err) {
        return console.log(err)
    }
    if (!(secretkey === secret_key)) {
        return res.status(400).json({ message: "Wrong secret key" });
    }
    if (existingAdmin) {
        return res.status(400).json({ message: "Admin already exists! Login instead" })
    }



    const hashedPassword = bcrypt.hashSync(password);
    let admins;
    try {
        admins = new Admin({ first_name, last_name, email, password: hashedPassword, contact_number, is_active: false, is_deleted: false });
        admins = await admins.save();
    } catch (err) {
        return console.log(err);
    }
    if (!admins) {
        return res.status(500).json({ message: "unexpected Error Occcured" });
    }

    return res.status(201).json({ message: "The secret key is correct and admin signup is successful", admins: admins });
};





export const AdminLogin = async (req, res, next) => {
    const { email, password } = req.body;
    if (
        !email &&
        email.trim() === "" &&
        !password &&
        password.trim() === ""

    ) {
        return res.status(422).json({ message: "Invalid Inputs" })
    }

    let existingAdmin;
    try {
        existingAdmin = await Admin.findOne({ email });
    } catch (err) {
        return console.log(err)
    }
    if (!existingAdmin) {
        {
            return res.status(400).json({ message: "Unable to find admin from this ID" })
        }
    }
    const isPasswordCorrect = bcrypt.compareSync(password, existingAdmin.password)

    if (!isPasswordCorrect) {
        return res.status(400).json({ message: " Incorrect Password" })

    }

    const token = jwt.sign({ id: existingAdmin.id }, process.env.SECRET_KEY, {
        expiresIn: "7d",
    });


    return res.status(200).json({ message: 'Admin login successful', token, id: existingAdmin._id })
}





export const AdminDelete = async (req, res, next) => {
    const _id = req.params.id;
    try {
        const admin = await Admin.findByIdAndUpdate(_id, { is_deleted: true });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        return res.status(200).json({ message: "Admin deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
}






export const AdminUpdate = async (req, res, next) => {
    const id = req.params.id;
    const { email, password, is_active, is_deleted } = req.body;

    if (!email || email.trim() === "" || !password || password.trim() === "") {
        return res.status(422).json({ message: "Invalid Inputs" });
    }

    try {
        const admin = await Admin.findByIdAndUpdate(
            id,
            { email, password, is_active, is_deleted },
            { new: true }
        );

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.status(200).json({ message: "Updated successfully", admin });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

// export const AdminDelete = async (req, res, next) => {
//     const _id = req.params.id;
//     let admin;
//     try {
//         admin = await admin.findByIdAndUpdate(_id, { is_deleted: true });
//     } catch (err) {
//         return console.log(err)
//     }
//     if (!admin) {
//         return res.status(500).json({ message: "Something went wrong" });
//     }
//     return res.status(200).json({ message: "admin Deleted successfully" })
// }

export const getAdmin = async (req, res, next) => {
    let admins;
    try {
        admins = await Admin.find()
    } catch (err) {
        return console.log(err);
    }
    if (!admins) {
        return res.status(500).json({ message: "Inter server Error" })
    }
    return res.status(200).json({ admins })
}