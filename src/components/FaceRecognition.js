import '../App.css';
import './FaceRecognition.css';
import React from 'react';

const FaceRecognition = ({ imageURL, box }) => {
  return (
    <div className="center ma">
      <div className="absolute mt2">
        <img src={imageURL} alt="placeholder stock" width="500px" height="auto" id="inputImage" />
        <div className="bounding-box" style={{ top: box.topRow, left: box.leftCol, right: box.rightCol, bottom: box.bottomRow }}></div>
      </div>
    </div>
  )
}
export default FaceRecognition;