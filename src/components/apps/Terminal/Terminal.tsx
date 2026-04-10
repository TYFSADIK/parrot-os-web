'use client';

import React, { useState, useEffect, useRef, useCallback, KeyboardEvent } from 'react';
import { useDesktopStore } from '@/store/desktop';
import { executeCommand, tabComplete, getAvailableCommands } from './CommandParser';
import { ACHIEVEMENT_MAP } from '@/lib/achievements';
import { LEARNING_MODE_EXPLANATIONS } from '@/lib/command-help';

interface TerminalEntry {
  id: string;
  type: 'command' | 'output' | 'prompt';
  content: string;
  directory?: string;
}

interface TerminalProps {
  windowId?: string;
}

function getPromptText(directory: string): string {
  const home = '/home/parrot';
  let displayDir = directory;
  if (directory === home) {
    displayDir = '~';
  } else if (directory.startsWith(home + '/')) {
    displayDir = '~' + directory.slice(home.length);
  }
  return displayDir;
}

function renderColorCodes(text: string): React.ReactNode[] {
  // Parse ANSI escape codes and render as spans
  const parts: React.ReactNode[] = [];
  const ansiRegex = /\x1b\[([0-9;]*)m/g;
  let lastIndex = 0;
  let match;
  let currentStyle: React.CSSProperties = {};
  let key = 0;

  const colorMap: Record<string, string> = {
    '30': '#000000', '31': '#ff4444', '32': '#44ff44', '33': '#ffff44',
    '34': '#4444ff', '35': '#ff44ff', '36': '#00d4aa', '37': '#ffffff',
    '90': '#888888', '91': '#ff8888', '92': '#88ff88', '93': '#ffff88',
    '94': '#8888ff', '95': '#ff88ff', '96': '#88ffff', '97': '#ffffff',
  };

  while ((match = ansiRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <span key={key++} style={currentStyle}>
          {text.slice(lastIndex, match.index)}
        </span>
      );
    }

    const codes = match[1].split(';');
    const newStyle: React.CSSProperties = { ...currentStyle };

    for (const code of codes) {
      const n = parseInt(code);
      if (n === 0) {
        Object.keys(newStyle).forEach(k => delete (newStyle as Record<string, unknown>)[k]);
      } else if (n === 1) {
        newStyle.fontWeight = 'bold';
      } else if (n === 2) {
        newStyle.opacity = 0.6;
      } else if (n === 4) {
        newStyle.textDecoration = 'underline';
      } else if (colorMap[code]) {
        newStyle.color = colorMap[code];
      }
    }

    currentStyle = newStyle;
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(
      <span key={key++} style={currentStyle}>
        {text.slice(lastIndex)}
      </span>
    );
  }

  return parts;
}

export default function Terminal({ windowId }: TerminalProps) {
  const {
    filesystem,
    currentDirectory,
    terminalHistory,
    achievements,
    learningMode,
    commandCount,
    cdCount,
    visitedDirs,
    addToHistory,
    updateFilesystem,
    setCurrentDirectory,
    incrementCommandCount,
    incrementCdCount,
    addVisitedDir,
    unlockAchievement,
    addToast,
    openWindow,
  } = useDesktopStore();

  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [tabCount, setTabCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    const welcome: TerminalEntry = {
      id: 'welcome',
      type: 'output',
      content: `Parrot OS 5.3 (Electro Ara) - Terminal Simulator
Linux parrot-os 6.1.0-1parrot1-amd64 GNU/Linux

Type 'help' for available commands.
Type 'neofetch' for system information.

Last login: ${new Date().toUTCString()}`,
    };
    setEntries([welcome]);

    // Load command history from store
    const storedHistory = terminalHistory
      .map(h => h.command)
      .filter(Boolean);
    setCmdHistory(storedHistory);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [entries]);

  // Focus input when clicked
  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const checkAchievements = useCallback((command: string, count: number, cdCnt: number, dirs: string[]) => {
    // First Steps
    if (count === 1 && !achievements.includes('first_steps')) {
      unlockAchievement('first_steps');
      const ach = ACHIEVEMENT_MAP['first_steps'];
      addToast({ title: `Achievement Unlocked: ${ach.title}`, message: ach.description, type: 'achievement', icon: ach.icon });
    }

    // Power User
    if (count === 10 && !achievements.includes('power_user')) {
      unlockAchievement('power_user');
      const ach = ACHIEVEMENT_MAP['power_user'];
      addToast({ title: `Achievement Unlocked: ${ach.title}`, message: ach.description, type: 'achievement', icon: ach.icon });
    }

    // Navigator
    if (cdCnt >= 5 && !achievements.includes('navigator')) {
      unlockAchievement('navigator');
      const ach = ACHIEVEMENT_MAP['navigator'];
      addToast({ title: `Achievement Unlocked: ${ach.title}`, message: ach.description, type: 'achievement', icon: ach.icon });
    }

    // Explorer
    if (dirs.length >= 5 && !achievements.includes('explorer')) {
      unlockAchievement('explorer');
      const ach = ACHIEVEMENT_MAP['explorer'];
      addToast({ title: `Achievement Unlocked: ${ach.title}`, message: ach.description, type: 'achievement', icon: ach.icon });
    }

    // File Wizard
    if (command.startsWith('touch') && !achievements.includes('file_wizard')) {
      unlockAchievement('file_wizard');
      const ach = ACHIEVEMENT_MAP['file_wizard'];
      addToast({ title: `Achievement Unlocked: ${ach.title}`, message: ach.description, type: 'achievement', icon: ach.icon });
    }

    // Network Ninja
    const netCmds = ['ip', 'ifconfig', 'ping', 'netstat', 'ss', 'nmap', 'curl', 'wget', 'traceroute', 'dig', 'nslookup', 'arp', 'route'];
    if (netCmds.some(c => command.startsWith(c)) && !achievements.includes('network_ninja')) {
      unlockAchievement('network_ninja');
      const ach = ACHIEVEMENT_MAP['network_ninja'];
      addToast({ title: `Achievement Unlocked: ${ach.title}`, message: ach.description, type: 'achievement', icon: ach.icon });
    }

    // Root Hunter
    if (command.startsWith('sudo') && !achievements.includes('root_hunter')) {
      unlockAchievement('root_hunter');
      const ach = ACHIEVEMENT_MAP['root_hunter'];
      addToast({ title: `Achievement Unlocked: ${ach.title}`, message: ach.description, type: 'achievement', icon: ach.icon });
    }

    // Grep Master
    if (command.startsWith('grep') && !achievements.includes('grep_master')) {
      unlockAchievement('grep_master');
      const ach = ACHIEVEMENT_MAP['grep_master'];
      addToast({ title: `Achievement Unlocked: ${ach.title}`, message: ach.description, type: 'achievement', icon: ach.icon });
    }

    // Pipe Dream
    if (command.includes('|') && !achievements.includes('pipe_dream')) {
      unlockAchievement('pipe_dream');
      const ach = ACHIEVEMENT_MAP['pipe_dream'];
      addToast({ title: `Achievement Unlocked: ${ach.title}`, message: ach.description, type: 'achievement', icon: ach.icon });
    }

    // History Buff
    if (command.startsWith('history') && !achievements.includes('history_buff')) {
      unlockAchievement('history_buff');
      const ach = ACHIEVEMENT_MAP['history_buff'];
      addToast({ title: `Achievement Unlocked: ${ach.title}`, message: ach.description, type: 'achievement', icon: ach.icon });
    }

    // Scripter
    if (command.startsWith('touch') && command.endsWith('.sh') && !achievements.includes('scripter')) {
      unlockAchievement('scripter');
      const ach = ACHIEVEMENT_MAP['scripter'];
      addToast({ title: `Achievement Unlocked: ${ach.title}`, message: ach.description, type: 'achievement', icon: ach.icon });
    }

    // Package Manager
    if (command.startsWith('apt update') && !achievements.includes('package_manager')) {
      unlockAchievement('package_manager');
      const ach = ACHIEVEMENT_MAP['package_manager'];
      addToast({ title: `Achievement Unlocked: ${ach.title}`, message: ach.description, type: 'achievement', icon: ach.icon });
    }

    // Process Killer
    const procCmds = ['ps', 'top', 'htop', 'kill', 'killall'];
    if (procCmds.some(c => command.startsWith(c)) && !achievements.includes('process_killer')) {
      unlockAchievement('process_killer');
      const ach = ACHIEVEMENT_MAP['process_killer'];
      addToast({ title: `Achievement Unlocked: ${ach.title}`, message: ach.description, type: 'achievement', icon: ach.icon });
    }

    // Hacker
    const secCmds = ['nmap', 'hydra', 'hashcat', 'john', 'aircrack', 'sqlmap', 'nikto', 'msfconsole'];
    if (secCmds.some(c => command.startsWith(c)) && !achievements.includes('hacker')) {
      unlockAchievement('hacker');
      const ach = ACHIEVEMENT_MAP['hacker'];
      addToast({ title: `Achievement Unlocked: ${ach.title}`, message: ach.description, type: 'achievement', icon: ach.icon });
    }
  }, [achievements, unlockAchievement, addToast]);

  const handleCommand = useCallback(async (input: string) => {
    if (isProcessing) return;
    const trimmed = input.trim();

    // Add to visual history
    const promptEntry: TerminalEntry = {
      id: `prompt-${Date.now()}`,
      type: 'prompt',
      content: trimmed,
      directory: currentDirectory,
    };

    setEntries(prev => [...prev, promptEntry]);
    setInputValue('');
    setHistoryIndex(-1);

    if (!trimmed) return;

    // Add to command history
    const newCmdHistory = [...cmdHistory.filter(c => c !== trimmed), trimmed];
    setCmdHistory(newCmdHistory);
    setIsProcessing(true);

    try {
      // Increment command count
      incrementCommandCount();
      const newCount = commandCount + 1;

      // Check if it's a cd command for tracking
      const isCd = trimmed.startsWith('cd ') || trimmed === 'cd';

      const result = await executeCommand(
        trimmed,
        filesystem,
        currentDirectory,
        newCmdHistory,
        (newDir) => {
          setCurrentDirectory(newDir);
          addVisitedDir(newDir);
          if (isCd) incrementCdCount();
        },
        updateFilesystem,
        (path) => {
          // Open text editor with file
          openWindow('texteditor', { filePath: path });
        }
      );

      if (result.clear) {
        setEntries([]);
      } else if (result.output) {
        const outputEntry: TerminalEntry = {
          id: `output-${Date.now()}`,
          type: 'output',
          content: result.output,
        };
        setEntries(prev => result.clear ? [] : [...prev, outputEntry]);

        // Learning mode explanation
        const cmdName = trimmed.split(' ')[0];
        if (learningMode && LEARNING_MODE_EXPLANATIONS[cmdName]) {
          const explainEntry: TerminalEntry = {
            id: `explain-${Date.now()}`,
            type: 'output',
            content: `\n💡 LEARNING MODE: ${LEARNING_MODE_EXPLANATIONS[cmdName]}\n`,
          };
          setEntries(prev => [...prev, explainEntry]);
        }
      }

      // Store in history
      addToHistory({
        id: `hist-${Date.now()}`,
        command: trimmed,
        output: result.output || '',
        timestamp: Date.now(),
        directory: currentDirectory,
      });

      // Check achievements
      checkAchievements(trimmed, newCount, cdCount + (isCd ? 1 : 0), visitedDirs);

    } catch (err) {
      const errorEntry: TerminalEntry = {
        id: `error-${Date.now()}`,
        type: 'output',
        content: `bash: unexpected error executing command`,
      };
      setEntries(prev => [...prev, errorEntry]);
    } finally {
      setIsProcessing(false);
    }
  }, [
    isProcessing, currentDirectory, filesystem, cmdHistory,
    commandCount, cdCount, visitedDirs, learningMode,
    incrementCommandCount, incrementCdCount, addVisitedDir,
    setCurrentDirectory, updateFilesystem, addToHistory,
    checkAchievements, openWindow,
  ]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputValue);
      setTabCount(0);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIndex = historyIndex < cmdHistory.length - 1 ? historyIndex + 1 : historyIndex;
      setHistoryIndex(newIndex);
      const cmd = cmdHistory[cmdHistory.length - 1 - newIndex];
      if (cmd) setInputValue(cmd);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIndex = historyIndex > 0 ? historyIndex - 1 : -1;
      setHistoryIndex(newIndex);
      if (newIndex === -1) {
        setInputValue('');
      } else {
        const cmd = cmdHistory[cmdHistory.length - 1 - newIndex];
        if (cmd) setInputValue(cmd);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const newTabCount = tabCount + 1;
      setTabCount(newTabCount);

      const completions = tabComplete(inputValue, filesystem, currentDirectory);

      if (completions.length === 0) {
        // No completions
      } else if (completions.length === 1) {
        // Single completion
        const parts = inputValue.split(' ');
        parts[parts.length - 1] = completions[0];
        setInputValue(parts.join(' '));

        // Tab Master achievement
        if (!achievements.includes('tab_master')) {
          unlockAchievement('tab_master');
          const ach = ACHIEVEMENT_MAP['tab_master'];
          addToast({ title: `Achievement Unlocked: ${ach.title}`, message: ach.description, type: 'achievement', icon: ach.icon });
        }
      } else if (newTabCount >= 2) {
        // Show all completions on double tab
        const outputEntry: TerminalEntry = {
          id: `tab-${Date.now()}`,
          type: 'output',
          content: completions.join('  '),
        };
        setEntries(prev => [...prev, outputEntry]);
        setTabCount(0);
      } else {
        // Find common prefix
        const commonPrefix = completions.reduce((prefix, str) => {
          let i = 0;
          while (i < prefix.length && i < str.length && prefix[i] === str[i]) i++;
          return prefix.slice(0, i);
        });
        if (commonPrefix) {
          const parts = inputValue.split(' ');
          parts[parts.length - 1] = commonPrefix;
          setInputValue(parts.join(' '));
        }
      }
    } else if (e.key === 'c' && e.ctrlKey) {
      // Ctrl+C
      const interruptEntry: TerminalEntry = {
        id: `interrupt-${Date.now()}`,
        type: 'output',
        content: '^C',
      };
      setEntries(prev => [...prev, interruptEntry]);
      setInputValue('');
      setTabCount(0);
    } else if (e.key === 'l' && e.ctrlKey) {
      // Ctrl+L - clear
      e.preventDefault();
      setEntries([]);
    } else if (e.key === 'u' && e.ctrlKey) {
      // Ctrl+U - clear line
      e.preventDefault();
      setInputValue('');
    } else {
      setTabCount(0);
    }
  }, [
    inputValue, historyIndex, cmdHistory, tabCount,
    filesystem, currentDirectory, achievements,
    handleCommand, unlockAchievement, addToast,
  ]);

  const displayDir = getPromptText(currentDirectory);

  return (
    <div
      className="flex flex-col h-full bg-parrot-terminal text-parrot-terminal-text font-mono text-sm overflow-hidden"
      onClick={focusInput}
    >
      {/* Output area */}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto p-3 space-y-0.5"
        style={{ fontFamily: "'Ubuntu Mono', monospace" }}
      >
        {entries.map((entry) => {
          if (entry.type === 'prompt') {
            const dir = entry.directory ? getPromptText(entry.directory) : displayDir;
            return (
              <div key={entry.id} className="flex flex-col">
                <div className="flex items-center gap-0 whitespace-pre">
                  <span style={{ color: '#00d4aa' }}>┌──(</span>
                  <span style={{ color: '#00ff88', fontWeight: 'bold' }}>parrot㉿parrot-os</span>
                  <span style={{ color: '#00d4aa' }}>)-[</span>
                  <span style={{ color: '#7dd3fc' }}>{dir}</span>
                  <span style={{ color: '#00d4aa' }}>]</span>
                </div>
                <div className="flex items-center gap-0 whitespace-pre">
                  <span style={{ color: '#00d4aa' }}>└─</span>
                  <span style={{ color: '#00ff88', fontWeight: 'bold' }}>$ </span>
                  <span style={{ color: '#ffffff' }}>{entry.content}</span>
                </div>
              </div>
            );
          }

          if (entry.type === 'output') {
            // Check if it's a learning mode explanation
            const isLearning = entry.content.startsWith('\n💡 LEARNING MODE:');
            return (
              <div
                key={entry.id}
                className={`whitespace-pre-wrap leading-5 ${
                  isLearning
                    ? 'mt-2 p-2 rounded border border-parrot-accent/30 bg-parrot-accent/10 text-parrot-accent'
                    : 'text-gray-200'
                }`}
                style={{ fontFamily: "'Ubuntu Mono', monospace" }}
              >
                {renderColorCodes(entry.content)}
              </div>
            );
          }

          return null;
        })}

        {/* Current prompt */}
        <div className="flex flex-col">
          <div className="flex items-center gap-0 whitespace-pre">
            <span style={{ color: '#00d4aa' }}>┌──(</span>
            <span style={{ color: '#00ff88', fontWeight: 'bold' }}>parrot㉿parrot-os</span>
            <span style={{ color: '#00d4aa' }}>)-[</span>
            <span style={{ color: '#7dd3fc' }}>{displayDir}</span>
            <span style={{ color: '#00d4aa' }}>]</span>
          </div>
          <div className="flex items-center gap-0">
            <span style={{ color: '#00d4aa', fontFamily: "'Ubuntu Mono', monospace" }}>└─</span>
            <span style={{ color: '#00ff88', fontWeight: 'bold', fontFamily: "'Ubuntu Mono', monospace" }}>$ </span>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setTabCount(0);
                }}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent outline-none text-white"
                style={{ fontFamily: "'Ubuntu Mono', monospace", fontSize: '14px', caretColor: '#00d4aa' }}
                autoFocus
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                disabled={isProcessing}
              />
            </div>
            {isProcessing && (
              <span className="ml-1 text-parrot-accent animate-pulse">...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
