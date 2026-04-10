import { CommandContext } from './navigation';

const PROCESSES = [
  { pid: 1, ppid: 0, user: 'root', cpu: 0.0, mem: 0.1, vsz: 168956, rss: 12440, stat: 'Ss', start: '07:30', time: '0:01', cmd: '/sbin/init' },
  { pid: 2, ppid: 0, user: 'root', cpu: 0.0, mem: 0.0, vsz: 0, rss: 0, stat: 'S', start: '07:30', time: '0:00', cmd: '[kthreadd]' },
  { pid: 3, ppid: 2, user: 'root', cpu: 0.0, mem: 0.0, vsz: 0, rss: 0, stat: 'I<', start: '07:30', time: '0:00', cmd: '[rcu_gp]' },
  { pid: 9, ppid: 2, user: 'root', cpu: 0.0, mem: 0.0, vsz: 0, rss: 0, stat: 'I<', start: '07:30', time: '0:00', cmd: '[mm_percpu_wq]' },
  { pid: 15, ppid: 2, user: 'root', cpu: 0.0, mem: 0.0, vsz: 0, rss: 0, stat: 'S', start: '07:30', time: '0:00', cmd: '[migration/0]' },
  { pid: 125, ppid: 1, user: 'root', cpu: 0.0, mem: 0.2, vsz: 31548, rss: 16844, stat: 'Ss', start: '07:30', time: '0:00', cmd: '/lib/systemd/systemd-journald' },
  { pid: 252, ppid: 1, user: 'root', cpu: 0.0, mem: 0.1, vsz: 23484, rss: 9680, stat: 'Ss', start: '07:30', time: '0:00', cmd: '/lib/systemd/systemd-udevd' },
  { pid: 512, ppid: 1, user: 'root', cpu: 0.0, mem: 0.1, vsz: 16864, rss: 7936, stat: 'Ss', start: '07:30', time: '0:00', cmd: '/usr/sbin/cron -f' },
  { pid: 845, ppid: 1, user: 'root', cpu: 0.0, mem: 0.2, vsz: 47624, rss: 17888, stat: 'Ss', start: '07:30', time: '0:00', cmd: '/lib/systemd/systemd-logind' },
  { pid: 892, ppid: 1, user: 'root', cpu: 0.0, mem: 0.1, vsz: 15600, rss: 7344, stat: 'Ss', start: '07:30', time: '0:00', cmd: 'sshd: /usr/sbin/sshd -D [listener] 0 of 10-100 startups' },
  { pid: 947, ppid: 1, user: 'root', cpu: 0.0, mem: 0.1, vsz: 6100, rss: 4096, stat: 'Ss', start: '07:30', time: '0:00', cmd: '/sbin/dhclient -4 -v -i -pf /run/dhclient.wlan0.pid wlan0' },
  { pid: 1045, ppid: 1, user: 'root', cpu: 0.0, mem: 0.2, vsz: 27888, rss: 14464, stat: 'Ss', start: '07:30', time: '0:00', cmd: '/usr/sbin/cupsd -l' },
  { pid: 1100, ppid: 1, user: 'avahi', cpu: 0.0, mem: 0.0, vsz: 8316, rss: 4120, stat: 'Ss', start: '07:30', time: '0:00', cmd: 'avahi-daemon: running [parrot-os.local]' },
  { pid: 1145, ppid: 845, user: 'parrot', cpu: 0.0, mem: 0.3, vsz: 18996, rss: 21504, stat: 'Ss', start: '07:30', time: '0:00', cmd: '/lib/systemd/systemd --user' },
  { pid: 1200, ppid: 1145, user: 'parrot', cpu: 0.0, mem: 0.1, vsz: 23484, rss: 8192, stat: 'S', start: '07:30', time: '0:00', cmd: '/usr/bin/dbus-daemon --session --address=systemd:' },
  { pid: 1234, ppid: 1, user: 'www-data', cpu: 0.0, mem: 0.2, vsz: 55348, rss: 14848, stat: 'Ss', start: '07:30', time: '0:00', cmd: 'nginx: master process /usr/sbin/nginx -g daemon on; master_process on;' },
  { pid: 1892, ppid: 1145, user: 'parrot', cpu: 0.2, mem: 1.5, vsz: 512488, rss: 121856, stat: 'Sl', start: '07:31', time: '0:12', cmd: '/usr/bin/mate-session' },
  { pid: 2100, ppid: 1892, user: 'parrot', cpu: 0.1, mem: 0.8, vsz: 298448, rss: 65536, stat: 'Sl', start: '07:31', time: '0:05', cmd: '/usr/bin/marco --no-composite' },
  { pid: 2145, ppid: 1892, user: 'parrot', cpu: 0.1, mem: 1.2, vsz: 456328, rss: 98304, stat: 'Sl', start: '07:31', time: '0:08', cmd: '/usr/bin/mate-panel' },
  { pid: 2200, ppid: 1892, user: 'parrot', cpu: 0.0, mem: 0.5, vsz: 187456, rss: 40960, stat: 'Sl', start: '07:31', time: '0:02', cmd: 'caja --no-desktop' },
  { pid: 2341, ppid: 1892, user: 'parrot', cpu: 2.1, mem: 8.3, vsz: 4356712, rss: 674816, stat: 'Sl', start: '07:32', time: '1:23', cmd: '/usr/lib/firefox/firefox' },
  { pid: 2342, ppid: 2341, user: 'parrot', cpu: 0.5, mem: 3.2, vsz: 2456712, rss: 260096, stat: 'Sl', start: '07:32', time: '0:34', cmd: '/usr/lib/firefox/firefox -contentproc -childID 1' },
  { pid: 2343, ppid: 2341, user: 'parrot', cpu: 0.3, mem: 2.1, vsz: 1856712, rss: 171008, stat: 'Sl', start: '07:32', time: '0:22', cmd: '/usr/lib/firefox/firefox -contentproc -childID 2' },
  { pid: 3100, ppid: 1892, user: 'parrot', cpu: 0.0, mem: 0.4, vsz: 145688, rss: 32768, stat: 'Sl', start: '07:45', time: '0:01', cmd: '/usr/lib/mate-terminal/mate-terminal' },
  { pid: 3101, ppid: 3100, user: 'parrot', cpu: 0.1, mem: 0.2, vsz: 24568, rss: 16384, stat: 'Ss+', start: '07:45', time: '0:00', cmd: 'bash' },
  { pid: 3200, ppid: 3101, user: 'parrot', cpu: 0.0, mem: 0.1, vsz: 7456, rss: 8192, stat: 'R+', start: '10:00', time: '0:00', cmd: 'ps aux' },
];

let runningProcesses = [...PROCESSES];
let jobList: Array<{ id: number; pid: number; status: string; cmd: string }> = [];

export function ps(ctx: CommandContext): string {
  const { args, flags } = ctx;
  const allUsers = flags.some(f => f.includes('a')) || args.some(a => a === 'aux' || a === 'au' || a === '-A' || a === '-e');
  const long = flags.some(f => f.includes('l'));
  const showUser = flags.some(f => f.includes('u')) || args.some(a => a === 'aux' || a === 'au');
  const showFull = flags.some(f => f.includes('f'));

  const header = showUser
    ? 'USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND'
    : '    PID TTY          TIME CMD';

  const procs = allUsers ? runningProcesses : runningProcesses.filter(p => p.user === 'parrot');

  const lines = [header];
  for (const proc of procs) {
    if (showUser) {
      const user = proc.user.padEnd(12);
      const pid = proc.pid.toString().padStart(5);
      const cpu = proc.cpu.toFixed(1).padStart(4);
      const mem = proc.mem.toFixed(1).padStart(4);
      const vsz = proc.vsz.toString().padStart(7);
      const rss = proc.rss.toString().padStart(6);
      const tty = 'pts/0   ';
      const stat = proc.stat.padEnd(4);
      const start = proc.start.padEnd(7);
      const time = proc.time.padEnd(7);
      lines.push(`${user} ${pid} ${cpu} ${mem} ${vsz} ${rss} ${tty} ${stat} ${start} ${time} ${proc.cmd}`);
    } else {
      lines.push(`${proc.pid.toString().padStart(7)} pts/0    ${proc.time.padStart(8)} ${proc.cmd.split(' ')[0]}`);
    }
  }

  return lines.join('\n');
}

export function top(ctx: CommandContext): string {
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
  const load = (Math.random() * 1.5 + 0.1).toFixed(2);
  const load5 = (Math.random() * 1.2 + 0.1).toFixed(2);
  const load15 = (Math.random() * 0.8 + 0.1).toFixed(2);
  const totalMem = 16384;
  const usedMem = Math.floor(8192 + Math.random() * 1000);
  const freeMem = totalMem - usedMem;
  const cpuUser = (Math.random() * 20 + 5).toFixed(1);
  const cpuSys = (Math.random() * 5 + 2).toFixed(1);
  const cpuIdle = (100 - parseFloat(cpuUser) - parseFloat(cpuSys)).toFixed(1);

  const header = `top - ${timeStr} up 2:30,  1 user,  load average: ${load}, ${load5}, ${load15}
Tasks: ${runningProcesses.length} total,   1 running,  ${runningProcesses.length - 1} sleeping,   0 stopped,   0 zombie
%Cpu(s): ${cpuUser} us,  ${cpuSys} sy,  0.0 ni, ${cpuIdle} id,  0.0 wa,  0.0 hi,  0.2 si,  0.0 st
MiB Mem :  ${totalMem}.0 total,   ${freeMem}.0 free,   ${usedMem}.0 used,   1024.0 buff/cache
MiB Swap:   4096.0 total,   4096.0 free,      0.0 used.   7500.0 avail Mem

    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND`;

  const procLines = runningProcesses
    .sort((a, b) => b.cpu - a.cpu)
    .slice(0, 20)
    .map(p => {
      const pid = p.pid.toString().padStart(7);
      const user = p.user.padEnd(9);
      const pr = '20'.padStart(3);
      const ni = '0'.padStart(4);
      const virt = (p.vsz).toString().padStart(8);
      const res = p.rss.toString().padStart(7);
      const shr = Math.floor(p.rss * 0.3).toString().padStart(7);
      const s = p.stat[0];
      const cpu = (p.cpu + Math.random() * 2).toFixed(1).padStart(5);
      const mem = p.mem.toFixed(1).padStart(5);
      const time = p.time.padStart(9);
      const cmd = p.cmd.split('/').pop()?.split(' ')[0]?.slice(0, 20) || p.cmd.slice(0, 20);
      return `${pid} ${user} ${pr} ${ni} ${virt} ${res} ${shr} ${s} ${cpu} ${mem} ${time} ${cmd}`;
    });

  return [header, ...procLines].join('\n') + '\n\n(press q to quit - simulated top output)';
}

export function htop(ctx: CommandContext): string {
  return top(ctx) + '\n\n(htop: Use top or ps for process management in this simulator)';
}

export function kill_cmd(ctx: CommandContext): string {
  const { args, flags } = ctx;
  const signal = flags.find(f => /^\d+$/.test(f)) || '15';
  const pidStr = args.find(a => !a.startsWith('-'));

  if (!pidStr) return 'kill: usage: kill [-s sigspec | -n signum | -sigspec] pid | jobspec ... or kill -l [sigspec]';

  if (args.includes('-l') || args.includes('--list')) {
    return ` 1) SIGHUP\t 2) SIGINT\t 3) SIGQUIT\t 4) SIGILL\t 5) SIGTRAP
 6) SIGABRT\t 7) SIGBUS\t 8) SIGFPE\t 9) SIGKILL\t10) SIGUSR1
11) SIGSEGV\t12) SIGUSR2\t13) SIGPIPE\t14) SIGALRM\t15) SIGTERM
16) SIGSTKFLT\t17) SIGCHLD\t18) SIGCONT\t19) SIGSTOP\t20) SIGTSTP
21) SIGTTIN\t22) SIGTTOU\t23) SIGURG\t24) SIGXCPU\t25) SIGXFSZ
26) SIGVTALRM\t27) SIGPROF\t28) SIGWINCH\t29) SIGIO\t30) SIGPWR
31) SIGSYS\t34) SIGRTMIN\t35) SIGRTMIN+1\t36) SIGRTMIN+2\t37) SIGRTMIN+3`;
  }

  const pid = parseInt(pidStr);
  if (isNaN(pid)) return `kill: '${pidStr}': arguments must be process or job IDs`;

  const procIndex = runningProcesses.findIndex(p => p.pid === pid);
  if (procIndex === -1) return `bash: kill: (${pid}) - No such process`;

  const proc = runningProcesses[procIndex];
  if (proc.pid <= 10) return `kill: cannot send signal ${signal} to process ${pid}: Operation not permitted`;

  if (signal === '9' || signal === '15') {
    runningProcesses = runningProcesses.filter(p => p.pid !== pid);
    return '';
  }

  return '';
}

export function killall(ctx: CommandContext): string {
  const { args } = ctx;
  const name = args.find(a => !a.startsWith('-'));
  if (!name) return 'killall: no process name specified';

  const before = runningProcesses.length;
  runningProcesses = runningProcesses.filter(p => !p.cmd.includes(name));
  const killed = before - runningProcesses.length;

  if (killed === 0) return `killall: no process found`;
  return '';
}

export function bg(ctx: CommandContext): string {
  if (jobList.length === 0) return 'bash: bg: current: no such job';
  const job = jobList[jobList.length - 1];
  job.status = 'Running';
  return `[${job.id}]+ ${job.cmd} &`;
}

export function fg(ctx: CommandContext): string {
  if (jobList.length === 0) return 'bash: fg: current: no such job';
  const job = jobList[jobList.length - 1];
  job.status = 'Foreground';
  return job.cmd;
}

export function jobs(ctx: CommandContext): string {
  if (jobList.length === 0) return '';
  return jobList.map(j => `[${j.id}]+ ${j.status.padEnd(12)} ${j.cmd}`).join('\n');
}

export function pstree(ctx: CommandContext): string {
  return `systemd─┬─ModemManager───2*[{ModemManager}]
        ├─NetworkManager───2*[{NetworkManager}]
        ├─accounts-daemon───2*[{accounts-daemon}]
        ├─avahi-daemon───avahi-daemon
        ├─cron
        ├─cupsd
        ├─dbus-daemon
        ├─dhclient
        ├─mate-session─┬─caja───5*[{caja}]
        │              ├─firefox─┬─2*[firefox───21*[{firefox}]]
        │              │         └─31*[{firefox}]
        │              ├─marco───4*[{marco}]
        │              ├─mate-panel───3*[{mate-panel}]
        │              └─mate-terminal───bash───pstree
        ├─polkitd───2*[{polkitd}]
        ├─sshd
        ├─systemd-journald
        ├─systemd-logind
        ├─systemd-resolve
        ├─systemd-timesyn───{systemd-timesyn}
        └─systemd-udevd`;
}

export function nice(ctx: CommandContext): string {
  const { args } = ctx;
  if (!args[0]) return 'Usage: nice [-n increment] [COMMAND [ARG]...]';
  const nIndex = args.indexOf('-n');
  const cmd = nIndex !== -1 ? args.slice(nIndex + 2).join(' ') : args.join(' ');
  return `Running '${cmd}' with modified niceness\n(simulated)`;
}

export function nohup(ctx: CommandContext): string {
  const { args } = ctx;
  if (!args[0]) return 'Usage: nohup COMMAND [ARG]...';
  return `nohup: ignoring input and appending output to 'nohup.out'\n(simulated - running '${args.join(' ')}' in background)`;
}
