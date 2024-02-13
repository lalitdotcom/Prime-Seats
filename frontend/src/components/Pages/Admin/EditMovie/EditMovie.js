import React, { useEffect, useState } from 'react';
import "./EditMovie.css";
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';

const EditMovie = () => {
    const { id } = useParams();
    console.log(id)
    const navigate = useNavigate();
    const [message, setMessage] = useState("");


    const getMovieById = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5000/movie/${id}`);
            if (response.status !== 200) {
                console.log("no data");
                return null;
            }
            const data = response.data;
            // console.log(data)
            return data;

        } catch (error) {
            console.log(error);
            return null;
        }

    };
    // const [movieData, setMovieData] = useState({});


    const [movieData, setMovieData] = useState({
        name: "",
        genre: "",
        release_date: "",
        image: "",
        cast: "",
        crew: "",
        Myfile: "",
    });

    console.log(movieData)

    useEffect(() => {
        getMovieById(id)
            .then(data => {
                if (data && data.movie) {
                    setMovieData(data.movie);
                } else {
                    console.error("Invalid data format:", data);
                }
            })
            .catch(err => console.error("Error fetching movie data:", err));
    }, [id]);



    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertToBase64(file)
        setMovieData(prev => ({ ...prev, Myfile: base64 }));
    }

    const handleChange = (e) => {
        setMovieData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }
    const sendRequest = async () => {
        try {
            const res = await axios.put(`http://localhost:5000/movie/${id}`, {
                name: movieData.name,
                genre: movieData.genre,
                release_date: movieData.release_date,
                image: movieData.Myfile,
                cast: movieData.cast,
                crew: movieData.crew
            });
            const data = res.data;
            setMessage(data.message);
            alert(message)
            return data;
        } catch (err) {
            console.log(err);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        sendRequest().then(() => navigate("/homepage"))
    }

    return (
        <form className='editmovie-container' onSubmit={handleSubmit}>
            <div className='editmovie-header'>
                <div className='editMovie-text'>Edit Movie</div>
                <div className='editmovie-underline'></div>
            </div>
            <div className='editmovie-inputs'>
                <div className="editmovie-inputs">
                    <input className="editmovie-input" type="text" name="name" placeholder="  Name" value={movieData.name} onChange={handleChange} />
                    <input className="editmovie-input" type="text" name="genre" placeholder="  Genre" value={movieData.genre} onChange={handleChange} />
                    <input className="editmovie-input" type="text" name="cast" placeholder="  Cast" value={movieData.cast} onChange={handleChange} />
                    <input className="editmovie-input" type="text" name="crew" placeholder="  Crew" value={movieData.crew} onChange={handleChange} />
                    <div className="editmovie-input-date">
                        <label className='editmovie-label-date'>Release Date:</label>
                        <input type="date" name="release_date" value={movieData.release_date} onChange={handleChange} />
                    </div>
                    <div className="editmovie-input-date">
                        <label className='editmovie-label-date' htmlFor="dateInput">Poster Image:</label>
                        <input type='file' name="MyFile" id="image-upload" accept='.jpg, .png, .jpeg' onChange={(e) => handleFileUpload(e)} />
                    </div>
                </div>
                <div className='editmovie-submit-container'>
                    <button type="submit" className="editmovie-submit">ADD</button>
                </div>
            </div>
        </form >
    );
}

export default EditMovie;

const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            resolve(fileReader.result)
        };
        fileReader.onerror = (error) => {
            reject(error)
        }
    })
}

