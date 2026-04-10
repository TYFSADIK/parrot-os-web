'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useDesktopStore, AppType } from '@/store/desktop';
import ContextMenu, { ContextMenuItem } from '@/components/ui/ContextMenu';

interface DesktopIconProps {
  app: AppType;
  label: string;
  icon: React.ReactNode;
  x?: number;
  y?: number;
}

export default function DesktopIcon({ app, label, icon, x, y }: DesktopIconProps) {
  const { openWindow } = useDesktopStore();
  const [selected, setSelected] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickCount = useRef(0);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected(true);
    clickCount.current += 1;

    if (clickTimer.current) clearTimeout(clickTimer.current);

    clickTimer.current = setTimeout(() => {
      if (clickCount.current >= 2) {
        openWindow(app);
        setSelected(false);
      }
      clickCount.current = 0;
    }, 300);
  }, [app, openWindow]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelected(true);
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, []);

  const contextItems: ContextMenuItem[] = [
    {
      label: 'Open',
      icon: '▶',
      action: () => { openWindow(app); setSelected(false); },
    },
    {
      label: 'Open Terminal Here',
      icon: '⬛',
      action: () => { openWindow('terminal'); setSelected(false); },
    },
    { label: '', separator: true },
    {
      label: 'Properties',
      icon: 'ℹ',
      action: () => { openWindow('about'); setSelected(false); },
    },
  ];

  return (
    <>
      <div
        className={`
          desktop-icon absolute flex flex-col items-center gap-1 p-2 rounded cursor-pointer
          transition-all duration-150 w-20
          ${selected ? 'bg-parrot-accent/20 ring-1 ring-parrot-accent/40' : 'hover:bg-white/5'}
        `}
        style={{ left: x, top: y }}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        onBlur={() => setSelected(false)}
        tabIndex={0}
      >
        {/* Icon */}
        <div
          className={`
            w-12 h-12 flex items-center justify-center rounded-lg text-2xl
            transition-transform duration-150
            ${selected ? 'scale-105' : 'hover:scale-105'}
          `}
          style={{
            background: selected
              ? 'rgba(0,212,170,0.15)'
              : 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: selected ? '0 0 12px rgba(0,212,170,0.2)' : 'none',
          }}
        >
          {icon}
        </div>

        {/* Label */}
        <span
          className={`
            icon-label text-center text-[11px] leading-tight px-1 rounded
            max-w-full break-words
            ${selected ? 'text-parrot-accent' : 'text-white/90'}
          `}
          style={{
            textShadow: '0 1px 3px rgba(0,0,0,0.8)',
            wordBreak: 'break-word',
          }}
        >
          {label}
        </span>
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextItems}
          onClose={() => {
            setContextMenu(null);
            setSelected(false);
          }}
        />
      )}
    </>
  );
}
