'use client';

import React from 'react';

export default function Wallpaper() {
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* Radial gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0, 212, 170, 0.06) 0%, transparent 70%),
            radial-gradient(ellipse 100% 80% at 20% 80%, rgba(0, 100, 200, 0.04) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 20%, rgba(0, 212, 170, 0.04) 0%, transparent 50%),
            linear-gradient(135deg, #0a0f1a 0%, #1a1a2e 40%, #0d1624 70%, #0a0f1a 100%)
          `,
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,170,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,170,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Large Parrot logo watermark — animated slow rotation */}
      <div
        className="absolute inset-0 flex items-center justify-center opacity-[0.025]"
      >
        <svg
          className="rotate-slow"
          width="520"
          height="520"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Simplified parrot / shield shape */}
          <circle cx="100" cy="100" r="96" stroke="#00d4aa" strokeWidth="1.5" fill="none" />
          <circle cx="100" cy="100" r="80" stroke="#00d4aa" strokeWidth="0.5" fill="none" />
          {/* Parrot bird silhouette */}
          <ellipse cx="100" cy="85" rx="28" ry="32" fill="#00d4aa" />
          <ellipse cx="100" cy="78" rx="18" ry="20" fill="#00d4aa" />
          {/* Beak */}
          <polygon points="100,68 108,74 100,76" fill="#1a1a2e" />
          {/* Eye */}
          <circle cx="94" cy="74" r="3" fill="#1a1a2e" />
          {/* Tail feathers */}
          <path d="M 80 110 Q 70 140 65 160" stroke="#00d4aa" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 90 115 Q 85 148 82 168" stroke="#00d4aa" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 100 118 Q 100 150 100 172" stroke="#00d4aa" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 110 115 Q 115 148 118 168" stroke="#00d4aa" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 120 110 Q 130 140 135 160" stroke="#00d4aa" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Wings */}
          <path d="M 72 90 Q 55 85 50 95 Q 55 105 72 100 Z" fill="#00d4aa" />
          <path d="M 128 90 Q 145 85 150 95 Q 145 105 128 100 Z" fill="#00d4aa" />
          {/* Text arc */}
          <text
            x="100"
            y="100"
            textAnchor="middle"
            fill="#00d4aa"
            fontSize="8"
            fontFamily="Ubuntu, sans-serif"
            letterSpacing="8"
          >
            <textPath href="#circle-path" startOffset="0%">
              PARROT OS · SECURITY · PRIVACY · FREEDOM ·
            </textPath>
          </text>
          <defs>
            <path id="circle-path" d="M 100,12 A 88,88 0 1,1 99.99,12" />
          </defs>
        </svg>
      </div>

      {/* Subtle corner accents */}
      <div
        className="absolute top-0 left-0 w-48 h-48 opacity-[0.03]"
        style={{
          background: 'radial-gradient(circle at top left, #00d4aa, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-64 h-64 opacity-[0.03]"
        style={{
          background: 'radial-gradient(circle at bottom right, #00d4aa, transparent 70%)',
        }}
      />
    </div>
  );
}
