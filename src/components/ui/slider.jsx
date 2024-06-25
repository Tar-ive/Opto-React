import React from 'react';

export const Slider = ({ value, onValueChange, max, step }) => (
  <input
    type="range"
    value={value}
    onChange={(e) => onValueChange([parseFloat(e.target.value)])}
    max={max}
    step={step}
  />
);
