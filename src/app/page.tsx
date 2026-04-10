'use client';

import dynamic from 'next/dynamic';

// Dynamically import to avoid SSR issues with localStorage/window
const Desktop = dynamic(() => import('@/components/desktop/Desktop'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ color: '#00d4aa', fontFamily: 'monospace', fontSize: '14px' }}>
        Initializing...
      </div>
    </div>
  ),
});

export default function Home() {
  return <Desktop />;
}
