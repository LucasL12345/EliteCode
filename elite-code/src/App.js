import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home';
import Problems from './Problems';
import Problem from './Problem';
import Login from './Login';
import Register from './Register';
import './App.css';
import axios from 'axios';

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
    localStorage.setItem('username', username); // Store the username in localStorage
  };

  const handleLogout = () => {
    setUsername('');
    // Remove the token from the backend
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('username'); // Remove the username from localStorage
  };

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/problems">Problems</Link>
            </li>
            <li style={{ float: 'right' }}>
              {username ? (
                <>
                  {username}
                  <button onClick={handleLogout}>Logout</button>
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
        </nav>
        <Routes>
          <Route path="/problems/:id" element={<Problem username={username} />} />
          <Route path="/problems" element={<Problems username={username} />} />
          <Route path="/login" element={<Login handleLogin={handleLogin} />} />
          <Route path="/register" element={<Register handleLogin={handleLogin} />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
