'use client';

import React, { useEffect, useState } from 'react';

export default function Confetti() {
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number }>>([]);

  useEffect(() => {
    const pieces = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
    }));
    setConfetti(pieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-2 h-2 animate-bounce"
          style={{
            left: `${piece.left}%`,
            top: '-10px',
            animation: `fall 3s linear ${piece.delay}s forwards`,
            backgroundColor: ['#673ab7', '#ff5722', '#4caf50', '#2196f3', '#ffc107'][
              Math.floor(Math.random() * 5)
            ],
            opacity: 0.8,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
