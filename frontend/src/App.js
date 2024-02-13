import './App.css';
import HomePage from './components/Pages/All/HomePage/HomePage';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from './components/Pages/All/Login/Login';
import SignUp from './components/Pages/All/Signup/SignUp';
import PersonDetails from './components/Pages/All/PersonDetails/PersonDetails';
import AddMovie from './components/Pages/Admin/AddMovie/AddMovie';
import Layout from './components/Pages/All/Layout/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import EditMovie from './components/Pages/Admin/EditMovie/EditMovie';
import Booking from './components/Pages/User/Bookings/Bookings';


function App() {
  const isLoggedIn = useSelector((state) => state.isLoggedIn)
  const isAdmin = useSelector((state) => state.isAdmin)

  return (
    <Layout>
      <Routes>
        <Route path="/homepage" element={<HomePage />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/persondetails" element={<PersonDetails />}></Route>
        <Route path="/addmovie" element={<AddMovie />}></Route>
        <Route path="/editmovie/:id" element={<EditMovie />}></Route>
        <Route path="/booking/:movieId" element={<Booking />}></Route>
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Layout>
  );
}

export default App;
