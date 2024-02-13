import jwt from "jsonwebtoken";
import Movie from "../models/Movie.js";
import Admin from "../models/Admin.js";
import mongoose from "mongoose";


export const addMovie = async (req, res, next) => {
    const extractedToken = req.headers.authorization.split(" ")[1];
    if (!extractedToken && extractedToken.trim() === "") {
        return res.status(404).json({ message: "Token not found" });
    }

    let adminId;
    jwt.verify(extractedToken, process.env.SECRET_KEY, (err, decrypted) => {
        if (err) {
            return res.status(400).json({ message: `${err.message}` });
        } else {
            adminId = decrypted.id;
            return;
        }
    });

    const {
        name,
        genre,
        release_date,
        cast,
        image,
        crew,
        admin } = req.body

    const releaseDate = new Date(release_date);
    if (isNaN(releaseDate.getTime())) {
        return res.status(422).json({ message: "Invalid release date" });
    }
    if ((!name || name.trim() == "") && (!genre || genre.trim() == "") && (!release_date || release_date.trim() == "") && (!cast || cast.trim() == "") && (!crew || crew.trim() == "")) {
        return res.status(422).json({ message: "Invalid Inputs" })
    }


    let movie;
    try {
        movie = new Movie({
            name,
            genre,
            releaseDate,
            image,
            cast,
            crew,
            admin,
            is_active: true,
        });

        const session = await mongoose.startSession();
        const adminUser = await Admin.findById(adminId);
        session.startTransaction();
        await movie.save({ session });
        adminUser.addedMovies.push(movie);
        await adminUser.save({ session });
        await session.commitTransaction();

    } catch (err) {
        return console.log(err)
    }
    if (!movie) {
        return res.status(500).json({ message: "Request Failed" })
    }
    return res.status(201).json({ message: "Movie added successfully" })
}





export const getAllMovies = async (req, res, next) => {
    let movies;
    try {
        movies = await Movie.find();
    } catch (err) {
        return console.log(err)
    }
    if (!movies) {
        return res.status(500).json({ message: "Request failed" });
    }
    return res.status(200).json({ movies })
}











export const getMovieById = async (req, res, next) => {
    let id = req.params.id;
    let movie;
    try {
        movie = await Movie.findById(id)
    } catch (err) {
        return console.log(err)
    }
    if (!movie) {
        return res.status(404).json({ message: "Invalid Id" })
    }
    return res.status(200).json({ movie })
}










export const deleteMovieById = async (req, res, next) => {
    let id = req.params.id;
    let movie;
    try {
        movie = await Movie.findByIdAndUpdate(id, { is_active: false });
    } catch (err) {
        return console.log(err)
    }
    if (!movie) {
        return res.status(404).json({ message: "Something went wrong" })
    }
    return res.status(200).json({ message: "Movie Deleted" })
}


export const updateMovie = async (req, res, next) => {
    const id = req.params.id;
    const { name, genre, cast, crew, release_date, image } = req.body;
    if (
        !name &&
        name.trim() === "" &&
        !genre &&
        genre.trim() === "" &&
        !cast &&
        cast.trim() === "" &&
        !crew &&
        crew.trim() === ""
    )
        return res.status(422).json({ message: "Invalid Inputs" })

    let user;
    try {
        user = await Movie.findByIdAndUpdate(id, { name, genre, cast, crew, release_date, image, is_active: true})
    } catch (err) {
        return console.log(err)
    }
    if (!user) {
        return res.status(500).json({ message: "Something went wrong" })
    }
    res.status(200).json({ message: "Updated successfully" })
}