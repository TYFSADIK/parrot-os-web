'use client';

import React, { useState, useEffect, useRef } from 'react';

const PARROT_ASCII = `
    ██████╗  █████╗ ██████╗ ██████╗  ██████╗ ████████╗
    ██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔═══██╗╚══██╔══╝
    ██████╔╝███████║██████╔╝██████╔╝██║   ██║   ██║
    ██╔═══╝ ██╔══██║██╔══██╗██╔══██╗██║   ██║   ██║
    ██║     ██║  ██║██║  ██║██║  ██║╚██████╔╝   ██║
    ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝    ╚═╝
`.trim();

const PARROT_LOGO = `
         ___
        /   \\
       |  O  |
       |  /\\ |
      / \\/ \\/ \\
     /  Parrot  \\
    /   Security  \\
   /_______________ \\
`.trim();

const BOOT_MESSAGES = [
  '[    0.000000] Linux version 6.1.0-1parrot1-amd64',
  '[    0.000000] BIOS-provided physical RAM map',
  '[    0.000000] ACPI: RSDP 0x00000000000F05B0 000024 (v02 BOCHS)',
  '[    0.001234] PCI: Using configuration type 1 for base access',
  '[    0.012345] clocksource: tsc-early: mask: 0xffffffffffffffff',
  '[  OK  ] Started Journal Service.',
  '[  OK  ] Reached target Local File Systems (Pre).',
  '[  OK  ] Started Load Kernel Modules.',
  '[  OK  ] Mounted Huge Pages File System.',
  '[  OK  ] Started Apply Kernel Variables.',
  '[  OK  ] Reached target Swap.',
  '[  OK  ] Listening on udev Kernel Socket.',
  '[  OK  ] Started udev Coldplug all Devices.',
  '[  OK  ] Finished Remount Root and Kernel File Systems.',
  '[  OK  ] Mounted Configuration File System.',
  '[  OK  ] Started Load/Save Random Seed.',
  '[  OK  ] Reached target Local Encrypted Volumes.',
  '[  OK  ] Reached target Local File Systems.',
  '[  OK  ] Started Network Service.',
  '[  OK  ] Started Network Time Synchronization.',
  '[  OK  ] Reached target System Time Synchronized.',
  '[  OK  ] Started D-Bus System Message Bus.',
  '[  OK  ] Started Login Service.',
  '[  OK  ] Reached target Network.',
  '[  OK  ] Started OpenSSH Server Daemon.',
  '[  OK  ] Started CUPS Scheduler.',
  '[  OK  ] Started Avahi mDNS/DNS-SD Stack.',
  '[  OK  ] Reached target Multi-User System.',
  '[  OK  ] Started MATE Display Manager.',
  '',
  'Parrot OS 5.3 (Electro Ara) parrot-os tty1',
  'parrot-os login: parrot',
  'Password: ********',
  'Last login: Sat Mar 29 07:30:00 2026',
  '',
  'Welcome to Parrot OS!',
];

interface BootScreenProps {
  onComplete: () => void;
}

export default function BootScreen({ onComplete }: BootScreenProps) {
  const [phase, setPhase] = useState<'logo' | 'messages' | 'progress' | 'fadeout'>('logo');
  const [visibleMessages, setVisibleMessages] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [logoVisible, setLogoVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => {
    // Phase 1: Show logo
    setTimeout(() => setLogoVisible(true), 100);

    // Phase 2: Start messages
    setTimeout(() => {
      setPhase('messages');
      let msgIdx = 0;
      const msgInterval = setInterval(() => {
        if (msgIdx < BOOT_MESSAGES.length) {
          setVisibleMessages(prev => [...prev, BOOT_MESSAGES[msgIdx]]);
          msgIdx++;
          if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
          }
        } else {
          clearInterval(msgInterval);
          setPhase('progress');
        }
      }, 60);
    }, 800);
  }, []);

  // Phase 3: Progress bar
  useEffect(() => {
    if (phase !== 'progress') return;

    let prog = 0;
    const progressInterval = setInterval(() => {
      prog += Math.random() * 8 + 3;
      if (prog >= 100) {
        prog = 100;
        setProgress(100);
        clearInterval(progressInterval);

        // Phase 4: Fade out
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(onComplete, 600);
        }, 400);
      } else {
        setProgress(prog);
      }
    }, 60);

    return () => clearInterval(progressInterval);
  }, [phase, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center transition-opacity duration-600 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Parrot ASCII Logo */}
      <div
        className={`text-center transition-all duration-500 ${
          logoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <pre
          className="text-parrot-accent text-xs leading-tight mb-2"
          style={{ fontFamily: "'Ubuntu Mono', monospace", fontSize: '10px' }}
        >
          {PARROT_ASCII}
        </pre>
        <div className="text-gray-500 text-xs mt-1">Electro Ara · Parrot OS 5.3</div>
      </div>

      {/* Boot messages */}
      <div
        ref={messageContainerRef}
        className="mt-6 w-full max-w-2xl h-48 overflow-hidden px-4"
        style={{ fontFamily: "'Ubuntu Mono', monospace" }}
      >
        {visibleMessages.map((msg, i) => (
          <div
            key={i}
            className={`text-xs leading-5 boot-message ${
              msg.includes('[  OK  ]')
                ? 'text-green-400'
                : msg.includes('Welcome')
                ? 'text-parrot-accent font-bold'
                : msg.includes('login:') || msg.includes('Password:')
                ? 'text-yellow-300'
                : 'text-gray-400'
            }`}
          >
            {msg || '\u00A0'}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      {phase === 'progress' && (
        <div className="mt-6 w-full max-w-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Loading desktop environment...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #00a882, #00d4aa)',
                boxShadow: '0 0 8px #00d4aa88',
              }}
            />
          </div>
        </div>
      )}

      {/* Skip button */}
      <button
        onClick={() => {
          setFadeOut(true);
          setTimeout(onComplete, 300);
        }}
        className="absolute bottom-6 right-6 text-xs text-gray-600 hover:text-gray-400 transition-colors"
      >
        Skip →
      </button>

      {/* Parrot logo watermark */}
      <div
        className="absolute opacity-5 pointer-events-none"
        style={{ fontSize: '300px', bottom: '-50px', right: '-50px' }}
      >
        🦜
      </div>
    </div>
  );
}
