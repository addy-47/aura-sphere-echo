
import React from 'react';

interface SpotifyIconProps {
  className?: string;
  size?: number | string;
  color?: string;
}

const SpotifyIcon: React.FC<SpotifyIconProps> = ({ 
  className, 
  size = 24, 
  color = "currentColor" 
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 11.2c3.2-1.6 6.4-1.6 9.6 0" />
      <path d="M8 14.4c3.2-1.6 6.4-1.6 9.6 0" />
      <path d="M8 8c3.2-1.6 6.4-1.6 9.6 0" />
    </svg>
  );
};

export default SpotifyIcon;
