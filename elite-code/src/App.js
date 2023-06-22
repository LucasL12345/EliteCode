import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home';
import Problems from './Problems';
import Problem from './Problem';
import Login from './Login';
import Register from './Register';
import './App.css';

function App() {
  const [username, setUsername] = useState('');

  const handleLogin = (username) => {
    setUsername(username);
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
                `${username}`
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
          <Route path="/problems/:id" element={<Problem />} />
          <Route path="/problems" element={<Problems />} />
          <Route
            path="/login"
            element={<Login handleLogin={handleLogin} />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
