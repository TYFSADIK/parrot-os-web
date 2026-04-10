'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDesktopStore } from '@/store/desktop';

interface MenuItem {
  label: string;
  items: { label: string; action?: () => void; separator?: boolean }[];
}

export default function TopPanel() {
  const { learningMode, toggleLearningMode, openWindow } = useDesktopStore();
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
      );
      setDate(
        now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      );
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const menus: MenuItem[] = [
    {
      label: 'Applications',
      items: [
        { label: 'Terminal Emulator', action: () => openWindow('terminal') },
        { label: 'Files (Caja)', action: () => openWindow('filemanager') },
        { label: 'Text Editor', action: () => openWindow('texteditor') },
        { label: 'separator', separator: true },
        { label: 'Linux Lessons', action: () => openWindow('lessons') },
        { label: 'System Info', action: () => openWindow('systeminfo') },
        { label: 'separator', separator: true },
        { label: 'About Parrot OS', action: () => openWindow('about') },
      ],
    },
    {
      label: 'Places',
      items: [
        { label: 'Home Folder', action: () => openWindow('filemanager') },
        { label: 'Desktop', action: () => openWindow('filemanager') },
        { label: 'Documents', action: () => openWindow('filemanager') },
        { label: 'Downloads', action: () => openWindow('filemanager') },
        { label: 'separator', separator: true },
        { label: 'Computer', action: () => openWindow('filemanager') },
        { label: 'Network', action: () => openWindow('filemanager') },
      ],
    },
    {
      label: 'System',
      items: [
        { label: 'Preferences', action: () => openWindow('systeminfo') },
        { label: 'Administration', action: () => openWindow('systeminfo') },
        { label: 'separator', separator: true },
        { label: 'System Information', action: () => openWindow('systeminfo') },
        { label: 'separator', separator: true },
        { label: 'Log Out parrot…', action: () => {} },
        { label: 'Shut Down…', action: () => {} },
      ],
    },
  ];

  return (
    <div
      className="absolute top-0 left-0 right-0 h-7 panel-glass flex items-stretch select-none z-[1000]"
      style={{ borderBottom: '1px solid rgba(0,212,170,0.15)' }}
      ref={menuRef}
    >
      {/* Left: Application menus */}
      <div className="flex items-stretch">
        {menus.map((menu) => (
          <div key={menu.label} className="relative">
            <button
              className={`h-full px-3 text-xs font-ubuntu transition-colors ${
                openMenu === menu.label
                  ? 'bg-parrot-accent/20 text-parrot-accent'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
              onClick={() =>
                setOpenMenu(openMenu === menu.label ? null : menu.label)
              }
            >
              {menu.label}
            </button>

            {openMenu === menu.label && (
              <div
                className="absolute top-full left-0 min-w-[200px] py-1 rounded-sm shadow-2xl z-[1001]"
                style={{
                  background: 'rgba(15, 25, 50, 0.97)',
                  border: '1px solid rgba(0,212,170,0.25)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {menu.items.map((item, i) =>
                  item.separator ? (
                    <div
                      key={i}
                      className="my-1 mx-2"
                      style={{ height: '1px', background: 'rgba(0,212,170,0.15)' }}
                    />
                  ) : (
                    <button
                      key={i}
                      className="w-full text-left px-4 py-1.5 text-xs text-gray-300 hover:bg-parrot-accent/15 hover:text-parrot-accent transition-colors"
                      onClick={() => {
                        item.action?.();
                        setOpenMenu(null);
                      }}
                    >
                      {item.label}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Center spacer */}
      <div className="flex-1" />

      {/* Right: Status area */}
      <div className="flex items-center gap-1 px-2">
        {/* Learning mode toggle */}
        <button
          onClick={toggleLearningMode}
          title={learningMode ? 'Disable Learning Mode' : 'Enable Learning Mode'}
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs transition-all ${
            learningMode
              ? 'bg-parrot-accent/20 text-parrot-accent border border-parrot-accent/30'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
          {learningMode ? 'LEARN' : 'Learn'}
        </button>

        <div className="w-px h-4 bg-white/10" />

        {/* Volume icon */}
        <button className="p-1 text-gray-400 hover:text-gray-200 transition-colors" title="Volume">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
          </svg>
        </button>

        {/* Network icon */}
        <button className="p-1 text-gray-400 hover:text-gray-200 transition-colors" title="Network: Connected">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
          </svg>
        </button>

        {/* Battery */}
        <div
          className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs"
          title="Battery: 87%"
          style={{ color: '#7adb8a' }}
        >
          <svg width="16" height="10" viewBox="0 0 20 12">
            <rect x="0" y="1" width="17" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <rect x="17" y="4" width="3" height="4" rx="1" fill="currentColor" />
            <rect x="1.5" y="2.5" width="13" height="7" rx="1" fill="currentColor" />
          </svg>
          <span>87%</span>
        </div>

        <div className="w-px h-4 bg-white/10" />

        {/* Clock */}
        <div className="flex flex-col items-end px-2 leading-none">
          <span className="text-xs text-white font-medium">{time}</span>
          <span className="text-[10px] text-gray-400">{date}</span>
        </div>
      </div>
    </div>
  );
}
