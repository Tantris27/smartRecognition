import './Logo.css';
import '../App.css';
import React from 'react';
import Tilt from 'react-parallax-tilt';
import brain from './brain.png';

const Logo = () => {
  return (
    <div className="tiltdiv center ma4 mt0">
      <Tilt>
        <div className="center tilt br3 shadow-2" style={{ height: '150px', width: "150px" }}>
          <img src={brain} alt="logo" />
        </div>
      </Tilt>
    </div>
  )
}
export default Logo;