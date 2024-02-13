import express from "express";
import { getMovieById, getAllMovies, addMovie, deleteMovieById, updateMovie } from "../controllers/movie-controllers.js";
const movieRouter = express.Router();


movieRouter.post("/", addMovie)
movieRouter.get("/", getAllMovies)
movieRouter.get("/:id", getMovieById)
movieRouter.put("/:id", updateMovie)
movieRouter.patch("/:id", deleteMovieById)

export default movieRouter;