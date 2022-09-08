import React, { useEffect, useState } from "react";

import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

import classes from "./Menu.module.css";

const Menu = ({ setLine, setLineColor, setLineWidth, setLineOpacity, setClear }) => {
  const [radioValue, setRadioValue] = useState("round");
  const [width, setWidth] = useState(10);
  const [opacity, setOpacity] = useState(100);

  const handleChangeRadioValue = (event) => {
    setRadioValue(event.target.value);
  };

  useEffect(() => {
    if (radioValue === "round") {
      setLine("round")
      setWidth(10)
      setOpacity(100)
    } else {
      setLine("square")
      setWidth(25)
      setOpacity(50)
    }
  }, [radioValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLineWidth(width);
      console.log(width);
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [width]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLineOpacity(opacity / 100);
      console.log(opacity / 100);
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [opacity]);

  return (
    <div className={classes.menu}>
      <FormControl sx={{ flexDirection: "row" }}>
        <FormLabel
          id='demo-controlled-radio-buttons-group'
          sx={{ color: "black", fontWeight: "bold", mr: 2 }}
        >
          Line type
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby='demo-controlled-radio-buttons-group'
          name='controlled-radio-buttons-group'
          value={radioValue}
          onChange={handleChangeRadioValue}
        >
          <FormControlLabel value='round' control={<Radio />} label='Pen' />
          <FormControlLabel value='square' control={<Radio />} label='Marker' />
        </RadioGroup>
      </FormControl>
      <div>
        <label>Brush Color </label>
        <input
          type='color'
          onChange={(e) => {
            setLineColor(e.target.value);
          }}
        />
      </div>
      <div>
        <label>Brush Width</label>
        <input
          type='range'
          value={width}
          min='1'
          max='20'
          onChange={(e) => {
            setWidth(e.target.value);
          }}
        />
      </div>
      <div>
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
      </div>
      <button type='button' onClick={() => setClear(true)}>
        Clear
      </button>
    </div>
  );
};

export default Menu;
