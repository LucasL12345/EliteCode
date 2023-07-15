import React from 'react';
import './App.css';
import home_img from './images/home_img.jpeg'

function Home() {
  return (
    <div className="home-container">
      <div className="home-text">
        <h1>Welcome to Elitecode!</h1>
        <p>Get started with improving your coding skills today. Elitecode offers a wide variety of coding problems for you to solve. Are you up for the challenge?</p>
        <button className="home-btn">Get Started</button>
      </div>
      <div className="home-image">
        <img src={home_img} alt="img"/>
      </div>
    </div>
  );
}

export default Home;
