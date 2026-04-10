'use client';

import React from 'react';

const PARROT_ASCII = `
     ___
    /   \\
   | o o |
    \\   /
   /|   |\\
  / | ^ | \\
`.trim();

export default function About() {
  return (
    <div
      className="w-full h-full overflow-y-auto p-6 font-ubuntu"
      style={{ background: '#0f172a', color: '#e2e8f0' }}
    >
      {/* Header */}
      <div className="flex items-start gap-6 mb-6">
        <div
          className="flex-shrink-0 w-20 h-20 rounded-xl flex items-center justify-center text-4xl"
          style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)' }}
        >
          🦜
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Parrot OS 5.3</h1>
          <p className="text-parrot-accent text-sm mt-0.5">Electro Ara</p>
          <p className="text-gray-400 text-xs mt-1">Linux parrot-os 6.1.0-1parrot1-amd64</p>
          <p className="text-gray-400 text-xs">GNU/Linux x86_64</p>
        </div>
      </div>

      {/* Divider */}
      <div className="divider mb-5" />

      {/* System details */}
      <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
        {[
          ['OS', 'Parrot OS 5.3 (Electro Ara)'],
          ['Kernel', '6.1.0-1parrot1-amd64'],
          ['Desktop', 'MATE 1.26.1'],
          ['Base', 'Debian Testing'],
          ['Architecture', 'x86_64'],
          ['Shell', 'bash 5.2.15'],
          ['Package Manager', 'APT (dpkg)'],
          ['Init System', 'systemd 252'],
        ].map(([k, v]) => (
          <div key={k}>
            <span className="text-gray-500 text-xs">{k}</span>
            <p className="text-gray-200 text-xs mt-0.5">{v}</p>
          </div>
        ))}
      </div>

      {/* Description */}
      <div
        className="p-4 rounded-lg mb-5 text-sm"
        style={{ background: 'rgba(0,212,170,0.05)', border: '1px solid rgba(0,212,170,0.15)' }}
      >
        <p className="text-gray-300 leading-relaxed">
          Parrot OS is a Debian-based GNU/Linux distribution focused on security, privacy, and
          development. It offers a full portable lab for security and digital forensics experts,
          with a wide range of tools for cloud penetration testing, web application testing,
          wireless security and more.
        </p>
      </div>

      {/* Features */}
      <h2 className="text-sm font-semibold text-parrot-accent mb-3">Key Features</h2>
      <div className="grid grid-cols-1 gap-2 mb-6">
        {[
          ['🔒', 'Security Tools', '600+ pre-installed security and penetration testing tools'],
          ['🔏', 'Privacy Focused', 'AnonSurf, Tor integration, and privacy by default'],
          ['💻', 'Development', 'Full development environment with compilers and IDEs'],
          ['⚡', 'Lightweight', 'Optimized for performance, runs on low-end hardware'],
          ['🏡', 'Daily Driver', 'Usable as a complete everyday desktop operating system'],
          ['🌐', 'Cloud Ready', 'Minimal cloud edition for servers and containers'],
        ].map(([icon, title, desc]) => (
          <div key={title as string} className="flex items-start gap-3 py-2">
            <span className="text-lg flex-shrink-0">{icon}</span>
            <div>
              <span className="text-white text-xs font-medium">{title}</span>
              <p className="text-gray-400 text-xs mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Links */}
      <div className="divider mb-4" />
      <div className="flex flex-wrap gap-3">
        {[
          ['🌍 parrotsec.org', 'https://parrotsec.org'],
          ['📖 Documentation', 'https://parrotsec.org/docs'],
          ['💬 Community', 'https://community.parrotsec.org'],
          ['🐙 GitHub', 'https://github.com/parrotsec'],
        ].map(([label, href]) => (
          <a
            key={label as string}
            href={href as string}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 rounded transition-colors"
            style={{
              background: 'rgba(0,212,170,0.1)',
              border: '1px solid rgba(0,212,170,0.25)',
              color: '#00d4aa',
            }}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Portfolio credit */}
      <div className="mt-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="text-gray-600 text-xs">
          Interactive simulator built by{' '}
          <a
            href="https://tyfsadik.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-parrot-accent hover:underline"
          >
            MD. Taki Yasir Faraji Sadik
          </a>{' '}
          · Cybersecurity &amp; IT Professional
        </p>
      </div>
    </div>
  );
}
