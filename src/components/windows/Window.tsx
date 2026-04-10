'use client';

import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useDesktopStore, WindowState } from '@/store/desktop';
import TitleBar from './TitleBar';

interface WindowProps {
  window: WindowState;
  children: React.ReactNode;
}

const MIN_W = 320;
const MIN_H = 220;
const TOP_PANEL = 28;
const BOTTOM_PANEL = 36;

export default function Window({ window: win, children }: WindowProps) {
  const { focusWindow, updateWindowPosition, updateWindowSize, activeWindowId } =
    useDesktopStore();

  const isActive = win.id === activeWindowId;
  const containerRef = useRef<HTMLDivElement>(null);

  // Drag state
  const dragRef = useRef<{ startX: number; startY: number; winX: number; winY: number } | null>(
    null
  );
  // Resize state
  const resizeRef = useRef<{
    dir: string;
    startX: number;
    startY: number;
    winX: number;
    winY: number;
    winW: number;
    winH: number;
  } | null>(null);

  // Pre-maximize state
  const [preMax, setPreMax] = useState<{ x: number; y: number; w: number; h: number } | null>(
    null
  );

  const handleFocus = useCallback(() => {
    if (!isActive) focusWindow(win.id);
  }, [isActive, focusWindow, win.id]);

  // ── Drag ──────────────────────────────────────────────────────────
  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      if (win.maximized) return;
      e.preventDefault();
      focusWindow(win.id);
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        winX: win.x,
        winY: win.y,
      };
    },
    [win, focusWindow]
  );

  // ── Resize ────────────────────────────────────────────────────────
  const handleResizeStart = useCallback(
    (e: React.MouseEvent, dir: string) => {
      e.preventDefault();
      e.stopPropagation();
      focusWindow(win.id);
      resizeRef.current = {
        dir,
        startX: e.clientX,
        startY: e.clientY,
        winX: win.x,
        winY: win.y,
        winW: win.width,
        winH: win.height,
      };
    },
    [win, focusWindow]
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (dragRef.current) {
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;
        const newX = Math.max(0, dragRef.current.winX + dx);
        const newY = Math.max(TOP_PANEL, dragRef.current.winY + dy);
        updateWindowPosition(win.id, { x: newX, y: newY });
        return;
      }

      if (resizeRef.current) {
        const r = resizeRef.current;
        const dx = e.clientX - r.startX;
        const dy = e.clientY - r.startY;
        let { winX: nx, winY: ny, winW: nw, winH: nh } = r;

        if (r.dir.includes('e')) nw = Math.max(MIN_W, r.winW + dx);
        if (r.dir.includes('s')) nh = Math.max(MIN_H, r.winH + dy);
        if (r.dir.includes('w')) {
          nw = Math.max(MIN_W, r.winW - dx);
          nx = r.winX + r.winW - nw;
        }
        if (r.dir.includes('n')) {
          nh = Math.max(MIN_H, r.winH - dy);
          ny = r.winY + r.winH - nh;
          if (ny < TOP_PANEL) { ny = TOP_PANEL; nh = r.winY + r.winH - TOP_PANEL; }
        }

        updateWindowPosition(win.id, { x: nx, y: ny });
        updateWindowSize(win.id, { width: nw, height: nh });
      }
    };

    const onMouseUp = () => {
      dragRef.current = null;
      resizeRef.current = null;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [win.id, updateWindowPosition, updateWindowSize]);

  if (win.minimized) return null;

  // Maximized layout
  const style: React.CSSProperties = win.maximized
    ? {
        position: 'absolute',
        left: 0,
        top: TOP_PANEL,
        width: '100%',
        height: `calc(100% - ${TOP_PANEL + BOTTOM_PANEL}px)`,
        zIndex: win.zIndex,
        borderRadius: 0,
      }
    : {
        position: 'absolute',
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
        minWidth: MIN_W,
        minHeight: MIN_H,
      };

  const R = 6; // resize handle thickness px

  return (
    <div
      ref={containerRef}
      className={`flex flex-col overflow-hidden transition-shadow duration-150 ${
        isActive ? 'window-active' : 'window-shadow'
      }`}
      style={{
        ...style,
        borderRadius: win.maximized ? 0 : 6,
        border: isActive
          ? '1px solid rgba(0,212,170,0.4)'
          : '1px solid rgba(0,212,170,0.12)',
        background: '#0f172a',
      }}
      onMouseDown={handleFocus}
    >
      <TitleBar window={win} onDragStart={handleDragStart} />

      {/* Content */}
      <div className="flex-1 overflow-hidden">{children}</div>

      {/* Resize handles */}
      {!win.maximized && (
        <>
          {/* Edges */}
          <div className={`absolute top-0 left-${R} right-${R} h-1 cursor-n-resize`} style={{ height: R, cursor: 'n-resize' }} onMouseDown={(e) => handleResizeStart(e, 'n')} />
          <div className="absolute bottom-0 left-0 right-0 cursor-s-resize" style={{ height: R, cursor: 's-resize' }} onMouseDown={(e) => handleResizeStart(e, 's')} />
          <div className="absolute top-0 bottom-0 left-0 cursor-w-resize" style={{ width: R, cursor: 'w-resize' }} onMouseDown={(e) => handleResizeStart(e, 'w')} />
          <div className="absolute top-0 bottom-0 right-0 cursor-e-resize" style={{ width: R, cursor: 'e-resize' }} onMouseDown={(e) => handleResizeStart(e, 'e')} />
          {/* Corners */}
          <div className="absolute top-0 left-0 cursor-nw-resize" style={{ width: R * 2, height: R * 2, cursor: 'nw-resize' }} onMouseDown={(e) => handleResizeStart(e, 'nw')} />
          <div className="absolute top-0 right-0 cursor-ne-resize" style={{ width: R * 2, height: R * 2, cursor: 'ne-resize' }} onMouseDown={(e) => handleResizeStart(e, 'ne')} />
          <div className="absolute bottom-0 left-0 cursor-sw-resize" style={{ width: R * 2, height: R * 2, cursor: 'sw-resize' }} onMouseDown={(e) => handleResizeStart(e, 'sw')} />
          <div className="absolute bottom-0 right-0 cursor-se-resize" style={{ width: R * 2, height: R * 2, cursor: 'se-resize' }} onMouseDown={(e) => handleResizeStart(e, 'se')} />
        </>
      )}
    </div>
  );
}
