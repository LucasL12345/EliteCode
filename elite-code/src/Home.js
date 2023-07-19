import React from 'react';
import './App.css';
import home_img from './images/home_img.jpeg';
import { useNavigate } from 'react-router';

function Home() {

  const navigate = useNavigate();

  const navigateToProblems = () => {
    navigate('/problems')
  }
  
  return (
    <div className="home-container">
      <div className="home-text">
        <h1>Welcome to Elitecode!</h1>
        <p>Get started with improving your coding skills today. Elitecode offers a wide variety of coding problems for you to solve. Are you up for the challenge?</p>
        <button className="home-btn" onClick={navigateToProblems}>Get Started</button>
      </div>
      <div className="home-image">
        <img className="home-img" src={home_img} alt="img" />
      </div>
    </div>
  );
}

export default Home;
