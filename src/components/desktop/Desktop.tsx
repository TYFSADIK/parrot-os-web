'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useDesktopStore } from '@/store/desktop';
import Wallpaper from './Wallpaper';
import TopPanel from './TopPanel';
import BottomPanel from './BottomPanel';
import DesktopIcon from './DesktopIcon';
import WindowManager from '@/components/windows/WindowManager';
import BootScreen from '@/components/ui/BootScreen';
import ContextMenu, { ContextMenuItem } from '@/components/ui/ContextMenu';

// Command of the day data
const COMMANDS_OF_THE_DAY = [
  { cmd: 'grep -r "pattern" /path', desc: 'Recursively search for a text pattern in all files under a directory.' },
  { cmd: 'find / -name "*.conf" -type f', desc: 'Find all .conf files anywhere on the filesystem.' },
  { cmd: 'chmod 755 script.sh', desc: 'Make a script executable by the owner and readable/executable by others.' },
  { cmd: 'ps aux | grep nginx', desc: 'List all processes and filter for nginx — pipes are essential in Linux.' },
  { cmd: 'tar -czf backup.tar.gz ~/Documents', desc: 'Create a compressed gzipped tarball of your Documents folder.' },
  { cmd: 'netstat -tulpn', desc: 'Show all listening TCP/UDP ports with the programs using them.' },
  { cmd: 'awk \'{print $1}\' /var/log/access.log', desc: 'Extract the first column from every line in a file — great for log analysis.' },
  { cmd: 'curl -I https://example.com', desc: 'Fetch only the HTTP response headers from a URL, without the body.' },
  { cmd: 'ssh -L 8080:localhost:80 user@host', desc: 'Create a local port forward via SSH — tunnel remote port 80 to your local 8080.' },
  { cmd: 'nmap -sV -sC 192.168.1.0/24', desc: 'Scan a subnet for open ports with service version detection and default scripts.' },
  { cmd: 'sudo !! ', desc: 'Re-run the last command with sudo — useful when you forget to sudo.' },
  { cmd: 'history | grep ssh', desc: 'Search your command history for all previous ssh commands.' },
  { cmd: 'df -h', desc: 'Display disk free space in human-readable format (GB, MB) for all mounted filesystems.' },
  { cmd: 'diff file1.txt file2.txt', desc: 'Compare two files line by line and show what changed.' },
  { cmd: 'wc -l /etc/passwd', desc: 'Count the number of lines in /etc/passwd — equals the number of user accounts.' },
];

const DESKTOP_ICONS = [
  {
    app: 'terminal' as const,
    label: 'Terminal',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#0d0d0d" />
        <path d="M5 8l4 4-4 4" stroke="#00d4aa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13 16h6" stroke="#00d4aa" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    x: 28,
    y: 60,
  },
  {
    app: 'filemanager' as const,
    label: 'Files',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M3 6a2 2 0 012-2h4.586a1 1 0 01.707.293L11.707 5.7A1 1 0 0012.414 6H19a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V6z" fill="#60a5fa" fillOpacity="0.9" />
        <path d="M3 10h18" stroke="#93c5fd" strokeWidth="1.2" />
      </svg>
    ),
    x: 28,
    y: 155,
  },
  {
    app: 'lessons' as const,
    label: 'Lessons',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" fill="#7c3aed" fillOpacity="0.8" />
        <path d="M7 8h10M7 12h10M7 16h6" stroke="#c4b5fd" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="17" cy="16" r="3" fill="#a78bfa" />
        <path d="M16 16l1 1 1.5-1.5" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    x: 28,
    y: 250,
  },
  {
    app: 'texteditor' as const,
    label: 'Text Editor',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="2" width="18" height="20" rx="2" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
        <path d="M7 7h10M7 11h10M7 15h7" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16 17l2-2-2-2" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    x: 28,
    y: 345,
  },
  {
    app: 'systeminfo' as const,
    label: 'System Info',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="4" width="20" height="14" rx="2" fill="#0f2040" stroke="#34d399" strokeWidth="1" />
        <path d="M5 13l4-4 3 3 4-6 3 4" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="8" y="18" width="8" height="2" rx="1" fill="#34d399" fillOpacity="0.5" />
      </svg>
    ),
    x: 28,
    y: 440,
  },
  {
    app: 'about' as const,
    label: 'About Parrot',
    icon: (
      <div className="text-3xl">🦜</div>
    ),
    x: 28,
    y: 535,
  },
];

// Toast notification component
function Toast({
  toast,
  onRemove,
}: {
  toast: { id: string; title: string; message: string; type: string; icon?: string };
  onRemove: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const bgMap: Record<string, string> = {
    achievement: 'rgba(0,212,170,0.12)',
    success: 'rgba(52,211,153,0.12)',
    error: 'rgba(248,113,113,0.12)',
    info: 'rgba(96,165,250,0.12)',
  };
  const borderMap: Record<string, string> = {
    achievement: 'rgba(0,212,170,0.4)',
    success: 'rgba(52,211,153,0.4)',
    error: 'rgba(248,113,113,0.4)',
    info: 'rgba(96,165,250,0.4)',
  };
  const iconMap: Record<string, string> = {
    achievement: '🏆',
    success: '✅',
    error: '❌',
    info: 'ℹ️',
  };

  return (
    <div
      className="toast-enter flex items-start gap-3 p-3 rounded-lg max-w-xs shadow-xl"
      style={{
        background: bgMap[toast.type] || bgMap.info,
        border: `1px solid ${borderMap[toast.type] || borderMap.info}`,
        backdropFilter: 'blur(8px)',
      }}
    >
      <span className="text-xl flex-shrink-0">{toast.icon || iconMap[toast.type]}</span>
      <div className="min-w-0">
        <div className="text-xs font-semibold text-white truncate">{toast.title}</div>
        <div className="text-xs text-gray-400 mt-0.5 leading-tight">{toast.message}</div>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-gray-600 hover:text-gray-400 flex-shrink-0 ml-1 text-xs"
      >
        ✕
      </button>
    </div>
  );
}

export default function Desktop() {
  const {
    bootCompleted,
    setBootCompleted,
    toasts,
    removeToast,
    openWindow,
  } = useDesktopStore();

  const [desktopContextMenu, setDesktopContextMenu] = useState<{ x: number; y: number } | null>(
    null
  );
  const [cmdOfDay] = useState(
    () => COMMANDS_OF_THE_DAY[Math.floor(Math.random() * COMMANDS_OF_THE_DAY.length)]
  );

  const handleDesktopRightClick = useCallback((e: React.MouseEvent) => {
    // Only if clicking directly on desktop (not a window/icon)
    const target = e.target as HTMLElement;
    if (
      target.closest('[data-window]') ||
      target.closest('[data-desktop-icon]') ||
      target.closest('[data-panel]')
    )
      return;
    e.preventDefault();
    setDesktopContextMenu({ x: e.clientX, y: e.clientY });
  }, []);

  const desktopMenuItems: ContextMenuItem[] = [
    { label: 'Open Terminal', icon: '⬛', action: () => openWindow('terminal') },
    { label: 'Open Files', icon: '📁', action: () => openWindow('filemanager') },
    { label: '', separator: true },
    { label: 'Linux Lessons', icon: '📚', action: () => openWindow('lessons') },
    { label: 'System Info', icon: '💻', action: () => openWindow('systeminfo') },
    { label: '', separator: true },
    { label: 'About Parrot OS', icon: '🦜', action: () => openWindow('about') },
  ];

  // Mobile guard
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (isMobile) {
    return (
      <div
        className="fixed inset-0 flex flex-col"
        style={{ background: '#0a0f1a' }}
      >
        <div
          className="w-full h-8 flex items-center px-3 text-xs text-parrot-accent"
          style={{ background: '#16213e', borderBottom: '1px solid rgba(0,212,170,0.2)' }}
        >
          Parrot OS Web — Mobile Terminal
        </div>
        <div className="flex-1 overflow-hidden">
          {/* Show just terminal on mobile */}
          <div className="w-full h-full" style={{ background: '#0d0d0d' }}>
            <div className="p-3 text-xs text-gray-400 font-mono">
              For the full desktop experience, please open this on a desktop browser (width ≥ 768px).
              <br /><br />
              <span style={{ color: '#00d4aa' }}>Tip:</span> On mobile, you can still interact with the terminal below.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!bootCompleted) {
    return <BootScreen onComplete={setBootCompleted} />;
  }

  return (
    <div
      className="fixed inset-0 overflow-hidden select-none"
      style={{ background: '#1a1a2e' }}
      onContextMenu={handleDesktopRightClick}
    >
      {/* Wallpaper layer */}
      <Wallpaper />

      {/* Top panel */}
      <div data-panel="top">
        <TopPanel />
      </div>

      {/* Desktop area */}
      <div
        className="absolute inset-0"
        style={{ top: 28, bottom: 36 }}
        onClick={() => setDesktopContextMenu(null)}
      >
        {/* Desktop icons */}
        {DESKTOP_ICONS.map((icon) => (
          <div key={icon.app} data-desktop-icon>
            <DesktopIcon
              app={icon.app}
              label={icon.label}
              icon={icon.icon}
              x={icon.x}
              y={icon.y}
            />
          </div>
        ))}

        {/* Command of the day widget */}
        <div
          className="absolute"
          style={{ right: 20, top: 16 }}
        >
          <div
            className="w-72 rounded-lg p-3"
            style={{
              background: 'rgba(10, 18, 36, 0.75)',
              border: '1px solid rgba(0,212,170,0.2)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold" style={{ color: '#00d4aa' }}>
                Command of the Day
              </span>
              <div
                className="flex-1 h-px"
                style={{ background: 'rgba(0,212,170,0.2)' }}
              />
            </div>
            <code
              className="block text-xs mb-1.5 px-2 py-1 rounded font-mono"
              style={{
                background: 'rgba(0,0,0,0.5)',
                color: '#7dd3fc',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              $ {cmdOfDay.cmd}
            </code>
            <p className="text-xs leading-relaxed" style={{ color: '#94a3b8' }}>
              {cmdOfDay.desc}
            </p>
          </div>
        </div>

        {/* Window manager renders all open windows */}
        <WindowManager />
      </div>

      {/* Bottom panel */}
      <div data-panel="bottom">
        <BottomPanel />
      </div>

      {/* Toast notifications */}
      <div className="fixed bottom-12 right-4 flex flex-col gap-2 z-[9500] pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <Toast toast={t} onRemove={removeToast} />
          </div>
        ))}
      </div>

      {/* Desktop context menu */}
      {desktopContextMenu && (
        <ContextMenu
          x={desktopContextMenu.x}
          y={desktopContextMenu.y}
          items={desktopMenuItems}
          onClose={() => setDesktopContextMenu(null)}
        />
      )}
    </div>
  );
}
