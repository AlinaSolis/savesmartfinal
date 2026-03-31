import React from 'react';

interface CardProps {
  children: React.ReactNode;
}

export default function Card({ children }: CardProps) {
  return (
    <div className="bg-card p-6 rounded-2xl border border-gray-800 shadow-lg">
      {children}
    </div>
  );
}