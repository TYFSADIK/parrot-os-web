'use client';

import React, { lazy, Suspense } from 'react';
import { useDesktopStore, AppType } from '@/store/desktop';
import Window from './Window';

// Lazy load app components
const Terminal = lazy(() => import('@/components/apps/Terminal/Terminal'));
const FileManager = lazy(() => import('@/components/apps/FileManager'));
const TextEditor = lazy(() => import('@/components/apps/TextEditor'));
const Lessons = lazy(() => import('@/components/apps/Lessons'));
const SystemInfo = lazy(() => import('@/components/apps/SystemInfo'));
const About = lazy(() => import('@/components/apps/About'));

function AppLoader({ app, windowId, props }: { app: AppType; windowId: string; props?: Record<string, unknown> }) {
  switch (app) {
    case 'terminal':
      return <Terminal windowId={windowId} />;
    case 'filemanager':
      return <FileManager />;
    case 'texteditor':
      return <TextEditor filePath={props?.filePath as string | undefined} />;
    case 'lessons':
      return <Lessons />;
    case 'systeminfo':
      return <SystemInfo />;
    case 'about':
      return <About />;
    default:
      return null;
  }
}

export default function WindowManager() {
  const { windows } = useDesktopStore();

  return (
    <>
      {windows.map((win) => (
        <Window key={win.id} window={win}>
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center bg-parrot-terminal">
                <div className="text-parrot-accent text-xs font-mono animate-pulse">
                  Loading...
                </div>
              </div>
            }
          >
            <AppLoader app={win.app} windowId={win.id} props={win.props} />
          </Suspense>
        </Window>
      ))}
    </>
  );
}
