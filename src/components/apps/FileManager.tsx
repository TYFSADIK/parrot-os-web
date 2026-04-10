'use client';

import React, { useState, useCallback } from 'react';
import { useDesktopStore } from '@/store/desktop';
import { getNodeAtPath, resolvePath, listDirectory, FSNode, getFileSize, formatSize } from '@/lib/filesystem';

type ViewMode = 'grid' | 'list';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/home/parrot', icon: '🏠' },
  { label: 'Desktop', path: '/home/parrot/Desktop', icon: '🖥️' },
  { label: 'Documents', path: '/home/parrot/Documents', icon: '📄' },
  { label: 'Downloads', path: '/home/parrot/Downloads', icon: '⬇️' },
  { label: 'Pictures', path: '/home/parrot/Pictures', icon: '🖼️' },
  { label: '/', path: '/', icon: '💾' },
];

function getFileIcon(node: FSNode): string {
  if (node.type === 'directory') return '📁';
  const name = node.name.toLowerCase();
  if (name.endsWith('.txt')) return '📄';
  if (name.endsWith('.md')) return '📝';
  if (name.endsWith('.sh')) return '⚙️';
  if (name.endsWith('.py')) return '🐍';
  if (name.endsWith('.js') || name.endsWith('.ts')) return '📜';
  if (name.endsWith('.zip') || name.endsWith('.tar.gz') || name.endsWith('.gz')) return '🗜️';
  if (name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.svg')) return '🖼️';
  if (name.endsWith('.pdf')) return '📕';
  if (name.startsWith('.')) return '🔒';
  return '📄';
}

function formatModified(dateStr?: string): string {
  return dateStr || 'Unknown';
}

export default function FileManager() {
  const { filesystem, openWindow } = useDesktopStore();
  const [currentPath, setCurrentPath] = useState('/home/parrot');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showHidden, setShowHidden] = useState(false);
  const [lastClick, setLastClick] = useState<{ name: string; time: number } | null>(null);

  const currentNode = getNodeAtPath(filesystem, currentPath);
  const items = currentNode ? listDirectory(currentNode) : [];
  const visibleItems = showHidden ? items : items.filter(i => !i.name.startsWith('.'));

  // Sort: dirs first, then alpha
  const sortedItems = [...visibleItems].sort((a, b) => {
    if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  const navigate = useCallback((path: string) => {
    const node = getNodeAtPath(filesystem, path);
    if (node && node.type === 'directory') {
      setCurrentPath(path);
      setSelectedItem(null);
    }
  }, [filesystem]);

  const handleItemClick = useCallback((item: FSNode) => {
    const now = Date.now();
    if (lastClick?.name === item.name && now - lastClick.time < 500) {
      // Double click
      if (item.type === 'directory') {
        navigate(currentPath + '/' + item.name);
      } else if (item.type === 'file') {
        // Open in text editor
        openWindow('texteditor', { filePath: currentPath + '/' + item.name });
      }
      setLastClick(null);
    } else {
      setSelectedItem(item.name);
      setLastClick({ name: item.name, time: now });
    }
  }, [lastClick, currentPath, navigate, openWindow]);

  const goUp = () => {
    if (currentPath === '/') return;
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    navigate('/' + parts.join('/') || '/');
  };

  // Breadcrumbs
  const pathParts = currentPath.split('/').filter(Boolean);
  const breadcrumbs = [
    { label: '/', path: '/' },
    ...pathParts.map((part, idx) => ({
      label: part,
      path: '/' + pathParts.slice(0, idx + 1).join('/'),
    })),
  ];

  return (
    <div className="flex flex-col h-full bg-parrot-bg text-gray-200 text-sm overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-parrot-panel border-b border-parrot-border">
        <button
          onClick={goUp}
          disabled={currentPath === '/'}
          className="px-2 py-1 rounded hover:bg-parrot-surface disabled:opacity-30 disabled:cursor-not-allowed text-xs"
          title="Go Up"
        >
          ↑ Up
        </button>

        {/* Path bar */}
        <div className="flex-1 flex items-center gap-1 bg-parrot-bg/50 rounded px-2 py-1 border border-parrot-border overflow-hidden">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.path}>
              {idx > 0 && <span className="text-gray-500">/</span>}
              <button
                onClick={() => navigate(crumb.path)}
                className="hover:text-parrot-accent text-xs whitespace-nowrap"
              >
                {crumb.label}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex gap-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-2 py-1 rounded text-xs ${viewMode === 'grid' ? 'bg-parrot-accent text-parrot-bg' : 'hover:bg-parrot-surface'}`}
            title="Grid View"
          >
            ⊞
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-2 py-1 rounded text-xs ${viewMode === 'list' ? 'bg-parrot-accent text-parrot-bg' : 'hover:bg-parrot-surface'}`}
            title="List View"
          >
            ☰
          </button>
        </div>

        <button
          onClick={() => setShowHidden(!showHidden)}
          className={`px-2 py-1 rounded text-xs ${showHidden ? 'bg-parrot-surface text-parrot-accent' : 'hover:bg-parrot-surface'}`}
          title="Show Hidden Files"
        >
          {showHidden ? '👁' : '🔒'} Hidden
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-44 bg-parrot-panel border-r border-parrot-border flex flex-col overflow-y-auto py-2">
          <div className="px-3 py-1 text-xs text-gray-500 uppercase tracking-wide font-semibold">Places</div>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-parrot-surface w-full text-left transition-colors ${
                currentPath === item.path ? 'bg-parrot-surface text-parrot-accent' : 'text-gray-300'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          <div className="mt-4 px-3 py-1 text-xs text-gray-500 uppercase tracking-wide font-semibold">Devices</div>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-parrot-surface w-full text-left text-gray-300">
            <span>💿</span>
            <span>256 GB Drive</span>
          </button>

          <div className="mt-4 px-3 py-1 text-xs text-gray-500 uppercase tracking-wide font-semibold">Network</div>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-parrot-surface w-full text-left text-gray-300">
            <span>🌐</span>
            <span>Browse Network</span>
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          {!currentNode || currentNode.type !== 'directory' ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              Directory not found
            </div>
          ) : sortedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2">
              <span className="text-4xl">📂</span>
              <span>Empty folder</span>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="p-4 grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-4">
              {sortedItems.map((item) => (
                <div
                  key={item.name}
                  className={`flex flex-col items-center gap-1 p-2 rounded cursor-pointer file-item transition-all ${
                    selectedItem === item.name ? 'selected' : ''
                  }`}
                  onClick={() => handleItemClick(item)}
                  onDoubleClick={() => {
                    if (item.type === 'directory') {
                      navigate(currentPath === '/' ? '/' + item.name : currentPath + '/' + item.name);
                    } else {
                      openWindow('texteditor', { filePath: (currentPath === '/' ? '/' : currentPath + '/') + item.name });
                    }
                  }}
                >
                  <span className="text-4xl">{getFileIcon(item)}</span>
                  <span
                    className="text-xs text-center leading-tight break-all max-w-full"
                    style={{ wordBreak: 'break-word' }}
                    title={item.name}
                  >
                    {item.name.length > 14 ? item.name.slice(0, 12) + '...' : item.name}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            /* List view */
            <div className="p-2">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-parrot-panel">
                  <tr className="text-left text-gray-500 border-b border-parrot-border">
                    <th className="px-2 py-1.5 font-medium">Name</th>
                    <th className="px-2 py-1.5 font-medium">Size</th>
                    <th className="px-2 py-1.5 font-medium">Type</th>
                    <th className="px-2 py-1.5 font-medium">Modified</th>
                    <th className="px-2 py-1.5 font-medium">Permissions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedItems.map((item) => (
                    <tr
                      key={item.name}
                      className={`file-item cursor-pointer border-b border-parrot-border/30 ${
                        selectedItem === item.name ? 'selected' : ''
                      }`}
                      onClick={() => handleItemClick(item)}
                      onDoubleClick={() => {
                        if (item.type === 'directory') {
                          navigate(currentPath === '/' ? '/' + item.name : currentPath + '/' + item.name);
                        } else {
                          openWindow('texteditor', { filePath: (currentPath === '/' ? '/' : currentPath + '/') + item.name });
                        }
                      }}
                    >
                      <td className="px-2 py-1.5 flex items-center gap-2">
                        <span>{getFileIcon(item)}</span>
                        <span className={item.type === 'directory' ? 'text-blue-400' : 'text-gray-200'}>
                          {item.name}
                        </span>
                      </td>
                      <td className="px-2 py-1.5 text-gray-400">
                        {item.type === 'directory' ? '--' : formatSize(getFileSize(item))}
                      </td>
                      <td className="px-2 py-1.5 text-gray-400">
                        {item.type === 'directory' ? 'Folder' : item.name.includes('.') ? item.name.split('.').pop()?.toUpperCase() + ' File' : 'File'}
                      </td>
                      <td className="px-2 py-1.5 text-gray-400">
                        {formatModified(item.modified)}
                      </td>
                      <td className="px-2 py-1.5 text-gray-500 font-mono">
                        {item.permissions || (item.type === 'directory' ? 'drwxr-xr-x' : '-rw-r--r--')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="px-3 py-1 bg-parrot-panel border-t border-parrot-border text-xs text-gray-500 flex items-center justify-between">
        <span>{sortedItems.length} items{selectedItem ? ` · ${selectedItem} selected` : ''}</span>
        <span>{currentPath}</span>
      </div>
    </div>
  );
}
