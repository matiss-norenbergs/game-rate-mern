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
import ProtectedRoutes from './components/protectedroutes/ProtectedRoutes';
import AdminPosts from './pages/adminposts/AdminPosts';
import PostCreate from './pages/admincreate/PostCreate';
import PostUpdate from './pages/adminupdate/PostUpdate';

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

          <Route element={ <ProtectedRoutes /> }>
            <Route path="/profile" element={ <Profile /> } />
          </Route>
          
          <Route path="/login" element={ <Login /> } />
          <Route path="/register" element={ <Register /> } />
          <Route path="/admin" element={ <AdminNav /> } >
            <Route index element={ <AdminDashboard /> } />
            <Route path="dashboard" element={ <AdminDashboard /> } />
            <Route path="games" element={ <AdminGames /> } />
            <Route path="game/update/:id" element={ <GameUpdate /> } />
            <Route path="tags" element={ <AdminTags /> } />
            <Route path="tag/create" element={ <TagCreate /> } />
            <Route path="tag/update/:id" element={ <TagUpdate /> } />
            <Route path="posts" element={ <AdminPosts /> } />
            <Route path="post/create" element={ <PostCreate /> } />
            <Route path="post/update/:id" element={ <PostUpdate /> } />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
