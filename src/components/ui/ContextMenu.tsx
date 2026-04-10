'use client';

import React, { useEffect, useRef } from 'react';

export interface ContextMenuItem {
  label: string;
  action?: () => void;
  separator?: boolean;
  icon?: string;
  disabled?: boolean;
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

export default function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  // Clamp to viewport
  const adjustedX = Math.min(x, window.innerWidth - 200);
  const adjustedY = Math.min(y, window.innerHeight - items.length * 30 - 20);

  return (
    <div
      ref={menuRef}
      className="fixed z-[9000] py-1 rounded shadow-2xl context-menu"
      style={{
        left: adjustedX,
        top: adjustedY,
        minWidth: 180,
        background: 'rgba(12, 20, 40, 0.97)',
        border: '1px solid rgba(0,212,170,0.3)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {items.map((item, i) =>
        item.separator ? (
          <div
            key={i}
            className="my-1 mx-3"
            style={{ height: '1px', background: 'rgba(0,212,170,0.15)' }}
          />
        ) : (
          <button
            key={i}
            disabled={item.disabled}
            onClick={() => {
              if (!item.disabled) {
                item.action?.();
                onClose();
              }
            }}
            className={`
              w-full text-left flex items-center gap-2 px-3 py-1.5 text-xs transition-colors
              ${item.disabled
                ? 'text-gray-600 cursor-default'
                : 'text-gray-300 hover:bg-parrot-accent/15 hover:text-parrot-accent cursor-pointer'
              }
            `}
          >
            {item.icon && <span className="text-sm w-4 text-center">{item.icon}</span>}
            {item.label}
          </button>
        )
      )}
    </div>
  );
}
