import React from 'react';
import './Avatar.css';

const Avatar = ({
  first_name = null,
  last_name = null,
  role,
  onClick = () => null
}) => {
  const empty = first_name === null || last_name === null;

  const getNameInitials = (firstName, lastName) => {
    // toString () helps avoid NaN warning from React
    // by ensuring any response is a string.
    const isEmpty = firstName === null || lastName === null;
    return isEmpty ? '?' : (firstName[0] + lastName[0]).toString();
  };

  return (
    <span
      role={role}
      onClick={onClick}
      className={`avatar ${empty ? 'avatar-grey' : ''}`}
    >
      <span>{getNameInitials(first_name, last_name)}</span>
    </span>
  );
};

export default Avatar;
