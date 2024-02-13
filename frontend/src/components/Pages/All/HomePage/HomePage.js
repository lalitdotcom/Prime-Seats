import React, { useEffect, useState } from "react";
import axios from "axios";
import Moviecard from "../MovieCard/Moviecard";
import "./HomePage.css"



const HomePage = () => {
    const [movies, setMovies] = useState([]);
    const getAllmovies = async () => {
        const res = await axios.get("http://localhost:5000/movie").catch(err => console.log(err));
        if (res.status !== 200) {
            return console.log("No data")
        }

        const data = await res.data;
        return data;
    }
    useEffect(() => {
        getAllmovies().then(data => setMovies(data.movies)).catch(err => console.log(err));
    }, [movies])

    const activeMovies = movies.filter((movie) => movie.is_active === true);

    return (
        <div className="home">
            {activeMovies.map((movie) => (
                <Moviecard
                    key={movie._id}
                    id={movie._id}
                    name={movie.name}
                    genre={movie.genre}
                    image={movie.image}
                    releasedate={movie.releaseDate}
                    posterurl={movie.posterurl}
                />
            ))}
        </div>
    )
}

export default HomePage;