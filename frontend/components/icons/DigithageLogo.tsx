import React from 'react';

export const DigithageLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 100 100"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 10C14.4772 10 10 14.4772 10 20V80C10 85.5228 14.4772 90 20 90H50C72.0914 90 90 72.0914 90 50C90 27.9086 72.0914 10 50 10H20ZM30 30V70H50C61.0457 70 70 61.0457 70 50C70 38.9543 61.0457 30 50 30H30Z"
    />
  </svg>
);
