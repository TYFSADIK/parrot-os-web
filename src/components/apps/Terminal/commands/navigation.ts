import {
  FSNode,
  getNodeAtPath,
  resolvePath,
  normalizePath,
  listDirectory,
  getPermissionString,
  getFileSize,
  formatSize,
} from '@/lib/filesystem';

export interface CommandContext {
  filesystem: FSNode;
  currentDirectory: string;
  setCurrentDirectory: (dir: string) => void;
  updateFilesystem: (fs: FSNode) => void;
  args: string[];
  flags: string[];
  rawArgs: string;
}

function formatDate(dateStr?: string): string {
  if (dateStr) return dateStr;
  const now = new Date();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[now.getMonth()]} ${now.getDate().toString().padStart(2,' ')} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
}

function getDisplayName(node: FSNode): string {
  if (node.type === 'directory') return node.name + '/';
  return node.name;
}

export function pwd(ctx: CommandContext): string {
  return ctx.currentDirectory;
}

export function ls(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args, flags } = ctx;
  const showHidden = flags.includes('a') || flags.includes('A');
  const longFormat = flags.includes('l');
  const humanReadable = flags.includes('h');

  const targetPath = args[0] ? resolvePath(currentDirectory, args[0]) : currentDirectory;
  const node = getNodeAtPath(filesystem, targetPath);

  if (!node) {
    return `ls: cannot access '${args[0] || targetPath}': No such file or directory`;
  }

  if (node.type === 'file') {
    if (longFormat) {
      const size = getFileSize(node);
      const sizeStr = humanReadable ? formatSize(size) : size.toString();
      return `${getPermissionString(node)} 1 ${node.owner || 'parrot'} ${node.group || 'parrot'} ${sizeStr.padStart(8)} ${formatDate(node.modified)} ${node.name}`;
    }
    return node.name;
  }

  const children = listDirectory(node);
  let items = showHidden
    ? children
    : children.filter((c) => !c.name.startsWith('.'));

  if (!showHidden && flags.includes('A')) {
    items = children.filter((c) => c.name !== '.' && c.name !== '..');
  }

  // Sort: directories first, then files, alphabetically
  items.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  if (!longFormat) {
    if (items.length === 0) return '';
    const names = items.map((item) => {
      if (item.type === 'directory') return `\x1b[34m${item.name}\x1b[0m`;
      if (item.name.endsWith('.sh')) return `\x1b[32m${item.name}\x1b[0m`;
      return item.name;
    });
    return names.join('  ');
  }

  // Long format
  const lines: string[] = [];
  let totalBlocks = 0;

  if (showHidden) {
    const curSize = 4096;
    totalBlocks += Math.ceil(curSize / 512);
  }

  items.forEach((item) => {
    const size = getFileSize(item);
    totalBlocks += Math.ceil(size / 512);
  });

  lines.push(`total ${totalBlocks}`);

  if (showHidden) {
    const parentNode = getNodeAtPath(filesystem, normalizePath(targetPath + '/..'));
    const curPerm = node.permissions || 'drwxr-xr-x';
    lines.push(`${curPerm} 2 ${node.owner || 'parrot'} ${node.group || 'parrot'}  ${humanReadable ? '4.0K' : '4096'} ${formatDate(node.modified)} .`);
    lines.push(`${parentNode?.permissions || 'drwxr-xr-x'} 3 ${parentNode?.owner || 'root'} ${parentNode?.group || 'root'}  ${humanReadable ? '4.0K' : '4096'} ${formatDate(parentNode?.modified)} ..`);
  }

  items.forEach((item) => {
    const perm = getPermissionString(item);
    const size = getFileSize(item);
    const sizeStr = humanReadable ? formatSize(size).padStart(5) : size.toString().padStart(8);
    const links = item.type === 'directory' ? '2' : '1';
    const owner = (item.owner || 'parrot').padEnd(8);
    const group = (item.group || 'parrot').padEnd(8);
    const date = formatDate(item.modified);
    const displayName = item.type === 'directory'
      ? `\x1b[34m${item.name}\x1b[0m`
      : item.name.endsWith('.sh')
      ? `\x1b[32m${item.name}\x1b[0m`
      : item.name;
    lines.push(`${perm} ${links} ${owner} ${group} ${sizeStr} ${date} ${displayName}`);
  });

  return lines.join('\n');
}

export function cd(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args, setCurrentDirectory } = ctx;

  let targetPath: string;
  if (!args[0] || args[0] === '~') {
    targetPath = '/home/parrot';
  } else if (args[0] === '-') {
    return 'cd: OLDPWD not set';
  } else {
    targetPath = resolvePath(currentDirectory, args[0]);
  }

  const node = getNodeAtPath(filesystem, targetPath);
  if (!node) {
    return `bash: cd: ${args[0]}: No such file or directory`;
  }
  if (node.type !== 'directory') {
    return `bash: cd: ${args[0]}: Not a directory`;
  }

  setCurrentDirectory(targetPath);
  return '';
}

export function mkdir(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args, flags, updateFilesystem } = ctx;
  if (!args[0]) return 'mkdir: missing operand';

  const makeParents = flags.includes('p');
  const results: string[] = [];

  for (const arg of args) {
    const targetPath = resolvePath(currentDirectory, arg);
    const parts = targetPath.split('/').filter(Boolean);

    if (makeParents) {
      let current = filesystem;
      let currentPath = '';
      for (const part of parts) {
        currentPath += '/' + part;
        const existing = getNodeAtPath(current, currentPath);
        if (!existing) {
          const { setNodeAtPath } = require('@/lib/filesystem');
          const newNode: FSNode = {
            type: 'directory',
            name: part,
            permissions: 'drwxr-xr-x',
            owner: 'parrot',
            group: 'parrot',
            modified: formatDate(),
            children: {},
          };
          // We'll handle this below
        }
      }
    }

    const existing = getNodeAtPath(filesystem, targetPath);
    if (existing) {
      if (!makeParents) {
        results.push(`mkdir: cannot create directory '${arg}': File exists`);
      }
      continue;
    }

    const parentPath = targetPath.substring(0, targetPath.lastIndexOf('/')) || '/';
    const parentNode = getNodeAtPath(filesystem, parentPath);
    if (!parentNode && !makeParents) {
      results.push(`mkdir: cannot create directory '${arg}': No such file or directory`);
      continue;
    }

    const dirName = parts[parts.length - 1];
    const newNode: FSNode = {
      type: 'directory',
      name: dirName,
      permissions: 'drwxr-xr-x',
      owner: 'parrot',
      group: 'parrot',
      modified: formatDate(),
      children: {},
    };

    const { setNodeAtPath } = require('@/lib/filesystem');
    const newFs = setNodeAtPath(filesystem, targetPath, newNode);
    ctx.updateFilesystem(newFs);
  }

  return results.join('\n');
}

export function rmdir(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args, updateFilesystem } = ctx;
  if (!args[0]) return 'rmdir: missing operand';

  const results: string[] = [];
  let currentFs = filesystem;

  for (const arg of args) {
    const targetPath = resolvePath(currentDirectory, arg);
    const node = getNodeAtPath(currentFs, targetPath);

    if (!node) {
      results.push(`rmdir: failed to remove '${arg}': No such file or directory`);
      continue;
    }
    if (node.type !== 'directory') {
      results.push(`rmdir: failed to remove '${arg}': Not a directory`);
      continue;
    }
    if (node.children && Object.keys(node.children).length > 0) {
      results.push(`rmdir: failed to remove '${arg}': Directory not empty`);
      continue;
    }

    const { deleteNodeAtPath } = require('@/lib/filesystem');
    currentFs = deleteNodeAtPath(currentFs, targetPath);
  }

  updateFilesystem(currentFs);
  return results.join('\n');
}

export function tree(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args } = ctx;
  const targetPath = args[0] ? resolvePath(currentDirectory, args[0]) : currentDirectory;
  const node = getNodeAtPath(filesystem, targetPath);

  if (!node) return `tree: '${args[0] || targetPath}': No such file or directory`;

  const lines: string[] = [targetPath === '/' ? '/' : node.name];

  function buildTree(n: FSNode, prefix: string) {
    if (!n.children) return;
    const children = Object.values(n.children).filter(c => !c.name.startsWith('.'));
    children.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

    children.forEach((child, idx) => {
      const isLast = idx === children.length - 1;
      const connector = isLast ? '└── ' : '├── ';
      const newPrefix = prefix + (isLast ? '    ' : '│   ');
      lines.push(prefix + connector + (child.type === 'directory' ? child.name + '/' : child.name));
      if (child.type === 'directory') {
        buildTree(child, newPrefix);
      }
    });
  }

  buildTree(node, '');

  let dirs = 0, files = 0;
  function count(n: FSNode) {
    if (!n.children) return;
    Object.values(n.children).forEach(c => {
      if (c.type === 'directory') { dirs++; count(c); }
      else files++;
    });
  }
  count(node);

  lines.push('');
  lines.push(`${dirs} directories, ${files} files`);
  return lines.join('\n');
}

export function find_cmd(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args } = ctx;

  let startPath = '.';
  const options: string[] = [];

  let i = 0;
  if (args[0] && !args[0].startsWith('-')) {
    startPath = args[0];
    i = 1;
  }

  while (i < args.length) {
    options.push(args[i]);
    i++;
  }

  const resolvedStart = resolvePath(currentDirectory, startPath);
  const startNode = getNodeAtPath(filesystem, resolvedStart);
  if (!startNode) return `find: '${startPath}': No such file or directory`;

  // Parse options
  let namePattern: string | null = null;
  let typeFilter: string | null = null;
  let sizeFilter: string | null = null;
  let maxDepth: number = Infinity;

  for (let j = 0; j < options.length; j++) {
    if (options[j] === '-name' && options[j+1]) {
      namePattern = options[++j];
    } else if (options[j] === '-type' && options[j+1]) {
      typeFilter = options[++j];
    } else if (options[j] === '-size' && options[j+1]) {
      sizeFilter = options[++j];
    } else if (options[j] === '-maxdepth' && options[j+1]) {
      maxDepth = parseInt(options[++j]);
    }
  }

  const results: string[] = [];

  function matchPattern(name: string, pattern: string): boolean {
    const regexStr = pattern
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');
    return new RegExp('^' + regexStr + '$').test(name);
  }

  function search(node: FSNode, path: string, depth: number) {
    if (depth > maxDepth) return;

    const matches =
      (!namePattern || matchPattern(node.name, namePattern)) &&
      (!typeFilter ||
        (typeFilter === 'f' && node.type === 'file') ||
        (typeFilter === 'd' && node.type === 'directory') ||
        (typeFilter === 'l' && false));

    if (matches) results.push(path);

    if (node.type === 'directory' && node.children) {
      Object.values(node.children).forEach((child) => {
        search(child, `${path}/${child.name}`.replace('//', '/'), depth + 1);
      });
    }
  }

  search(startNode, resolvedStart, 0);
  return results.length > 0 ? results.join('\n') : '';
}

export function locate(ctx: CommandContext): string {
  const { filesystem, args } = ctx;
  if (!args[0]) return 'Usage: locate PATTERN';

  const pattern = args[0].toLowerCase();
  const results: string[] = [];

  function search(node: FSNode, path: string) {
    if (node.name.toLowerCase().includes(pattern)) {
      results.push(path);
    }
    if (node.children) {
      Object.values(node.children).forEach(child =>
        search(child, `${path}/${child.name}`.replace('//', '/'))
      );
    }
  }

  search(filesystem, '/');
  if (results.length === 0) return '';
  return results.join('\n');
}
