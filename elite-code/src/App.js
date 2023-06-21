import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home';
import Problems from './Problems';
import Problem from './Problem';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import './App.css';

function App() {
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
                      <li>
                          <Link to="/login">Login</Link>
                      </li>
                      <li>
                          <Link to="/register">Register</Link>
                      </li>
                  </ul>
              </nav>

              <Routes>
                  <Route path="/login" element={<LoginForm />} />
                  <Route path="/register" element={<RegistrationForm />} />
                  <Route path="/problems/:id" element={<Problem />} />
                  <Route path="/problems" element={<Problems />} />
                  <Route path="/" element={<Home />} />
              </Routes>
          </div>
      </Router>
  );
}

export default App;
