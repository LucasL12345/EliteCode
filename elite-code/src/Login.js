import React, { useState } from 'react';
import axios from 'axios';

function Login({ handleLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:4000/login', { username, password });
      localStorage.setItem('token', response.data.token);
      handleLogin(username);
      alert('Logged in successfully!');
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
    setLoading(false);
  };


  return (
    <form onSubmit={login}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
      {loading && <div>Loading...</div>}
    </form>
  );
}

export default Login;
