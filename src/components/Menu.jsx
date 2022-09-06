import React from "react";
import "../App.css";

const Menu = ({ setLineColor, setLineWidth, setLineOpacity, setClear }) => {
  return (
    <div className='Menu'>
      <label>Brush Color </label>
      <input
        type='color'
        onChange={(e) => {
          setLineColor(e.target.value);
        }}
      />
      <label>Brush Width </label>
      <input
        type='range'
        min='3'
        max='20'
        onChange={(e) => {
          setLineWidth(e.target.value);
        }}
      />
      <label>Brush Opacity</label>
      <input
        type='range'
        min='1'
        max='100'
        onChange={(e) => {
          setLineOpacity(e.target.value);
        }}

      />
              <button type="button" onClick={() => setClear(true)}>Clear</button>
    </div>
  );
};

export default Menu;
