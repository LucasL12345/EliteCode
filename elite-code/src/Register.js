import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register({ handleLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  
  const register = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/register', { username, password });
      localStorage.setItem('token', response.data.token);
      handleLogin(username);
      navigate("/problems");
    } catch(err) {
      console.error(err);
      alert('Registration failed');
    }
  };

  return (
    <form onSubmit={register} className="register-form">
      <h2> Elitecode </h2>
      <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
