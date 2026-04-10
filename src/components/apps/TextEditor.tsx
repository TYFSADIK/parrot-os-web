'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDesktopStore } from '@/store/desktop';
import { getNodeAtPath, setNodeAtPath, FSNode } from '@/lib/filesystem';

interface OpenTab {
  id: string;
  filePath: string;
  filename: string;
  content: string;
  modified: boolean;
  isNew?: boolean;
}

interface TextEditorProps {
  filePath?: string;
}

function getFileLanguage(filename: string): string {
  if (filename.endsWith('.sh') || filename.endsWith('.bash')) return 'shell';
  if (filename.endsWith('.py')) return 'python';
  if (filename.endsWith('.md')) return 'markdown';
  if (filename.endsWith('.js') || filename.endsWith('.ts')) return 'javascript';
  if (filename.endsWith('.css')) return 'css';
  if (filename.endsWith('.html')) return 'html';
  if (filename.endsWith('.json')) return 'json';
  return 'text';
}

function highlightLine(line: string, lang: string): React.ReactNode {
  if (lang === 'shell') {
    // Shell script highlighting
    const tokens: React.ReactNode[] = [];
    let remaining = line;

    // Comments
    if (remaining.trim().startsWith('#')) {
      return <span className="sh-comment">{line}</span>;
    }

    // Keywords
    const keywords = /\b(if|then|else|elif|fi|for|while|do|done|case|esac|function|return|echo|exit|export|source|local|readonly|declare|typeset|shift|break|continue|true|false|alias|cd|ls|pwd|mkdir|rm|cp|mv|grep|find|cat|touch|chmod|chown|sudo|apt|git|python3|bash|sh)\b/g;
    const stringParts = remaining.split(/(#.*)$/);
    let mainPart = stringParts[0];
    const commentPart = stringParts[1];

    // Replace keywords
    const parts = mainPart.split(keywords);
    parts.forEach((part, i) => {
      if (['if','then','else','elif','fi','for','while','do','done','case','esac','function','return','echo','exit','export','source','local','readonly','declare','typeset','shift','break','continue','true','false','alias','cd','ls','pwd','mkdir','rm','cp','mv','grep','find','cat','touch','chmod','chown','sudo','apt','git','python3','bash','sh'].includes(part)) {
        tokens.push(<span key={i} className="sh-keyword">{part}</span>);
      } else if (part.match(/\$\w+|\$\{[^}]+\}/)) {
        tokens.push(<span key={i} className="sh-variable">{part}</span>);
      } else {
        tokens.push(<span key={i}>{part}</span>);
      }
    });

    if (commentPart) tokens.push(<span key="comment" className="sh-comment">{commentPart}</span>);
    return <>{tokens}</>;
  }

  if (lang === 'python') {
    if (line.trim().startsWith('#')) return <span className="py-comment">{line}</span>;
    const keywords = /\b(def|class|import|from|if|elif|else|for|while|try|except|finally|with|as|return|yield|pass|break|continue|raise|lambda|and|or|not|in|is|None|True|False|global|nonlocal|del|assert|async|await)\b/g;
    const parts = line.split(keywords);
    return (
      <>
        {parts.map((part, i) =>
          ['def','class','import','from','if','elif','else','for','while','try','except','finally','with','as','return','yield','pass','break','continue','raise','lambda','and','or','not','in','is','None','True','False','global','nonlocal','del','assert','async','await'].includes(part)
            ? <span key={i} className="py-keyword">{part}</span>
            : <span key={i}>{part}</span>
        )}
      </>
    );
  }

  if (lang === 'markdown') {
    if (/^#{1,6}\s/.test(line)) return <span className="md-heading">{line}</span>;
    if (/\*\*[^*]+\*\*/.test(line)) {
      const parts = line.split(/(\*\*[^*]+\*\*)/);
      return (
        <>
          {parts.map((part, i) =>
            /^\*\*[^*]+\*\*$/.test(part)
              ? <span key={i} className="md-bold">{part}</span>
              : <span key={i}>{part}</span>
          )}
        </>
      );
    }
    if (line.startsWith('```') || line.startsWith('    ')) {
      return <span className="md-code">{line}</span>;
    }
  }

  return <>{line}</>;
}

export default function TextEditor({ filePath: initialFilePath }: TextEditorProps) {
  const { filesystem, updateFilesystem, setOpenFile } = useDesktopStore();
  const [tabs, setTabs] = useState<OpenTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [wordWrap, setWordWrap] = useState(true);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const openFile = useCallback((filePath: string) => {
    const existingTab = tabs.find(t => t.filePath === filePath);
    if (existingTab) {
      setActiveTabId(existingTab.id);
      return;
    }

    const node = getNodeAtPath(filesystem, filePath);
    const filename = filePath.split('/').pop() || 'untitled';
    const content = node?.content || '';

    const newTab: OpenTab = {
      id: `tab-${Date.now()}`,
      filePath,
      filename,
      content,
      modified: false,
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  }, [tabs, filesystem]);

  // Open initial file
  useEffect(() => {
    if (initialFilePath) {
      openFile(initialFilePath);
    } else if (tabs.length === 0) {
      // Open a new empty file
      const newTab: OpenTab = {
        id: `tab-${Date.now()}`,
        filePath: '/home/parrot/untitled.txt',
        filename: 'untitled.txt',
        content: '',
        modified: false,
        isNew: true,
      };
      setTabs([newTab]);
      setActiveTabId(newTab.id);
    }
  }, [initialFilePath]);

  const activeTab = tabs.find(t => t.id === activeTabId);

  const handleContentChange = (value: string) => {
    setTabs(prev => prev.map(t =>
      t.id === activeTabId ? { ...t, content: value, modified: true } : t
    ));
  };

  const saveFile = useCallback(() => {
    if (!activeTab) return;
    const { filePath, content } = activeTab;

    const node = getNodeAtPath(filesystem, filePath);
    const parts = filePath.split('/').filter(Boolean);
    const name = parts[parts.length - 1];
    const parentPath = '/' + parts.slice(0, -1).join('/');
    const parentNode = getNodeAtPath(filesystem, parentPath);

    if (!parentNode || parentNode.type !== 'directory') {
      return;
    }

    const updatedNode: FSNode = node
      ? { ...node, content, modified: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }) }
      : {
          type: 'file',
          name,
          permissions: '-rw-r--r--',
          owner: 'parrot',
          group: 'parrot',
          modified: new Date().toLocaleDateString(),
          content,
        };

    const newFs = setNodeAtPath(filesystem, filePath, updatedNode);
    updateFilesystem(newFs);
    setOpenFile(filePath, content);

    setTabs(prev => prev.map(t =>
      t.id === activeTabId ? { ...t, modified: false, isNew: false } : t
    ));
  }, [activeTab, filesystem, updateFilesystem, setOpenFile, activeTabId]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      saveFile();
    }
    if (e.key === 'h' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setShowFindReplace(true);
    }
    if (e.key === 'Escape') {
      setShowFindReplace(false);
    }
    // Tab support
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newContent = activeTab!.content.substring(0, start) + '  ' + activeTab!.content.substring(end);
        handleContentChange(newContent);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        }, 0);
      }
    }
  }, [saveFile, activeTab]);

  const handleFindReplace = () => {
    if (!activeTab || !findText) return;
    const newContent = activeTab.content.replaceAll(findText, replaceText);
    handleContentChange(newContent);
  };

  const newFile = () => {
    const newTab: OpenTab = {
      id: `tab-${Date.now()}`,
      filePath: '/home/parrot/untitled.txt',
      filename: 'untitled.txt',
      content: '',
      modified: false,
      isNew: true,
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab?.modified) {
      // In a real app, we'd ask to save. Here we just close.
    }
    setTabs(prev => prev.filter(t => t.id !== tabId));
    if (activeTabId === tabId) {
      const remaining = tabs.filter(t => t.id !== tabId);
      setActiveTabId(remaining[remaining.length - 1]?.id || null);
    }
  };

  const lang = activeTab ? getFileLanguage(activeTab.filename) : 'text';
  const lines = (activeTab?.content || '').split('\n');

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-gray-300 text-sm overflow-hidden" onKeyDown={handleKeyDown}>
      {/* Menu bar */}
      <div className="flex items-center gap-1 px-3 py-1.5 bg-parrot-panel border-b border-parrot-border">
        <button
          onClick={newFile}
          className="px-2 py-1 rounded hover:bg-parrot-surface text-xs"
        >
          New
        </button>
        <button
          onClick={saveFile}
          className="px-2 py-1 rounded hover:bg-parrot-surface text-xs"
          disabled={!activeTab}
        >
          Save (Ctrl+S)
        </button>
        <button
          onClick={() => setShowFindReplace(!showFindReplace)}
          className="px-2 py-1 rounded hover:bg-parrot-surface text-xs"
        >
          Find/Replace (Ctrl+H)
        </button>
        <div className="flex-1" />
        <button
          onClick={() => setWordWrap(!wordWrap)}
          className={`px-2 py-1 rounded text-xs ${wordWrap ? 'bg-parrot-surface text-parrot-accent' : 'hover:bg-parrot-surface'}`}
        >
          Word Wrap
        </button>
        {activeTab && (
          <span className="text-xs text-gray-500 ml-2">
            {lang.toUpperCase()} · {activeTab.content.split('\n').length} lines
          </span>
        )}
      </div>

      {/* Tabs */}
      {tabs.length > 0 && (
        <div className="flex items-end bg-[#252526] border-b border-parrot-border overflow-x-auto">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`flex items-center gap-2 px-3 py-1.5 border-r border-parrot-border cursor-pointer whitespace-nowrap text-xs ${
                tab.id === activeTabId
                  ? 'bg-[#1e1e1e] text-white border-t border-t-parrot-accent'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-[#2d2d2d]'
              }`}
              onClick={() => setActiveTabId(tab.id)}
            >
              <span>{tab.filename}</span>
              {tab.modified && <span className="text-yellow-400">●</span>}
              <button
                onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
                className="hover:text-red-400 text-gray-500 ml-1"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Find/Replace */}
      {showFindReplace && (
        <div className="flex items-center gap-2 px-3 py-2 bg-[#252526] border-b border-parrot-border">
          <input
            type="text"
            placeholder="Find..."
            value={findText}
            onChange={e => setFindText(e.target.value)}
            className="bg-[#1e1e1e] border border-parrot-border rounded px-2 py-1 text-xs text-white w-40 outline-none focus:border-parrot-accent"
          />
          <input
            type="text"
            placeholder="Replace with..."
            value={replaceText}
            onChange={e => setReplaceText(e.target.value)}
            className="bg-[#1e1e1e] border border-parrot-border rounded px-2 py-1 text-xs text-white w-40 outline-none focus:border-parrot-accent"
          />
          <button
            onClick={handleFindReplace}
            className="px-3 py-1 bg-parrot-accent text-parrot-bg rounded text-xs hover:bg-parrot-accent-dark"
          >
            Replace All
          </button>
          <button
            onClick={() => setShowFindReplace(false)}
            className="px-2 py-1 text-gray-400 hover:text-white text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Editor area */}
      {activeTab ? (
        <div className="flex flex-1 overflow-hidden">
          {/* Line numbers */}
          <div
            className="select-none overflow-hidden"
            style={{
              minWidth: '3.5rem',
              background: '#1e1e1e',
              borderRight: '1px solid #2a2a4a',
              color: '#444',
              fontFamily: "'Ubuntu Mono', monospace",
              fontSize: '13px',
              lineHeight: '20px',
              paddingTop: '8px',
              paddingRight: '8px',
              textAlign: 'right',
              overflowY: 'hidden',
            }}
          >
            {lines.map((_, idx) => (
              <div key={idx} style={{ height: '20px' }}>{idx + 1}</div>
            ))}
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={activeTab.content}
            onChange={e => handleContentChange(e.target.value)}
            className="flex-1 bg-[#1e1e1e] text-gray-200 resize-none outline-none p-2"
            style={{
              fontFamily: "'Ubuntu Mono', monospace",
              fontSize: '13px',
              lineHeight: '20px',
              tabSize: 2,
              whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
              overflowWrap: wordWrap ? 'break-word' : 'normal',
              caretColor: '#00d4aa',
            }}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-4">📝</div>
            <div>No file open</div>
            <button
              onClick={newFile}
              className="mt-4 px-4 py-2 bg-parrot-accent text-parrot-bg rounded text-sm hover:bg-parrot-accent-dark"
            >
              New File
            </button>
          </div>
        </div>
      )}

      {/* Status bar */}
      {activeTab && (
        <div className="flex items-center justify-between px-3 py-1 bg-parrot-panel border-t border-parrot-border text-xs text-gray-500">
          <span>{activeTab.filePath}</span>
          <div className="flex items-center gap-4">
            <span>{lang.toUpperCase()}</span>
            <span>UTF-8</span>
            <span>LF</span>
          </div>
        </div>
      )}
    </div>
  );
}
