'use client';

import React from 'react';
import { useDesktopStore, AppType } from '@/store/desktop';

const APP_ICONS: Record<AppType, string> = {
  terminal: '⬛',
  filemanager: '📁',
  texteditor: '📝',
  lessons: '📚',
  systeminfo: '💻',
  about: 'ℹ️',
};

const APP_COLORS: Record<AppType, string> = {
  terminal: '#00d4aa',
  filemanager: '#60a5fa',
  texteditor: '#f59e0b',
  lessons: '#a78bfa',
  systeminfo: '#34d399',
  about: '#f87171',
};

export default function BottomPanel() {
  const { windows, activeWindowId, focusWindow, minimizeWindow, openWindow } =
    useDesktopStore();

  const visibleWindows = windows.filter((w) => !w.minimized || w.id === activeWindowId);
  const allWindows = windows;

  return (
    <div
      className="absolute bottom-0 left-0 right-0 h-9 panel-glass flex items-center px-2 gap-1 select-none z-[1000]"
      style={{ borderTop: '1px solid rgba(0,212,170,0.15)' }}
    >
      {/* Show Desktop button */}
      <button
        className="flex items-center justify-center w-7 h-7 rounded text-gray-500 hover:text-parrot-accent hover:bg-parrot-accent/10 transition-colors text-xs"
        title="Show Desktop"
        onClick={() => {
          allWindows.forEach((w) => {
            if (!w.minimized) minimizeWindow(w.id);
          });
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2 3h20v14H2zm0 17h20v2H2z" />
        </svg>
      </button>

      <div className="w-px h-5 bg-white/10 mx-1" />

      {/* Window buttons */}
      {allWindows.map((win) => {
        const isActive = win.id === activeWindowId && !win.minimized;
        const color = APP_COLORS[win.app];
        return (
          <button
            key={win.id}
            onClick={() => {
              if (win.minimized) {
                focusWindow(win.id);
              } else if (win.id === activeWindowId) {
                minimizeWindow(win.id);
              } else {
                focusWindow(win.id);
              }
            }}
            title={win.title}
            className={`
              flex items-center gap-1.5 h-7 px-3 rounded text-xs max-w-[160px] transition-all
              ${isActive
                ? 'bg-white/10 text-white border border-white/15'
                : win.minimized
                ? 'text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent'
                : 'text-gray-300 hover:bg-white/5 border border-transparent'
              }
            `}
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: isActive ? color : 'rgba(255,255,255,0.2)' }}
            />
            <span className="truncate">{win.title}</span>
            {win.minimized && (
              <span
                className="ml-auto text-[9px] opacity-50"
                style={{ lineHeight: 1 }}
              >
                _
              </span>
            )}
          </button>
        );
      })}

      {/* Quick launchers at right */}
      <div className="flex-1" />
      <div className="flex items-center gap-0.5">
        {(['terminal', 'filemanager', 'lessons'] as AppType[]).map((app) => (
          <button
            key={app}
            onClick={() => openWindow(app)}
            title={`Open ${app}`}
            className="flex items-center justify-center w-7 h-7 rounded text-gray-500 hover:text-gray-200 hover:bg-white/5 transition-colors text-sm"
          >
            {APP_ICONS[app]}
          </button>
        ))}
      </div>
    </div>
  );
}
