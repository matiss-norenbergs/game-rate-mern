import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/navbar/NavBar";
import Home from "./pages/home/Home";
import Games from "./pages/games/Games";
import Game from "./pages/game/Game";
import Profile from "./pages/profile/Profile";
import Login from "./pages/registerlogin/Login";
import Register from "./pages/registerlogin/Register";
import Submit from './pages/submit/Submit';
import Admin from './pages/admin/Admin';
import AdminHome from './pages/admin/AdminHome';
import AdminTags from './pages/admin/AdminTags';
import AdminGames from './pages/admin/AdminGames';

function App() {
  return (
    <>
      <Router>
        <NavBar />

        <Routes>
          <Route exact path="/" element={ <Home /> } />
          <Route path="/games" element={ <Games /> } />
          <Route path="/game/:id" element={ <Game /> } />
          <Route path="/submit" element={ <Submit /> } />
          <Route path="/profile" element={ <Profile /> } />
          <Route path="/login" element={ <Login /> } />
          <Route path="/register" element={ <Register /> } />
          <Route path="/admin" element={ <Admin /> } >
            <Route path="/admin/dashboard" element={ <AdminHome /> } />
            <Route path="/admin/games" element={ <AdminGames /> } />
            <Route path="/admin/gametags" element={ <AdminTags /> } />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
