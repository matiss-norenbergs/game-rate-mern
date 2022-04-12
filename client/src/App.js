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
import AdminNav from './pages/adminnavbar/AdminNav';
import AdminDashboard from './pages/admindashboard/AdminDashboard';
import AdminTags from './pages/admintags/AdminTags';
import AdminGames from './pages/admingames/AdminGames';
import TagCreate from './pages/admincreate/TagCreate';
import TagUpdate from './pages/adminupdate/TagUpdate';
import GameUpdate from './pages/adminupdate/GameUpdate';

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
          <Route path="/admin" element={ <AdminNav /> } >
            <Route index element={ <AdminDashboard /> } />
            <Route path="dashboard" element={ <AdminDashboard /> } />
            <Route path="games" element={ <AdminGames /> } />
            <Route path="games/update/:id" element={ <GameUpdate /> } />
            <Route path="tags" element={ <AdminTags /> } />
            <Route path="tags/create" element={ <TagCreate /> } />
            <Route path="tags/update/:id" element={ <TagUpdate /> } />
            
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
