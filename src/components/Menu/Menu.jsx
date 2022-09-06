import React, { useEffect, useState } from "react";
import classes from "./Menu.module.css";

const Menu = ({ setLineColor, setLineWidth, setLineOpacity, setClear }) => {
  const [width, setWidth] = useState(7.5);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    setLineWidth(width);
  }, [width]);
  useEffect(() => {
    setLineOpacity(opacity / 100);
  }, [opacity]);

  return (
    <div className={classes.menu}>
      <label>Brush Color </label>
      <input
        type='color'
        onChange={(e) => {
          setLineColor(e.target.value);
        }}
      />
      <label>Brush Width</label>
      <input
        type='range'
        value={width}
        min='1'
        max='15'
        onChange={(e) => {
          setWidth(e.target.value);
        }}
      />
      <label>Brush Opacity</label>
      <input
        type='range'
        value={opacity}
        min='1'
        max='100'
        onChange={(e) => {
          setOpacity(e.target.value);
        }}
      />
      <button type='button' onClick={() => setClear(true)}>
        Clear
      </button>
    </div>
  );
};

export default Menu;
