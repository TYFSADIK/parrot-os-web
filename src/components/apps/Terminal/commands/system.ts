import { CommandContext } from './navigation';

const BOOT_TIME = new Date('2026-03-29T07:30:00');

function getUptime(): string {
  const now = new Date();
  const diff = now.getTime() - BOOT_TIME.getTime();
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  return `${hours}:${minutes.toString().padStart(2, '0')}`;
}

function getUptimeLong(): string {
  const now = new Date();
  const diff = now.getTime() - BOOT_TIME.getTime();
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  return `${hours} hours, ${minutes} minutes`;
}

export function whoami(ctx: CommandContext): string {
  return 'parrot';
}

export function id_cmd(ctx: CommandContext): string {
  const user = ctx.args[0] || 'parrot';
  if (user === 'root') {
    return 'uid=0(root) gid=0(root) groups=0(root)';
  }
  return 'uid=1000(parrot) gid=1000(parrot) groups=1000(parrot),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),121(lpadmin),132(lxd),133(sambashare)';
}

export function uname(ctx: CommandContext): string {
  const { flags } = ctx;
  const all = flags.includes('a');
  const kernel = flags.includes('s') || all;
  const node = flags.includes('n') || all;
  const release = flags.includes('r') || all;
  const version = flags.includes('v') || all;
  const machine = flags.includes('m') || all;
  const processor = flags.includes('p') || all;
  const os = flags.includes('o') || all;

  if (all) {
    return 'Linux parrot-os 6.1.0-1parrot1-amd64 #1 SMP PREEMPT_DYNAMIC Parrot 6.1.15-1parrot1 (2023-04-01) x86_64 GNU/Linux';
  }

  const parts: string[] = [];
  if (kernel || flags.length === 0) parts.push('Linux');
  if (node) parts.push('parrot-os');
  if (release) parts.push('6.1.0-1parrot1-amd64');
  if (version) parts.push('#1 SMP PREEMPT_DYNAMIC Parrot 6.1.15-1parrot1 (2023-04-01)');
  if (machine || processor) parts.push('x86_64');
  if (os) parts.push('GNU/Linux');

  return parts.join(' ') || 'Linux';
}

export function uptime(ctx: CommandContext): string {
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
  const load1 = (Math.random() * 1.5 + 0.1).toFixed(2);
  const load5 = (Math.random() * 1.2 + 0.1).toFixed(2);
  const load15 = (Math.random() * 0.8 + 0.1).toFixed(2);
  return ` ${timeStr} up ${getUptimeLong()},  1 user,  load average: ${load1}, ${load5}, ${load15}`;
}

export function date_cmd(ctx: CommandContext): string {
  const { args } = ctx;
  const now = new Date();

  if (args[0] && args[0].startsWith('+')) {
    const format = args[0].slice(1);
    return format
      .replace('%Y', now.getFullYear().toString())
      .replace('%m', (now.getMonth() + 1).toString().padStart(2, '0'))
      .replace('%d', now.getDate().toString().padStart(2, '0'))
      .replace('%H', now.getHours().toString().padStart(2, '0'))
      .replace('%M', now.getMinutes().toString().padStart(2, '0'))
      .replace('%S', now.getSeconds().toString().padStart(2, '0'))
      .replace('%A', ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][now.getDay()])
      .replace('%B', ['January','February','March','April','May','June','July','August','September','October','November','December'][now.getMonth()])
      .replace('%s', Math.floor(now.getTime() / 1000).toString());
  }

  return now.toUTCString().replace('GMT', 'UTC');
}

export function cal(ctx: CommandContext): string {
  const { args } = ctx;
  const now = new Date();
  const month = args[0] ? parseInt(args[0]) - 1 : now.getMonth();
  const year = args[1] ? parseInt(args[1]) : now.getFullYear();

  const monthNames = ['January','February','March','April','May','June',
    'July','August','September','October','November','December'];

  const header = `   ${monthNames[month]} ${year}`;
  const dayHeader = 'Su Mo Tu We Th Fr Sa';

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const lines: string[] = [header.padStart((20 + header.length) / 2), dayHeader];
  let week = '   '.repeat(firstDay);

  for (let d = 1; d <= daysInMonth; d++) {
    const dayStr = d === now.getDate() && month === now.getMonth() && year === now.getFullYear()
      ? `[${d.toString().padStart(2)}]`
      : d.toString().padStart(2);
    week += dayStr + ' ';
    const dayOfWeek = (firstDay + d - 1) % 7;
    if (dayOfWeek === 6 || d === daysInMonth) {
      lines.push(week.trimEnd());
      week = '';
    }
  }

  return lines.join('\n');
}

export function echo_cmd(ctx: CommandContext): string {
  const { rawArgs, flags } = ctx;
  const noNewline = flags.includes('n');
  // Strip the 'echo' part and any flags, then expand basic variables
  let text = rawArgs;

  // Remove leading -n or -e flags
  text = text.replace(/^-[en]+\s*/, '');

  // Expand common variables
  text = text
    .replace(/\$HOME/g, '/home/parrot')
    .replace(/\$USER/g, 'parrot')
    .replace(/\$HOSTNAME/g, 'parrot-os')
    .replace(/\$SHELL/g, '/bin/bash')
    .replace(/\$PATH/g, '/home/parrot/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin')
    .replace(/\$PWD/g, ctx.currentDirectory)
    .replace(/\$\?/g, '0')
    .replace(/\$\$/g, '1337')
    .replace(/\$RANDOM/g, Math.floor(Math.random() * 32768).toString())
    .replace(/\$\{([^}]+)\}/g, (_, v) => {
      const vars: Record<string, string> = {
        HOME: '/home/parrot',
        USER: 'parrot',
        HOSTNAME: 'parrot-os',
        SHELL: '/bin/bash',
        PATH: '/home/parrot/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
      };
      return vars[v] || '';
    });

  // Remove surrounding quotes if present
  if ((text.startsWith('"') && text.endsWith('"')) ||
      (text.startsWith("'") && text.endsWith("'"))) {
    text = text.slice(1, -1);
  }

  return text;
}

export function env_cmd(ctx: CommandContext): string {
  return `SHELL=/bin/bash
HOME=/home/parrot
USER=parrot
LOGNAME=parrot
HOSTNAME=parrot-os
TERM=xterm-256color
COLORTERM=truecolor
DISPLAY=:0
LANG=en_US.UTF-8
LANGUAGE=en_US:en
LC_ALL=en_US.UTF-8
XDG_SESSION_TYPE=x11
XDG_SESSION_DESKTOP=mate
XDG_CURRENT_DESKTOP=MATE
DESKTOP_SESSION=mate
GTK_THEME=Arc-Dark
PATH=/home/parrot/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games
EDITOR=nano
VISUAL=nano
PAGER=less
PARROT_VERSION=5.3
PARROT_CODENAME=Electro Ara
DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus
XDG_RUNTIME_DIR=/run/user/1000
HISTSIZE=1000
HISTFILESIZE=2000
PYTHONPATH=/usr/lib/python3/dist-packages`;
}

export function history_cmd(ctx: CommandContext, commandHistory: string[]): string {
  const lines = commandHistory.map((cmd, i) =>
    `  ${(i + 1).toString().padStart(4)}  ${cmd}`
  );
  return lines.join('\n');
}

export function which_cmd(ctx: CommandContext): string {
  const { args } = ctx;
  if (!args[0]) return 'which: missing argument';

  const bins: Record<string, string> = {
    bash: '/bin/bash',
    sh: '/bin/sh',
    ls: '/bin/ls',
    cat: '/bin/cat',
    grep: '/bin/grep',
    find: '/usr/bin/find',
    python3: '/usr/bin/python3',
    python: '/usr/bin/python3',
    nmap: '/usr/bin/nmap',
    wget: '/usr/bin/wget',
    curl: '/usr/bin/curl',
    ssh: '/usr/bin/ssh',
    apt: '/usr/bin/apt',
    dpkg: '/usr/bin/dpkg',
    sudo: '/usr/bin/sudo',
    id: '/usr/bin/id',
    whoami: '/usr/bin/whoami',
    chmod: '/bin/chmod',
    chown: '/bin/chown',
    cp: '/bin/cp',
    mv: '/bin/mv',
    rm: '/bin/rm',
    mkdir: '/bin/mkdir',
    touch: '/usr/bin/touch',
    nano: '/usr/bin/nano',
    vim: '/usr/bin/vim',
    git: '/usr/bin/git',
    ping: '/bin/ping',
    netstat: '/bin/netstat',
    ip: '/sbin/ip',
    ifconfig: '/sbin/ifconfig',
    ps: '/bin/ps',
    top: '/usr/bin/top',
    htop: '/usr/bin/htop',
    kill: '/bin/kill',
    tar: '/bin/tar',
    gzip: '/bin/gzip',
    gunzip: '/bin/gunzip',
    zip: '/usr/bin/zip',
    unzip: '/usr/bin/unzip',
    awk: '/usr/bin/awk',
    sed: '/bin/sed',
    cut: '/usr/bin/cut',
    sort: '/usr/bin/sort',
    uniq: '/usr/bin/uniq',
    wc: '/usr/bin/wc',
    head: '/usr/bin/head',
    tail: '/usr/bin/tail',
    diff: '/usr/bin/diff',
    df: '/bin/df',
    du: '/usr/bin/du',
    free: '/usr/bin/free',
    mount: '/bin/mount',
    uname: '/bin/uname',
    date: '/bin/date',
    echo: '/bin/echo',
    printf: '/usr/bin/printf',
    env: '/usr/bin/env',
    neofetch: '/usr/bin/neofetch',
    figlet: '/usr/bin/figlet',
    cowsay: '/usr/bin/cowsay',
    lolcat: '/usr/bin/lolcat',
    hydra: '/usr/bin/hydra',
    nmap_security: '/usr/bin/nmap',
    john: '/usr/sbin/john',
    hashcat: '/usr/bin/hashcat',
    aircrack_ng: '/usr/bin/aircrack-ng',
    sqlmap: '/usr/bin/sqlmap',
    nikto: '/usr/bin/nikto',
  };

  const results: string[] = [];
  for (const cmd of args) {
    const path = bins[cmd];
    if (path) results.push(path);
    else results.push(`${cmd} not found`);
  }
  return results.join('\n');
}

export function whereis_cmd(ctx: CommandContext): string {
  const { args } = ctx;
  if (!args[0]) return 'whereis: missing argument';

  const cmd = args[0];
  const bin = `/usr/bin/${cmd}`;
  const man = `/usr/share/man/man1/${cmd}.1.gz`;
  return `${cmd}: ${bin} ${man}`;
}

export function hostname_cmd(ctx: CommandContext): string {
  const { flags } = ctx;
  if (flags.includes('I') || flags.includes('i')) return '192.168.1.105';
  return 'parrot-os';
}

export function lsb_release(ctx: CommandContext): string {
  const { flags } = ctx;
  if (flags.includes('a')) {
    return `No LSB modules are available.
Distributor ID:\tParrot
Description:\tParrot OS 5.3 (Electro Ara)
Release:\t5.3
Codename:\telectro`;
  }
  if (flags.includes('d')) return 'Description:\tParrot OS 5.3 (Electro Ara)';
  if (flags.includes('r')) return 'Release:\t5.3';
  if (flags.includes('c')) return 'Codename:\telectro';
  return `No LSB modules are available.
Distributor ID:\tParrot
Description:\tParrot OS 5.3 (Electro Ara)
Release:\t5.3
Codename:\telectro`;
}

export function printenv_cmd(ctx: CommandContext): string {
  const { args } = ctx;
  const envVars: Record<string, string> = {
    HOME: '/home/parrot',
    USER: 'parrot',
    SHELL: '/bin/bash',
    TERM: 'xterm-256color',
    PATH: '/home/parrot/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
    LANG: 'en_US.UTF-8',
    HOSTNAME: 'parrot-os',
    PWD: ctx.currentDirectory,
    EDITOR: 'nano',
    VISUAL: 'nano',
    PAGER: 'less',
    XDG_CURRENT_DESKTOP: 'MATE',
  };

  if (args[0]) {
    return envVars[args[0]] || '';
  }
  return Object.entries(envVars).map(([k, v]) => `${k}=${v}`).join('\n');
}

export function clear_cmd(): string {
  return '__CLEAR__';
}

export function reset_cmd(): string {
  return '__CLEAR__';
}

export function help_cmd(ctx: CommandContext): string {
  const { args } = ctx;
  if (args[0]) {
    const { getCommandHelp } = require('@/lib/command-help');
    return getCommandHelp(args[0]);
  }
  return `Parrot OS Terminal Simulator - Available Commands

NAVIGATION:
  pwd, ls [-la], cd, mkdir, rmdir, tree, find, locate

FILES & TEXT:
  cat, head, tail, touch, cp, mv, rm, grep, nano, vim, less
  wc, diff, sort, uniq, file, stat, awk, sed, cut, tr, tee
  xargs, paste, join, base64, md5sum, sha256sum, xxd, od, strings, hexdump

SYSTEM:
  whoami, id, uname, uptime, date, cal, echo, env, history
  which, whereis, hostname, lsb_release, printenv, alias, export
  clear, reset, exit, help, man, set, unset, source, read, printf

PROCESSES:
  ps, top, htop, kill, killall, bg, fg, jobs, pstree, nice, nohup

NETWORKING:
  ip, ifconfig, ping, netstat, ss, nmap, curl, wget, ssh, scp
  traceroute, dig, nslookup, whois, arp, route

PACKAGES:
  apt update/upgrade/install/remove/search/list
  dpkg -l, dpkg -i

PERMISSIONS:
  chmod, chown, chgrp, sudo, su, passwd, umask, id, groups

DISK:
  df, du, mount, umount, lsblk, fdisk, free, iostat, vmstat

COMPRESSION:
  tar, zip, unzip, gzip, gunzip, bzip2, bunzip2, xz, unxz

FUN:
  neofetch, cowsay, fortune, sl, figlet, lolcat, matrix, banner

SECURITY (educational):
  hydra, hashcat, john, aircrack-ng, wireshark, msfconsole
  nikto, sqlmap, nmap

MISC:
  yes, seq, shuf

FEATURES:
  | pipes, >, >> redirection, Tab completion, Up/Down arrow history
  !! repeat last, !n run nth command, ~/ home directory shortcut

Type 'man <command>' or 'help <command>' for details.`;
}

export function man_cmd(ctx: CommandContext): string {
  const { args } = ctx;
  if (!args[0]) return 'What manual page do you want?\nFor example, try \'man ls\'';
  const { getCommandHelp } = require('@/lib/command-help');
  return getCommandHelp(args[0]);
}

export function alias_cmd(ctx: CommandContext): string {
  const { rawArgs } = ctx;
  const builtins: Record<string, string> = {
    'll': 'ls -alF',
    'la': 'ls -A',
    'l': 'ls -CF',
    'ls': 'ls --color=auto',
    'grep': 'grep --color=auto',
    'update': 'sudo apt update && sudo apt upgrade -y',
    'install': 'sudo apt install',
    'remove': 'sudo apt remove',
    'cls': 'clear',
    '..': 'cd ..',
    '...': 'cd ../..',
    'ports': 'netstat -tulpn',
    'myip': 'curl ifconfig.me',
    'df': 'df -h',
    'du': 'du -sh',
  };

  if (!rawArgs || rawArgs.trim() === '') {
    return Object.entries(builtins).map(([k, v]) => `alias ${k}='${v}'`).join('\n');
  }
  return `alias ${rawArgs}='${rawArgs}'`;
}

export function export_cmd(ctx: CommandContext): string {
  const { rawArgs } = ctx;
  if (!rawArgs) {
    return `declare -x HOME="/home/parrot"
declare -x LANG="en_US.UTF-8"
declare -x PATH="/home/parrot/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
declare -x SHELL="/bin/bash"
declare -x TERM="xterm-256color"
declare -x USER="parrot"`;
  }
  return '';
}

export function source_cmd(ctx: CommandContext): string {
  const { args, filesystem, currentDirectory } = ctx;
  const { getNodeAtPath, resolvePath } = require('@/lib/filesystem');
  if (!args[0]) return 'source: filename argument required';
  const path = resolvePath(currentDirectory, args[0]);
  const node = getNodeAtPath(filesystem, path);
  if (!node) return `bash: ${args[0]}: No such file or directory`;
  return `Sourced ${args[0]}`;
}

export function set_cmd(ctx: CommandContext): string {
  return `BASH=/bin/bash
BASHOPTS=checkwinsize:cmdhist:complete_fullquote:expand_aliases:extglob:extquote:force_fignore:globasciiranges:histappend:interactive_comments:login_shell:progcomp:promptvars:sourcepath
BASH_ALIASES=()
BASH_ARGC=()
BASH_VERSINFO=([0]="5" [1]="2" [2]="15" [3]="1" [4]="release" [5]="x86_64-pc-linux-gnu")
HOME=/home/parrot
HOSTNAME=parrot-os
LANG=en_US.UTF-8
PATH=/home/parrot/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
SHELL=/bin/bash
TERM=xterm-256color
USER=parrot`;
}

export function unset_cmd(ctx: CommandContext): string {
  if (!ctx.args[0]) return 'unset: usage: unset [-f] [-v] [-n] [name ...]';
  return '';
}

export function printf_cmd(ctx: CommandContext): string {
  const { rawArgs } = ctx;
  if (!rawArgs) return 'printf: usage: printf [-v var] format [arguments]';
  const fmt = rawArgs.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
  return fmt;
}

export function read_cmd(ctx: CommandContext): string {
  return '(read: interactive input not supported in this simulator)';
}

export function exit_cmd(): string {
  return 'logout\n(Cannot exit - this is a web terminal)';
}
