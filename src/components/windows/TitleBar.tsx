'use client';

import React, { useCallback, useRef } from 'react';
import { useDesktopStore } from '@/store/desktop';
import { WindowState } from '@/store/desktop';

interface TitleBarProps {
  window: WindowState;
  onDragStart: (e: React.MouseEvent) => void;
}

const APP_ICONS: Record<string, string> = {
  terminal: '⬛',
  filemanager: '📁',
  texteditor: '📝',
  lessons: '📚',
  systeminfo: '💻',
  about: 'ℹ️',
};

export default function TitleBar({ window: win, onDragStart }: TitleBarProps) {
  const { closeWindow, minimizeWindow, maximizeWindow } = useDesktopStore();

  return (
    <div
      className="flex items-center h-8 px-2 gap-2 select-none flex-shrink-0"
      style={{
        background: 'rgba(10, 18, 36, 0.98)',
        borderBottom: '1px solid rgba(0,212,170,0.2)',
        cursor: 'move',
      }}
      onMouseDown={onDragStart}
    >
      {/* Window control buttons (macOS-style) */}
      <div className="flex items-center gap-1.5">
        <button
          className="w-3 h-3 rounded-full flex items-center justify-center group transition-opacity"
          style={{ background: '#ff5f57', flexShrink: 0 }}
          onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }}
          title="Close"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <span className="opacity-0 group-hover:opacity-100 text-[8px] text-red-900 font-bold leading-none">
            ✕
          </span>
        </button>
        <button
          className="w-3 h-3 rounded-full flex items-center justify-center group transition-opacity"
          style={{ background: '#ffbd2e', flexShrink: 0 }}
          onClick={(e) => { e.stopPropagation(); minimizeWindow(win.id); }}
          title="Minimize"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <span className="opacity-0 group-hover:opacity-100 text-[8px] text-yellow-900 font-bold leading-none">
            −
          </span>
        </button>
        <button
          className="w-3 h-3 rounded-full flex items-center justify-center group transition-opacity"
          style={{ background: '#28c840', flexShrink: 0 }}
          onClick={(e) => { e.stopPropagation(); maximizeWindow(win.id); }}
          title="Maximize"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <span className="opacity-0 group-hover:opacity-100 text-[8px] text-green-900 font-bold leading-none">
            +
          </span>
        </button>
      </div>

      {/* Title */}
      <div className="flex-1 flex items-center justify-center gap-2">
        <span className="text-xs opacity-50">{APP_ICONS[win.app]}</span>
        <span className="text-xs text-gray-300 truncate">{win.title}</span>
      </div>

      {/* Right padding to balance the buttons */}
      <div className="w-14" />
    </div>
  );
}
