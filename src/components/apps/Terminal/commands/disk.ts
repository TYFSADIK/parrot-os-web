import { CommandContext } from './navigation';
import { FSNode, getNodeAtPath, resolvePath, getFileSize, formatSize } from '@/lib/filesystem';

export function df(ctx: CommandContext): string {
  const { flags } = ctx;
  const human = flags.includes('h') || flags.some(f => f.includes('h'));

  const format = (bytes: number): string => {
    if (human) return formatSize(bytes);
    return Math.floor(bytes / 1024).toString();
  };

  const totalDisk = 256 * 1024 * 1024 * 1024;
  const usedDisk = 89 * 1024 * 1024 * 1024;
  const freeDisk = totalDisk - usedDisk;
  const usePct = Math.round((usedDisk / totalDisk) * 100);

  const tmpTotal = 2 * 1024 * 1024 * 1024;
  const tmpUsed = 45 * 1024 * 1024;
  const tmpFree = tmpTotal - tmpUsed;

  const header = human
    ? 'Filesystem      Size  Used Avail Use% Mounted on'
    : 'Filesystem     1K-blocks      Used Available Use% Mounted on';

  const rows = [
    human
      ? `/dev/sda1       ${formatSize(totalDisk).padStart(4)}   ${formatSize(usedDisk).padStart(4)}  ${formatSize(freeDisk).padStart(4)}  ${usePct}% /`
      : `/dev/sda1       ${Math.floor(totalDisk/1024).toString().padStart(12)} ${Math.floor(usedDisk/1024).toString().padStart(12)} ${Math.floor(freeDisk/1024).toString().padStart(12)}  ${usePct}% /`,
    human
      ? `tmpfs           ${formatSize(tmpTotal).padStart(4)}   ${formatSize(tmpUsed).padStart(4)}  ${formatSize(tmpFree).padStart(4)}   3% /tmp`
      : `tmpfs           ${Math.floor(tmpTotal/1024).toString().padStart(12)} ${Math.floor(tmpUsed/1024).toString().padStart(12)} ${Math.floor(tmpFree/1024).toString().padStart(12)}   3% /tmp`,
    human
      ? `tmpfs           ${formatSize(800*1024*1024).padStart(4)}      0  ${formatSize(800*1024*1024).padStart(4)}   0% /run`
      : `tmpfs           ${Math.floor(800*1024*1024/1024).toString().padStart(12)} ${0..toString().padStart(12)} ${Math.floor(800*1024*1024/1024).toString().padStart(12)}   0% /run`,
    human
      ? `/dev/sda2       512M   12M  500M   3% /boot/efi`
      : `/dev/sda2        ${512*1024} ${12*1024}  ${500*1024}   3% /boot/efi`,
  ];

  return [header, ...rows].join('\n');
}

export function du(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args, flags } = ctx;
  const human = flags.includes('h');
  const summarize = flags.includes('s');
  const maxDepth = flags.includes('d') ? 1 : undefined;

  const target = args.find(a => !a.startsWith('-')) || '.';
  const targetPath = target === '.' ? currentDirectory : resolvePath(currentDirectory, target);
  const node = getNodeAtPath(filesystem, targetPath);

  if (!node) return `du: cannot access '${target}': No such file or directory`;

  if (summarize) {
    const size = getFileSize(node);
    const displaySize = human ? formatSize(size) : Math.ceil(size / 1024).toString();
    return `${displaySize}\t${target}`;
  }

  const results: string[] = [];

  function calcSize(n: FSNode, path: string, depth: number): number {
    const size = getFileSize(n);
    const displaySize = human ? formatSize(size) : Math.ceil(size / 1024).toString();

    if (n.type === 'directory' && n.children) {
      Object.values(n.children).forEach(child => {
        if (maxDepth === undefined || depth < maxDepth) {
          calcSize(child, `${path}/${child.name}`, depth + 1);
        }
      });
    }

    results.push(`${displaySize}\t${path}`);
    return size;
  }

  calcSize(node, target, 0);
  return results.join('\n');
}

export function mount(ctx: CommandContext): string {
  const { args } = ctx;
  if (args.length === 0) {
    return `sysfs on /sys type sysfs (rw,nosuid,nodev,noexec,relatime)
proc on /proc type proc (rw,nosuid,nodev,noexec,relatime)
udev on /dev type devtmpfs (rw,nosuid,relatime,size=8196664k,nr_inodes=2049166,mode=755)
devpts on /dev/pts type devpts (rw,nosuid,noexec,relatime,gid=5,mode=620,ptmxmode=000)
tmpfs on /run type tmpfs (rw,nosuid,nodev,noexec,relatime,size=819200k,mode=755)
/dev/sda1 on / type ext4 (rw,relatime,errors=remount-ro)
securityfs on /sys/kernel/security type securityfs (rw,nosuid,nodev,noexec,relatime)
tmpfs on /dev/shm type tmpfs (rw,nosuid,nodev)
tmpfs on /run/lock type tmpfs (rw,nosuid,nodev,noexec,relatime,size=5120k)
cgroup2 on /sys/fs/cgroup type cgroup2 (rw,nosuid,nodev,noexec,relatime,nsdelegate,memory_recursiveprot)
pstore on /sys/fs/pstore type pstore (rw,nosuid,nodev,noexec,relatime)
/dev/sda2 on /boot/efi type vfat (rw,relatime,fmask=0077,dmask=0077,codepage=437,iocharset=iso8859-1,shortname=mixed,errors=remount-ro)
tmpfs on /tmp type tmpfs (rw,nosuid,nodev,size=2097152k)
tmpfs on /run/user/1000 type tmpfs (rw,nosuid,nodev,relatime,size=1638400k,nr_inodes=409600,mode=700,uid=1000,gid=1000)`;
  }
  return `mount: only root can do that`;
}

export function umount(ctx: CommandContext): string {
  const { args } = ctx;
  if (!args[0]) return 'umount: bad usage\nTry \'umount --help\' for more information.';
  return `umount: only root can do that`;
}

export function lsblk(ctx: CommandContext): string {
  const { flags } = ctx;
  const showFS = flags.includes('f');

  if (showFS) {
    return `NAME   FSTYPE FSVER LABEL UUID                                 FSAVAIL FSUSE% MOUNTPOINTS
sda
├─sda1 ext4   1.0         a1b2c3d4-e5f6-7890-abcd-ef1234567890     167G    35% /
└─sda2 vfat   FAT32       B2C3-D4E5                                 500M     3% /boot/efi
sr0`;
  }

  return `NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
sda      8:0    0   256G  0 disk
├─sda1   8:1    0 255.5G  0 part /
└─sda2   8:2    0   512M  0 part /boot/efi
sr0     11:0    1  1024M  0 rom`;
}

export function fdisk(ctx: CommandContext): string {
  const { flags } = ctx;
  if (flags.includes('l') || ctx.args.includes('-l')) {
    return `Disk /dev/sda: 256 GiB, 274877906944 bytes, 536870912 sectors
Disk model: SAMSUNG MZNLN256
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 4096 bytes
I/O size (minimum/optimal): 4096 bytes / 4096 bytes
Disklabel type: gpt
Disk identifier: 12345678-1234-1234-1234-123456789012

Device         Start       End   Sectors   Size Type
/dev/sda1       2048   2099199   2097152   1G Linux filesystem
/dev/sda2    2099200 535822335 533723136 254.5G Linux filesystem

Disk /dev/sdb: 32 GiB, 34359738368 bytes, 67108864 sectors
Disk model: USB Flash Drive
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0xabcdef01`;
  }
  return `fdisk: cannot open /dev/sda: Permission denied`;
}

export function free(ctx: CommandContext): string {
  const { flags } = ctx;
  const human = flags.includes('h');
  const mega = flags.includes('m');
  const giga = flags.includes('g');

  const totalRam = 16384;
  const usedRam = Math.floor(8200 + Math.random() * 500);
  const freeRam = totalRam - usedRam;
  const shared = 128;
  const buffers = 512;
  const cached = 2048;
  const available = freeRam + cached;
  const totalSwap = 4096;
  const usedSwap = 0;
  const freeSwap = totalSwap;

  if (human) {
    return `               total        used        free      shared  buff/cache   available
Mem:            16Gi       8.0Gi       7.5Gi       128Mi       2.5Gi       7.8Gi
Swap:          4.0Gi          0B       4.0Gi`;
  }

  if (mega) {
    return `               total        used        free      shared  buff/cache   available
Mem:           ${totalRam}        ${usedRam}        ${freeRam}         ${shared}        ${buffers + cached}        ${available}
Swap:           ${totalSwap}           ${usedSwap}        ${freeSwap}`;
  }

  // Default: KB
  return `               total        used        free      shared  buff/cache   available
Mem:        ${(totalRam * 1024).toString().padStart(12)} ${(usedRam * 1024).toString().padStart(12)} ${(freeRam * 1024).toString().padStart(12)} ${(shared * 1024).toString().padStart(12)} ${((buffers + cached) * 1024).toString().padStart(12)} ${(available * 1024).toString().padStart(12)}
Swap:       ${(totalSwap * 1024).toString().padStart(12)} ${(usedSwap * 1024).toString().padStart(12)} ${(freeSwap * 1024).toString().padStart(12)}`;
}

export function iostat(ctx: CommandContext): string {
  return `Linux 6.1.0-1parrot1-amd64 (parrot-os) \t03/29/2026 \t_x86_64_\t(8 CPU)

avg-cpu:  %user   %nice %system %iowait  %steal   %idle
           5.32    0.00    2.14    0.45    0.00   92.09

Device             tps    kB_read/s    kB_wrtn/s    kB_dscd/s    kB_read    kB_wrtn    kB_dscd
sda               3.21        48.32       124.56         0.00     987234    2548765          0
sdb               0.00         0.00         0.00         0.00          0          0          0`;
}

export function vmstat(ctx: CommandContext): string {
  const r = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);
  return `procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
 1  0      0 7543872 524288 2097152    0    0    ${r(1,50)}   ${r(50,200)} ${r(200,800)} ${r(500,2000)}  ${r(3,15)}  ${r(1,5)} ${r(75,95)}  ${r(0,3)}  0`;
}
