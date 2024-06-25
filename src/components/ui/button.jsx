import React from 'react';

export const Button = ({ onClick, children }) => (
  <button onClick={onClick}>{children}</button>
);
