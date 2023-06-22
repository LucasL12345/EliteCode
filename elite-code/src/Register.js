import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const register = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:4000/register', { username, password });
      alert('Registered successfully!');
    } catch(err) {
      console.error(err);
      alert('Registration failed');
    }
  };

  return (
    <form onSubmit={register}>
      <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
