import { CommandContext } from './navigation';
import { getNodeAtPath, resolvePath, setNodeAtPath } from '@/lib/filesystem';

function applyChmod(permissions: string, mode: string): string {
  // Parse octal mode
  if (/^\d+$/.test(mode)) {
    const octal = parseInt(mode, 8);
    const types = 'rwxrwxrwx';
    let result = '';
    for (let i = 8; i >= 0; i--) {
      result += (octal >> i) & 1 ? types[8 - i] : '-';
    }
    const isDir = permissions.startsWith('d');
    return (isDir ? 'd' : '-') + result;
  }

  // Parse symbolic mode (e.g., u+x, g-w, o=r, a+x)
  const typeChar = permissions.startsWith('d') ? 'd' : '-';
  let perms = permissions.slice(1);
  const chars = perms.split('');

  const modeRegex = /([ugoa]*)([+\-=])([rwx]*)/g;
  let match;
  while ((match = modeRegex.exec(mode)) !== null) {
    const [, who, op, rights] = match;
    const targets = who === '' || who === 'a' ? [0, 1, 2, 3, 4, 5, 6, 7, 8] :
      who.split('').flatMap(c => c === 'u' ? [0,1,2] : c === 'g' ? [3,4,5] : [6,7,8]);

    const rwxMap: Record<string, number[]> = { r: [0,3,6], w: [1,4,7], x: [2,5,8] };
    const indices = rights.split('').flatMap(r => rwxMap[r] || []);

    if (op === '+') {
      indices.filter(i => targets.includes(i)).forEach(i => { chars[i] = 'rwxrwxrwx'[i]; });
    } else if (op === '-') {
      indices.filter(i => targets.includes(i)).forEach(i => { chars[i] = '-'; });
    } else if (op === '=') {
      targets.forEach(i => { chars[i] = indices.includes(i) ? 'rwxrwxrwx'[i] : '-'; });
    }
  }

  return typeChar + chars.join('');
}

export function chmod(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args, flags, updateFilesystem } = ctx;
  const recursive = flags.includes('R') || flags.includes('r');

  const nonFlagArgs = args.filter(a => !a.startsWith('-'));
  if (nonFlagArgs.length < 2) return 'chmod: missing operand\nTry \'chmod --help\' for more information.';

  const mode = nonFlagArgs[0];
  const fileArgs = nonFlagArgs.slice(1);

  let currentFs = filesystem;

  for (const fileArg of fileArgs) {
    const path = resolvePath(currentDirectory, fileArg);
    const node = getNodeAtPath(currentFs, path);
    if (!node) {
      return `chmod: cannot access '${fileArg}': No such file or directory`;
    }

    const newPerms = applyChmod(node.permissions || (node.type === 'directory' ? 'drwxr-xr-x' : '-rw-r--r--'), mode);
    const updated = { ...node, permissions: newPerms };
    currentFs = setNodeAtPath(currentFs, path, updated);

    if (recursive && node.type === 'directory' && node.children) {
      const applyRecursive = (n: typeof node, p: string) => {
        if (!n.children) return;
        Object.values(n.children).forEach(child => {
          const childPath = `${p}/${child.name}`;
          const childPerms = applyChmod(child.permissions || (child.type === 'directory' ? 'drwxr-xr-x' : '-rw-r--r--'), mode);
          const updatedChild = { ...child, permissions: childPerms };
          currentFs = setNodeAtPath(currentFs, childPath, updatedChild);
          if (child.type === 'directory') applyRecursive(child, childPath);
        });
      };
      applyRecursive(node, path);
    }
  }

  ctx.updateFilesystem(currentFs);
  return '';
}

export function chown(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args, flags, updateFilesystem } = ctx;
  const recursive = flags.includes('R');
  const nonFlagArgs = args.filter(a => !a.startsWith('-'));

  if (nonFlagArgs.length < 2) return 'chown: missing operand\nTry \'chown --help\' for more information.';

  const ownerSpec = nonFlagArgs[0];
  const fileArgs = nonFlagArgs.slice(1);

  const [newOwner, newGroup] = ownerSpec.includes(':') ? ownerSpec.split(':') : [ownerSpec, undefined];

  let currentFs = filesystem;

  for (const fileArg of fileArgs) {
    const path = resolvePath(currentDirectory, fileArg);
    const node = getNodeAtPath(currentFs, path);
    if (!node) return `chown: cannot access '${fileArg}': No such file or directory`;

    const updated = {
      ...node,
      owner: newOwner || node.owner,
      group: newGroup !== undefined ? newGroup : node.group,
    };
    currentFs = setNodeAtPath(currentFs, path, updated);
  }

  updateFilesystem(currentFs);
  return '';
}

export function chgrp(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args, updateFilesystem } = ctx;
  const nonFlagArgs = args.filter(a => !a.startsWith('-'));

  if (nonFlagArgs.length < 2) return 'chgrp: missing operand';

  const newGroup = nonFlagArgs[0];
  const fileArgs = nonFlagArgs.slice(1);

  let currentFs = filesystem;

  for (const fileArg of fileArgs) {
    const path = resolvePath(currentDirectory, fileArg);
    const node = getNodeAtPath(currentFs, path);
    if (!node) return `chgrp: cannot access '${fileArg}': No such file or directory`;

    const updated = { ...node, group: newGroup };
    currentFs = setNodeAtPath(currentFs, path, updated);
  }

  updateFilesystem(currentFs);
  return '';
}

export function sudo(ctx: CommandContext): string {
  const { args } = ctx;
  if (!args[0]) return 'usage: sudo [-AbEHknPS] [-r role] [-t type] [-C num] [-g group] [-u user] [VAR=value] [-i|-s] [<command>]';

  if (args[0] === '-i' || args[0] === 'su') {
    return `root@parrot-os:/home/parrot# (Simulated root shell - type 'exit' to return)`;
  }

  // Pass through to the actual command
  const subCmd = args[0];
  const subArgs = args.slice(1);
  return `[sudo] password for parrot: \n(Simulated: running '${[subCmd, ...subArgs].join(' ')}' with elevated privileges)`;
}

export function su(ctx: CommandContext): string {
  const { args } = ctx;
  const user = args[0] || 'root';
  if (user === 'root') {
    return `Password: \nroot@parrot-os:/home/parrot# (Simulated root shell)`;
  }
  return `Password: \nsu: Authentication failure`;
}

export function passwd(ctx: CommandContext): string {
  return `Changing password for parrot.
Current password:
New password:
Retype new password:
passwd: password updated successfully`;
}

export function umask(ctx: CommandContext): string {
  const { args } = ctx;
  if (args[0]) {
    return '';  // Set umask (simulated)
  }
  return '0022';
}

export function groups(ctx: CommandContext): string {
  const { args } = ctx;
  const user = args[0] || 'parrot';
  if (user === 'root') return 'root';
  return 'parrot adm cdrom sudo dip plugdev lpadmin lxd sambashare';
}

export function newgrp(ctx: CommandContext): string {
  return '(newgrp: group switching not supported in simulator)';
}

export function visudo(): string {
  return `(visudo: Opening /etc/sudoers in editor - simulated)
# This file MUST be edited with the 'visudo' command as root.
#
# Please consider adding local content in /etc/sudoers.d/ instead of
# directly modifying this file.

Defaults        env_reset
Defaults        mail_badpass
Defaults        secure_path="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
Defaults        use_pty

# User privilege specification
root    ALL=(ALL:ALL) ALL

# Allow members of group sudo to execute any command
%sudo   ALL=(ALL:ALL) ALL

# See sudoers(5) for more information on "@include" directives:
@includedir /etc/sudoers.d`;
}
