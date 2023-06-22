import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const login = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/login', { username, password });
      localStorage.setItem('token', response.data.token);
      alert('Logged in successfully!');
    } catch(err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={login}>
      <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
