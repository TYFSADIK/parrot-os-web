export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_steps',
    title: 'First Steps',
    description: 'Run your first command',
    icon: '🚀',
  },
  {
    id: 'navigator',
    title: 'Navigator',
    description: 'Use cd 5 times',
    icon: '🧭',
  },
  {
    id: 'power_user',
    title: 'Power User',
    description: 'Run 10 commands',
    icon: '⚡',
  },
  {
    id: 'file_wizard',
    title: 'File Wizard',
    description: 'Create a file with touch',
    icon: '🪄',
  },
  {
    id: 'network_ninja',
    title: 'Network Ninja',
    description: 'Use a network command',
    icon: '🥷',
  },
  {
    id: 'root_hunter',
    title: 'Root Hunter',
    description: 'Try sudo',
    icon: '🔑',
  },
  {
    id: 'grep_master',
    title: 'Grep Master',
    description: 'Use grep to search',
    icon: '🔍',
  },
  {
    id: 'pipe_dream',
    title: 'Pipe Dream',
    description: 'Use pipe | to chain commands',
    icon: '🔗',
  },
  {
    id: 'history_buff',
    title: 'History Buff',
    description: 'Use the history command',
    icon: '📜',
  },
  {
    id: 'tab_master',
    title: 'Tab Master',
    description: 'Use tab completion',
    icon: '⌨️',
  },
  {
    id: 'hacker',
    title: 'Hacker',
    description: 'Use a security tool command',
    icon: '💻',
  },
  {
    id: 'explorer',
    title: 'Explorer',
    description: 'Navigate to 5 different directories',
    icon: '🗺️',
  },
  {
    id: 'scripter',
    title: 'Scripter',
    description: 'Create a .sh file',
    icon: '📝',
  },
  {
    id: 'package_manager',
    title: 'Package Manager',
    description: 'Run apt update',
    icon: '📦',
  },
  {
    id: 'process_killer',
    title: 'Process Killer',
    description: 'Use the kill or ps command',
    icon: '💀',
  },
];

export const ACHIEVEMENT_MAP = ACHIEVEMENTS.reduce(
  (acc, a) => ({ ...acc, [a.id]: a }),
  {} as Record<string, Achievement>
);
