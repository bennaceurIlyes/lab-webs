import React from 'react';

export default function LdreasLogo({ variant = 'dark', className = '', ...props }) {
  const isLight = variant === 'light';
  const color = isLight ? '#FFFFFF' : '#0056B3';
  
  return (
    <svg 
      width="160" 
      height="80" 
      viewBox="0 0 160 80" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Geometric Sun */}
      <circle cx="80" cy="34" r="12" stroke={color} strokeWidth="2.5" />
      {/* Rays */}
      <path d="M 80 12 L 80 16 M 80 52 L 80 56 M 58 34 L 62 34 M 98 34 L 102 34 M 64 18 L 67 21 M 93 47 L 96 50 M 96 18 L 93 21 M 67 47 L 64 50" stroke={color} strokeWidth="2" strokeLinecap="round" />
      
      {/* Saharan Dune / Horizon Line */}
      <path d="M 45 56 Q 65 48 80 56 T 115 56" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
      
      {/* Text Mark */}
      <text x="80" y="74" textAnchor="middle" fontFamily="var(--font-display)" fontSize="16" fontWeight="700" fill={color} letterSpacing="2">LDREAS</text>
    </svg>
  );
}
