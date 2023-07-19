import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Home from './Home';
import Problems from './Problems';
import Problem from './Problem';
import Login from './Login';
import Register from './Register';
import Submitted from './Submitted';
import './App.css';
import axios from 'axios';

function Navigation({ username, setUsername }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUsername('');
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    navigate('/problems');
  };

  return (
    <ul>
      <li>
        <Link to="/" className={window.location.pathname === '/' ? 'active' : ''}>Home</Link>
      </li>
      <li>
        <Link to="/problems" className={window.location.pathname.startsWith('/problems') ? 'active' : ''}>Problems</Link>
      </li>
      <li className="right">
        {username ? (
          <>
            <span className="nav-username">{username}</span>
            <button onClick={handleLogout} className="nav-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <span> | </span>
            <Link to="/register">Register</Link>
          </>
        )}
      </li>
    </ul>
  );
}

function App() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogin = (username) => {
    setUsername(username);
    localStorage.setItem('username', username);
  };

  return (
    <Router>
      <div>
        <nav>
          <Navigation username={username} setUsername={setUsername} />
        </nav>

        <Routes>
          <Route path="/problems/:id" element={<Problem username={username} />} />
          <Route path="/problems" element={<Problems username={username} />} />
          <Route path="/login" element={<Login handleLogin={handleLogin} />} />
          <Route path="/register" element={<Register handleLogin={handleLogin} />} />
          <Route path="/submitted" element={<Submitted username={username} />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

