import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home';
import Problems from './Problems';
import Problem from './Problem';
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
          </ul>
        </nav>

        <Routes>
          <Route path="/problems/:id" element={<Problem />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
