import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { defaultFilesystem, FSNode } from '@/lib/filesystem';

export type AppType =
  | 'terminal'
  | 'filemanager'
  | 'texteditor'
  | 'lessons'
  | 'systeminfo'
  | 'about';

export interface WindowState {
  id: string;
  app: AppType;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
  props?: Record<string, unknown>;
}

export interface HistoryEntry {
  id: string;
  command: string;
  output: string | string[];
  timestamp: number;
  directory: string;
}

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'achievement' | 'info' | 'error' | 'success';
  icon?: string;
}

interface DesktopStore {
  // Windows
  windows: WindowState[];
  activeWindowId: string | null;
  maxZIndex: number;
  openWindow: (app: AppType, props?: Record<string, unknown>) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, pos: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;

  // Terminal
  terminalHistory: HistoryEntry[];
  currentDirectory: string;
  filesystem: FSNode;
  commandCount: number;
  cdCount: number;
  visitedDirs: string[];
  addToHistory: (entry: HistoryEntry) => void;
  updateFilesystem: (fs: FSNode) => void;
  setCurrentDirectory: (dir: string) => void;
  incrementCommandCount: () => void;
  incrementCdCount: () => void;
  addVisitedDir: (dir: string) => void;

  // Lesson progress
  lessonProgress: Record<string, number>;
  updateLessonProgress: (moduleId: string, step: number) => void;

  // Achievements
  achievements: string[];
  unlockAchievement: (id: string) => void;

  // Learning mode
  learningMode: boolean;
  toggleLearningMode: () => void;

  // Toast notifications
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;

  // Boot
  bootCompleted: boolean;
  setBootCompleted: () => void;

  // Text editor files
  openFiles: Record<string, string>;
  setOpenFile: (path: string, content: string) => void;
}

const APP_TITLES: Record<AppType, string> = {
  terminal: 'Terminal',
  filemanager: 'File Manager',
  texteditor: 'Text Editor',
  lessons: 'Linux Lessons',
  systeminfo: 'System Information',
  about: 'About Parrot OS',
};

const APP_SIZES: Record<AppType, { width: number; height: number }> = {
  terminal: { width: 800, height: 500 },
  filemanager: { width: 900, height: 600 },
  texteditor: { width: 850, height: 600 },
  lessons: { width: 900, height: 650 },
  systeminfo: { width: 700, height: 550 },
  about: { width: 500, height: 400 },
};

let windowIdCounter = 0;

export const useDesktopStore = create<DesktopStore>()(
  persist(
    (set, get) => ({
      // Windows
      windows: [],
      activeWindowId: null,
      maxZIndex: 100,

      openWindow: (app, props) => {
        const id = `window-${++windowIdCounter}-${Date.now()}`;
        const size = APP_SIZES[app];
        const existingCount = get().windows.filter((w) => w.app === app).length;
        const offset = existingCount * 30;
        const maxZ = get().maxZIndex + 1;

        set((state) => ({
          windows: [
            ...state.windows,
            {
              id,
              app,
              title: APP_TITLES[app],
              x: 100 + offset,
              y: 60 + offset,
              width: size.width,
              height: size.height,
              minimized: false,
              maximized: false,
              zIndex: maxZ,
              props,
            },
          ],
          activeWindowId: id,
          maxZIndex: maxZ,
        }));
      },

      closeWindow: (id) =>
        set((state) => ({
          windows: state.windows.filter((w) => w.id !== id),
          activeWindowId:
            state.activeWindowId === id
              ? state.windows.filter((w) => w.id !== id).slice(-1)[0]?.id || null
              : state.activeWindowId,
        })),

      minimizeWindow: (id) =>
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id ? { ...w, minimized: !w.minimized } : w
          ),
          activeWindowId:
            state.activeWindowId === id
              ? state.windows.find((w) => w.id !== id && !w.minimized)?.id || null
              : state.activeWindowId,
        })),

      maximizeWindow: (id) =>
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id ? { ...w, maximized: !w.maximized, minimized: false } : w
          ),
        })),

      focusWindow: (id) => {
        const maxZ = get().maxZIndex + 1;
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id ? { ...w, zIndex: maxZ, minimized: false } : w
          ),
          activeWindowId: id,
          maxZIndex: maxZ,
        }));
      },

      updateWindowPosition: (id, pos) =>
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id ? { ...w, x: pos.x, y: pos.y } : w
          ),
        })),

      updateWindowSize: (id, size) =>
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id ? { ...w, width: size.width, height: size.height } : w
          ),
        })),

      // Terminal
      terminalHistory: [],
      currentDirectory: '/home/parrot',
      filesystem: defaultFilesystem,
      commandCount: 0,
      cdCount: 0,
      visitedDirs: ['/home/parrot'],

      addToHistory: (entry) =>
        set((state) => ({
          terminalHistory: [...state.terminalHistory.slice(-999), entry],
        })),

      updateFilesystem: (fs) => set({ filesystem: fs }),

      setCurrentDirectory: (dir) => set({ currentDirectory: dir }),

      incrementCommandCount: () =>
        set((state) => ({ commandCount: state.commandCount + 1 })),

      incrementCdCount: () =>
        set((state) => ({ cdCount: state.cdCount + 1 })),

      addVisitedDir: (dir) =>
        set((state) => ({
          visitedDirs: state.visitedDirs.includes(dir)
            ? state.visitedDirs
            : [...state.visitedDirs, dir],
        })),

      // Lesson progress
      lessonProgress: {},
      updateLessonProgress: (moduleId, step) =>
        set((state) => ({
          lessonProgress: {
            ...state.lessonProgress,
            [moduleId]: Math.max(state.lessonProgress[moduleId] || 0, step),
          },
        })),

      // Achievements
      achievements: [],
      unlockAchievement: (id) =>
        set((state) => {
          if (state.achievements.includes(id)) return state;
          return { achievements: [...state.achievements, id] };
        }),

      // Learning mode
      learningMode: false,
      toggleLearningMode: () =>
        set((state) => ({ learningMode: !state.learningMode })),

      // Toasts
      toasts: [],
      addToast: (toast) =>
        set((state) => ({
          toasts: [
            ...state.toasts,
            { ...toast, id: `toast-${Date.now()}-${Math.random()}` },
          ],
        })),
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),

      // Boot
      bootCompleted: false,
      setBootCompleted: () => set({ bootCompleted: true }),

      // Text editor
      openFiles: {},
      setOpenFile: (path, content) =>
        set((state) => ({
          openFiles: { ...state.openFiles, [path]: content },
        })),
    }),
    {
      name: 'parrot-os-desktop',
      version: 1,
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') return sessionStorage;
        return localStorage;
      }),
      partialize: (state) => ({
        filesystem: state.filesystem,
        currentDirectory: state.currentDirectory,
        terminalHistory: state.terminalHistory.slice(-100),
        lessonProgress: state.lessonProgress,
        achievements: state.achievements,
        learningMode: state.learningMode,
        commandCount: state.commandCount,
        cdCount: state.cdCount,
        visitedDirs: state.visitedDirs,
        openFiles: state.openFiles,
      }),
      migrate: (_persistedState, _version) => {
        // Clear stale state on version bump
        return {};
      },
      merge: (persistedState, currentState) => {
        const ps = (persistedState as Partial<typeof currentState>) ?? {};
        return {
          ...currentState,
          ...ps,
          // Always ensure arrays are valid — old persisted data may have null/wrong types
          achievements: Array.isArray(ps.achievements) ? ps.achievements : [],
          visitedDirs: Array.isArray(ps.visitedDirs) ? ps.visitedDirs : ['/home/parrot'],
          terminalHistory: Array.isArray(ps.terminalHistory) ? ps.terminalHistory : [],
          toasts: [],
          windows: [],
        };
      },
    }
  )
);
