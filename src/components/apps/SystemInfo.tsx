'use client';

import React, { useState, useEffect } from 'react';

interface StatBarProps {
  label: string;
  value: number; // 0-100
  color?: string;
  detail?: string;
}

function StatBar({ label, value, color = '#00d4aa', detail }: StatBarProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-300">{label}</span>
        <div className="flex items-center gap-2">
          {detail && <span className="text-gray-500">{detail}</span>}
          <span style={{ color }}>{value.toFixed(1)}%</span>
        </div>
      </div>
      <div className="h-2 rounded-full bg-parrot-border overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${value}%`,
            backgroundColor: color,
            boxShadow: `0 0 6px ${color}44`,
          }}
        />
      </div>
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
  accent?: boolean;
}

function InfoRow({ label, value, accent }: InfoRowProps) {
  return (
    <div className="flex items-start gap-2 py-1 border-b border-parrot-border/30">
      <span className="text-parrot-accent text-xs font-medium w-32 shrink-0">{label}:</span>
      <span className={`text-xs ${accent ? 'text-parrot-accent' : 'text-gray-300'} font-mono`}>{value}</span>
    </div>
  );
}

const BOOT_TIME = new Date('2026-03-29T07:30:00');

function getUptime(): string {
  const now = new Date();
  const diff = now.getTime() - BOOT_TIME.getTime();
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export default function SystemInfo() {
  const [cpuUsage, setCpuUsage] = useState(25.4);
  const [ramUsage, setRamUsage] = useState(50.2);
  const [swapUsage] = useState(0);
  const [diskUsage] = useState(34.8);
  const [networkRx, setNetworkRx] = useState(48.3);
  const [networkTx, setNetworkTx] = useState(12.1);
  const [uptime, setUptime] = useState(getUptime());
  const [cpuCores, setCpuCores] = useState([22.1, 31.5, 18.3, 45.2, 28.7, 15.4, 39.2, 20.8]);
  const [temperature, setTemperature] = useState(52);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate fluctuating CPU usage
      setCpuUsage(prev => {
        const delta = (Math.random() - 0.5) * 8;
        return Math.max(5, Math.min(95, prev + delta));
      });

      // RAM slowly changes
      setRamUsage(prev => {
        const delta = (Math.random() - 0.5) * 2;
        return Math.max(40, Math.min(90, prev + delta));
      });

      // Network varies
      setNetworkRx(prev => Math.max(0, prev + (Math.random() - 0.5) * 20));
      setNetworkTx(prev => Math.max(0, prev + (Math.random() - 0.5) * 10));

      // CPU cores
      setCpuCores(prev => prev.map(c => Math.max(5, Math.min(95, c + (Math.random() - 0.5) * 10))));

      // Temperature
      setTemperature(prev => Math.max(40, Math.min(85, prev + (Math.random() - 0.5) * 2)));

      // Uptime
      setUptime(getUptime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const totalRam = 16.0;
  const usedRam = (totalRam * ramUsage / 100).toFixed(1);
  const totalDisk = 256;
  const usedDisk = (totalDisk * diskUsage / 100).toFixed(0);

  const cpuColor = cpuUsage > 80 ? '#ff4444' : cpuUsage > 60 ? '#ffaa44' : '#00d4aa';
  const ramColor = ramUsage > 85 ? '#ff4444' : ramUsage > 70 ? '#ffaa44' : '#00d4aa';
  const tempColor = temperature > 75 ? '#ff4444' : temperature > 60 ? '#ffaa44' : '#00d4aa';

  return (
    <div className="flex flex-col h-full bg-parrot-bg text-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-3 bg-parrot-panel border-b border-parrot-border">
        <h1 className="text-base font-bold text-parrot-accent">System Information</h1>
        <p className="text-xs text-gray-500 mt-0.5">Parrot OS 5.3 (Electro Ara) · Live Stats</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* System Info */}
          <div className="bg-parrot-panel rounded-lg p-4 border border-parrot-border">
            <h2 className="text-sm font-semibold text-parrot-accent mb-3 flex items-center gap-2">
              <span>💻</span> System
            </h2>
            <div className="space-y-0">
              <InfoRow label="OS" value="Parrot OS 5.3 (Electro Ara)" />
              <InfoRow label="Kernel" value="6.1.0-1parrot1-amd64" />
              <InfoRow label="Architecture" value="x86_64" />
              <InfoRow label="Desktop" value="MATE 1.26.0" />
              <InfoRow label="WM" value="Metacity (Marco)" />
              <InfoRow label="Shell" value="bash 5.2.15" />
              <InfoRow label="Hostname" value="parrot-os" />
              <InfoRow label="User" value="parrot" />
              <InfoRow label="Uptime" value={uptime} accent />
            </div>
          </div>

          {/* Hardware */}
          <div className="bg-parrot-panel rounded-lg p-4 border border-parrot-border">
            <h2 className="text-sm font-semibold text-parrot-accent mb-3 flex items-center gap-2">
              <span>🔧</span> Hardware
            </h2>
            <div className="space-y-0">
              <InfoRow label="CPU" value="Intel Core i7-10750H" />
              <InfoRow label="CPU Cores" value="8 (4 physical, 8 logical)" />
              <InfoRow label="CPU Freq" value="2.60GHz (max 5.00GHz)" />
              <InfoRow label="RAM" value={`${usedRam} GiB / ${totalRam} GiB`} />
              <InfoRow label="Swap" value="0 B / 4.0 GiB" />
              <InfoRow label="GPU" value="NVIDIA GeForce GTX 1650" />
              <InfoRow label="VRAM" value="4 GiB GDDR5" />
              <InfoRow label="Storage" value={`${usedDisk} GB / ${totalDisk} GB`} />
              <InfoRow label="Battery" value="87% (Discharging)" accent />
            </div>
          </div>

          {/* CPU Usage */}
          <div className="bg-parrot-panel rounded-lg p-4 border border-parrot-border">
            <h2 className="text-sm font-semibold text-parrot-accent mb-3 flex items-center gap-2">
              <span>⚡</span> CPU Usage
              <span className="ml-auto text-xs font-mono" style={{ color: cpuColor }}>
                {cpuUsage.toFixed(1)}%
              </span>
            </h2>
            <div className="space-y-3">
              <StatBar
                label="Total CPU"
                value={cpuUsage}
                color={cpuColor}
                detail={`${(cpuUsage * 8 / 100 * 2.6).toFixed(2)} GHz`}
              />
              <div className="grid grid-cols-4 gap-1.5">
                {cpuCores.map((usage, idx) => (
                  <div key={idx} className="text-center">
                    <div
                      className="h-12 rounded relative overflow-hidden bg-parrot-border"
                      title={`Core ${idx}: ${usage.toFixed(1)}%`}
                    >
                      <div
                        className="absolute bottom-0 left-0 right-0 rounded transition-all duration-500"
                        style={{
                          height: `${usage}%`,
                          backgroundColor: usage > 80 ? '#ff4444' : usage > 60 ? '#ffaa44' : '#00d4aa',
                          opacity: 0.8,
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">C{idx}</div>
                  </div>
                ))}
              </div>
              <StatBar
                label="Temperature"
                value={(temperature / 100) * 100}
                color={tempColor}
                detail={`${temperature}°C`}
              />
            </div>
          </div>

          {/* Memory */}
          <div className="bg-parrot-panel rounded-lg p-4 border border-parrot-border">
            <h2 className="text-sm font-semibold text-parrot-accent mb-3 flex items-center gap-2">
              <span>🧠</span> Memory
            </h2>
            <div className="space-y-3">
              <StatBar
                label={`RAM (${usedRam} / ${totalRam} GiB)`}
                value={ramUsage}
                color={ramColor}
              />
              <StatBar
                label="Swap (0 / 4.0 GiB)"
                value={swapUsage}
                color="#4488ff"
              />
              <StatBar
                label={`Disk /dev/sda1 (${usedDisk} / ${totalDisk} GB)`}
                value={diskUsage}
                color="#aa88ff"
              />
            </div>

            <div className="mt-4 pt-3 border-t border-parrot-border">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-parrot-bg rounded p-2">
                  <div className="text-gray-500">Available RAM</div>
                  <div className="text-white font-mono">{(totalRam - parseFloat(usedRam)).toFixed(1)} GiB</div>
                </div>
                <div className="bg-parrot-bg rounded p-2">
                  <div className="text-gray-500">Cached</div>
                  <div className="text-white font-mono">2.5 GiB</div>
                </div>
                <div className="bg-parrot-bg rounded p-2">
                  <div className="text-gray-500">Shared</div>
                  <div className="text-white font-mono">128 MiB</div>
                </div>
                <div className="bg-parrot-bg rounded p-2">
                  <div className="text-gray-500">Buffers</div>
                  <div className="text-white font-mono">512 MiB</div>
                </div>
              </div>
            </div>
          </div>

          {/* Network */}
          <div className="bg-parrot-panel rounded-lg p-4 border border-parrot-border">
            <h2 className="text-sm font-semibold text-parrot-accent mb-3 flex items-center gap-2">
              <span>🌐</span> Network
            </h2>
            <div className="space-y-2">
              <InfoRow label="Interface" value="wlan0 (WiFi)" />
              <InfoRow label="IP Address" value="192.168.1.105" accent />
              <InfoRow label="Subnet" value="255.255.255.0 (/24)" />
              <InfoRow label="Gateway" value="192.168.1.1" />
              <InfoRow label="DNS" value="8.8.8.8, 1.1.1.1" />
              <InfoRow label="MAC Address" value="3c:58:c2:8d:e6:aa" />
              <InfoRow label="eth0" value="Disconnected" />
            </div>
            <div className="mt-3 pt-3 border-t border-parrot-border grid grid-cols-2 gap-2 text-xs">
              <div className="bg-parrot-bg rounded p-2">
                <div className="text-gray-500">↓ Download</div>
                <div className="text-parrot-accent font-mono">{networkRx.toFixed(1)} KB/s</div>
              </div>
              <div className="bg-parrot-bg rounded p-2">
                <div className="text-gray-500">↑ Upload</div>
                <div className="text-parrot-accent font-mono">{networkTx.toFixed(1)} KB/s</div>
              </div>
            </div>
          </div>

          {/* Processes */}
          <div className="bg-parrot-panel rounded-lg p-4 border border-parrot-border">
            <h2 className="text-sm font-semibold text-parrot-accent mb-3 flex items-center gap-2">
              <span>⚙️</span> Top Processes
            </h2>
            <div className="space-y-1">
              {[
                { name: 'firefox', cpu: 2.1, mem: 8.3, pid: 2341 },
                { name: 'mate-session', cpu: 0.5, mem: 2.5, pid: 1892 },
                { name: 'marco', cpu: 0.3, mem: 1.8, pid: 2100 },
                { name: 'mate-panel', cpu: 0.2, mem: 1.5, pid: 2145 },
                { name: 'caja', cpu: 0.1, mem: 1.2, pid: 2200 },
                { name: 'bash', cpu: 0.1, mem: 0.2, pid: 3101 },
                { name: 'NetworkManager', cpu: 0.0, mem: 0.4, pid: 892 },
                { name: 'systemd', cpu: 0.0, mem: 0.1, pid: 1 },
              ].map((proc) => (
                <div key={proc.pid} className="flex items-center gap-2 text-xs py-0.5">
                  <span className="text-gray-500 w-8 text-right">{proc.pid}</span>
                  <span className="text-white w-28 truncate">{proc.name}</span>
                  <div className="flex-1 flex items-center gap-1">
                    <div className="flex-1 bg-parrot-border h-1 rounded">
                      <div
                        className="h-full bg-parrot-accent rounded"
                        style={{ width: `${Math.min(proc.cpu * 10, 100)}%` }}
                      />
                    </div>
                    <span className="text-gray-400 w-10 text-right">{proc.cpu}%</span>
                  </div>
                  <span className="text-gray-500 w-10 text-right">{proc.mem}%</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-2 border-t border-parrot-border text-xs text-gray-500">
              Total: 27 processes · 1 running · 26 sleeping
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
