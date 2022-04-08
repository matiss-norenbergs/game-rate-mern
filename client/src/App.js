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

function App() {
  return (
    <>
      <Router>
        <NavBar />

        <div className="gameRatePages">
          <Routes>
            <Route exact path="/" element={ <Home /> } />
            <Route path="/games" element={ <Games /> } />
            <Route path="/game/:id" element={ <Game /> } />
            <Route path="/submit" element={ <Submit /> } />
            <Route path="/profile" element={ <Profile /> } />
            <Route path="/login" element={ <Login /> } />
            <Route path="/register" element={ <Register /> } />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
