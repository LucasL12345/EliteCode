import React, { useState } from 'react';
import './App.css';
import home_img from './images/home_img.jpeg';

function Home() {
  const [activeCells, setActiveCells] = useState([]);

  const gridSize = 6;
  const cells = Array(gridSize * gridSize).fill(null);

  const handleMouseOver = (i) => {
    setActiveCells((prev) => [...prev, i]);
    setTimeout(() => {
      setActiveCells((prev) => prev.filter((cell) => cell !== i));
    }, 700);
  };

  return (
    <div className="home-container">
      <div className="home-text">
        <h1>Welcome to Elitecode!</h1>
        <p>Get started with improving your coding skills today. Elitecode offers a wide variety of coding problems for you to solve. Are you up for the challenge?</p>
        <button className="home-btn">Get Started</button>
      </div>
      <div className="home-image" style={{ position: 'relative' }}>
        <img src={home_img} alt="img" />
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexWrap: 'wrap' }}>
          {cells.map((_, i) => (
            <div
              key={i}
              onMouseOver={() => handleMouseOver(i)}
              className={activeCells.includes(i) ? 'glitch' : ''}
              style={{
                width: `${100 / gridSize}%`,
                height: `${100 / gridSize}%`,
                backgroundColor: activeCells.includes(i) ? 'rgba(246, 246, 246, 0.6)' : 'transparent',
                transition: activeCells.includes(i) ? 'background-color 0.4s' : 'background-color 0.2s',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
