import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'danger' | 'dark';
  onClick?: () => void;
  className?: string;
}

export default function Button({ children, variant = "primary", onClick, className }: ButtonProps) {

  const variants = {
    primary: "bg-gradient-to-r from-cyan-400 to-purple-500 shadow-neon",
    danger: "bg-red-500",
    dark: "bg-gray-800"
  };

  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-xl font-semibold transition hover:scale-105 ${variants[variant]} ${className || ''}`}
    >
      {children}
    </button>
  );
}