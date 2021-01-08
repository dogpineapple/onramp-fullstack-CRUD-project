import React from 'react';
import './Homepage.css';

function Homepage() {
  return (
    <div className="Homepage">
      <div className="Homepage-hero-container">
        <div className="Homepage-hero-text">
          <p className="Homepage-hero-title fade-in-left">
            <p>serving bloggies since 2021</p>
            <p className="Homepage-title-text">bloggies</p>
          </p>
          <h2 className="Homepage-hero-desc fade-in-left-late">Come join the (not-yet-but-soon) coolest blog site!</h2>
          <h3 className="Homepage-hero-desc fade-in-left-late">See what others are posting below!</h3>
        </div>
        <div className="Homepage-hero-img-container fade-in">
          <img src="https://www.pinclipart.com/picdir/big/545-5452844_app-development-vector-svg-clipart.png" alt="hero"></img>
        </div>
      </div>

    </div>
  )
}

export default Homepage;