import React from 'react';

export const Input = ({ type = "text", value, onChange, readOnly }) => (
  <input type={type} value={value} onChange={onChange} readOnly={readOnly} />
);
