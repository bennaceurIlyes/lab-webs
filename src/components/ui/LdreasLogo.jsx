import React from 'react';
import logoImg from '../../assets/logo.jpg';

export default function LdreasLogo({ variant = 'dark', className = '', ...props }) {
  return (
    <img 
      src={logoImg} 
      alt="Laboratory Logo" 
      className={`object-contain bg-white rounded-full ${className}`}
      {...props}
    />
  );
}
