import { FSNode, getNodeAtPath, resolvePath, setNodeAtPath, deleteNodeAtPath, getFileSize, formatSize, deepClone } from '@/lib/filesystem';
import { CommandContext } from './navigation';

function formatDate(): string {
  const now = new Date();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[now.getMonth()]} ${now.getDate().toString().padStart(2,' ')} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
}

export function cat(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args, flags } = ctx;
  if (!args[0]) return 'cat: missing operand\nTry \'cat --help\' for more information.';

  const showNumbers = flags.includes('n') || flags.includes('A');
  const results: string[] = [];

  for (const arg of args) {
    const path = resolvePath(currentDirectory, arg);
    const node = getNodeAtPath(filesystem, path);
    if (!node) {
      results.push(`cat: ${arg}: No such file or directory`);
      continue;
    }
    if (node.type === 'directory') {
      results.push(`cat: ${arg}: Is a directory`);
      continue;
    }
    const content = node.content || '';
    if (showNumbers) {
      content.split('\n').forEach((line, i) => {
        results.push(`${(i + 1).toString().padStart(6)}\t${line}`);
      });
    } else {
      results.push(content);
    }
  }

  return results.join('\n');
}

export function head(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args, flags } = ctx;
  if (!args[0]) return 'head: missing operand';

  let lines = 10;
  const nFlag = flags.find(f => f.startsWith('n'));
  if (nFlag) {
    const num = parseInt(nFlag.replace('n', ''));
    if (!isNaN(num)) lines = num;
  }

  // Check for -n <number> form
  const nIndex = args.indexOf('-n');
  let fileArgs = args;
  if (nIndex !== -1 && args[nIndex + 1]) {
    lines = parseInt(args[nIndex + 1]) || 10;
    fileArgs = args.filter((_, i) => i !== nIndex && i !== nIndex + 1);
  } else {
    fileArgs = args.filter(a => !a.startsWith('-'));
  }

  const results: string[] = [];
  for (const arg of fileArgs) {
    const path = resolvePath(currentDirectory, arg);
    const node = getNodeAtPath(filesystem, path);
    if (!node) { results.push(`head: cannot open '${arg}' for reading: No such file or directory`); continue; }
    if (node.type === 'directory') { results.push(`head: error reading '${arg}': Is a directory`); continue; }
    const content = (node.content || '').split('\n').slice(0, lines).join('\n');
    if (fileArgs.length > 1) results.push(`==> ${arg} <==`);
    results.push(content);
  }
  return results.join('\n');
}

export function tail(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args, flags } = ctx;
  if (!args[0]) return 'tail: missing operand';

  let lines = 10;
  const nIndex = args.indexOf('-n');
  let fileArgs = args;
  if (nIndex !== -1 && args[nIndex + 1]) {
    lines = parseInt(args[nIndex + 1]) || 10;
    fileArgs = args.filter((_, i) => i !== nIndex && i !== nIndex + 1);
  } else {
    fileArgs = args.filter(a => !a.startsWith('-'));
  }

  const results: string[] = [];
  for (const arg of fileArgs) {
    const path = resolvePath(currentDirectory, arg);
    const node = getNodeAtPath(filesystem, path);
    if (!node) { results.push(`tail: cannot open '${arg}' for reading: No such file or directory`); continue; }
    if (node.type === 'directory') { results.push(`tail: error reading '${arg}': Is a directory`); continue; }
    const allLines = (node.content || '').split('\n');
    const content = allLines.slice(-lines).join('\n');
    if (fileArgs.length > 1) results.push(`==> ${arg} <==`);
    results.push(content);
  }
  return results.join('\n');
}

export function touch(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args, updateFilesystem } = ctx;
  if (!args[0]) return 'touch: missing file operand';

  let currentFs = filesystem;
  for (const arg of args) {
    const path = resolvePath(currentDirectory, arg);
    const existing = getNodeAtPath(currentFs, path);
    if (existing) {
      // Update timestamp only
      const updated = { ...existing, modified: formatDate() };
      currentFs = setNodeAtPath(currentFs, path, updated);
    } else {
      const parts = path.split('/').filter(Boolean);
      const name = parts[parts.length - 1];
      const parentPath = '/' + parts.slice(0, -1).join('/');
      const parent = getNodeAtPath(currentFs, parentPath);
      if (!parent || parent.type !== 'directory') {
        return `touch: cannot touch '${arg}': No such file or directory`;
      }
      const newNode: FSNode = {
        type: 'file',
        name,
        permissions: '-rw-r--r--',
        owner: 'parrot',
        group: 'parrot',
        modified: formatDate(),
        content: '',
      };
      currentFs = setNodeAtPath(currentFs, path, newNode);
    }
  }
  updateFilesystem(currentFs);
  return '';
}

export function cp(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args, flags, updateFilesystem } = ctx;
  if (args.length < 2) return 'cp: missing destination file operand';

  const recursive = flags.includes('r') || flags.includes('R');
  const fileArgs = args.filter(a => !a.startsWith('-'));
  if (fileArgs.length < 2) return 'cp: missing destination file operand';

  const dst = fileArgs[fileArgs.length - 1];
  const srcs = fileArgs.slice(0, -1);
  const dstPath = resolvePath(currentDirectory, dst);
  const dstNode = getNodeAtPath(filesystem, dstPath);

  let currentFs = filesystem;

  for (const src of srcs) {
    const srcPath = resolvePath(currentDirectory, src);
    const srcNode = getNodeAtPath(currentFs, srcPath);
    if (!srcNode) return `cp: cannot stat '${src}': No such file or directory`;
    if (srcNode.type === 'directory' && !recursive) {
      return `cp: -r not specified; omitting directory '${src}'`;
    }

    let targetPath: string;
    if (dstNode && dstNode.type === 'directory') {
      targetPath = dstPath + '/' + srcNode.name;
    } else {
      targetPath = dstPath;
    }

    const clone = deepClone(srcNode);
    clone.name = targetPath.split('/').pop() || clone.name;
    clone.modified = formatDate();
    currentFs = setNodeAtPath(currentFs, targetPath, clone);
  }

  updateFilesystem(currentFs);
  return '';
}

export function mv(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args, updateFilesystem } = ctx;
  const fileArgs = args.filter(a => !a.startsWith('-'));
  if (fileArgs.length < 2) return 'mv: missing destination file operand';

  const dst = fileArgs[fileArgs.length - 1];
  const srcs = fileArgs.slice(0, -1);
  const dstPath = resolvePath(currentDirectory, dst);
  const dstNode = getNodeAtPath(filesystem, dstPath);

  let currentFs = filesystem;

  for (const src of srcs) {
    const srcPath = resolvePath(currentDirectory, src);
    const srcNode = getNodeAtPath(currentFs, srcPath);
    if (!srcNode) return `mv: cannot stat '${src}': No such file or directory`;

    let targetPath: string;
    if (dstNode && dstNode.type === 'directory') {
      targetPath = dstPath + '/' + srcNode.name;
    } else {
      targetPath = dstPath;
    }

    const clone = deepClone(srcNode);
    clone.name = targetPath.split('/').pop() || clone.name;
    clone.modified = formatDate();
    currentFs = setNodeAtPath(currentFs, targetPath, clone);
    currentFs = deleteNodeAtPath(currentFs, srcPath);
  }

  updateFilesystem(currentFs);
  return '';
}

export function rm(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args, flags, updateFilesystem } = ctx;
  const recursive = flags.includes('r') || flags.includes('R') || flags.includes('rf') || flags.includes('fr');
  const force = flags.includes('f') || flags.includes('rf') || flags.includes('fr');
  const fileArgs = args.filter(a => !a.startsWith('-'));

  if (fileArgs.length === 0) {
    if (force) return '';
    return 'rm: missing operand';
  }

  let currentFs = filesystem;
  const errors: string[] = [];

  for (const arg of fileArgs) {
    const path = resolvePath(currentDirectory, arg);
    const node = getNodeAtPath(currentFs, path);

    if (!node) {
      if (!force) errors.push(`rm: cannot remove '${arg}': No such file or directory`);
      continue;
    }

    if (node.type === 'directory') {
      if (!recursive) {
        errors.push(`rm: cannot remove '${arg}': Is a directory`);
        continue;
      }
    }

    if (path === '/' || path === '/home' || path === '/home/parrot' || path === '/etc' || path === '/var') {
      errors.push(`rm: cannot remove '${arg}': Permission denied`);
      continue;
    }

    currentFs = deleteNodeAtPath(currentFs, path);
  }

  updateFilesystem(currentFs);
  return errors.join('\n');
}

export function grep(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args, flags } = ctx;
  const caseInsensitive = flags.includes('i');
  const showLineNumbers = flags.includes('n');
  const recursive = flags.includes('r') || flags.includes('R');
  const invertMatch = flags.includes('v');
  const countOnly = flags.includes('c');
  const showFilename = flags.includes('l');

  const nonFlagArgs = args.filter(a => !a.startsWith('-'));
  if (nonFlagArgs.length === 0) return 'Usage: grep [OPTION]... PATTERN [FILE]...';

  const pattern = nonFlagArgs[0];
  const files = nonFlagArgs.slice(1);

  if (files.length === 0) return `grep: missing file operand after '${pattern}'`;

  let regex: RegExp;
  try {
    regex = new RegExp(pattern, caseInsensitive ? 'i' : '');
  } catch {
    return `grep: invalid regular expression '${pattern}'`;
  }

  const results: string[] = [];

  function grepFile(node: FSNode, displayPath: string) {
    if (node.type === 'directory') return;
    const content = node.content || '';
    const lines = content.split('\n');
    let count = 0;
    const matched: string[] = [];

    lines.forEach((line, idx) => {
      const matches = regex.test(line);
      const shouldShow = invertMatch ? !matches : matches;
      if (shouldShow) {
        count++;
        if (showLineNumbers) {
          matched.push(`${displayPath}:${idx + 1}:${line}`);
        } else {
          matched.push(`${displayPath}:${line}`);
        }
      }
    });

    if (countOnly) {
      results.push(`${displayPath}:${count}`);
    } else if (showFilename) {
      if (count > 0) results.push(displayPath);
    } else {
      matched.forEach(m => results.push(m));
    }
  }

  function grepDir(node: FSNode, basePath: string) {
    if (!node.children) return;
    Object.values(node.children).forEach(child => {
      const childPath = `${basePath}/${child.name}`;
      if (child.type === 'directory') {
        grepDir(child, childPath);
      } else {
        grepFile(child, childPath);
      }
    });
  }

  const multiFile = files.length > 1 || recursive;

  for (const file of files) {
    const path = resolvePath(currentDirectory, file);
    const node = getNodeAtPath(filesystem, path);

    if (!node) {
      results.push(`grep: ${file}: No such file or directory`);
      continue;
    }

    if (node.type === 'directory') {
      if (recursive) {
        grepDir(node, path);
      } else {
        results.push(`grep: ${file}: Is a directory`);
      }
      continue;
    }

    const displayPath = multiFile ? file : '';
    const content = node.content || '';
    const lines = content.split('\n');
    let count = 0;
    const matched: string[] = [];

    lines.forEach((line, idx) => {
      const matches = regex.test(line);
      const shouldShow = invertMatch ? !matches : matches;
      if (shouldShow) {
        count++;
        const prefix = displayPath ? `${displayPath}:` : '';
        const linePrefix = showLineNumbers ? `${idx + 1}:` : '';
        matched.push(`${prefix}${linePrefix}${line}`);
      }
    });

    if (countOnly) {
      results.push(`${displayPath ? displayPath + ':' : ''}${count}`);
    } else if (showFilename) {
      if (count > 0) results.push(displayPath || file);
    } else {
      matched.forEach(m => results.push(m));
    }
  }

  return results.join('\n');
}

export function less(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args } = ctx;
  if (!args[0]) return 'What file do you want to view? Usage: less <file>';
  const path = resolvePath(currentDirectory, args[0]);
  const node = getNodeAtPath(filesystem, path);
  if (!node) return `less: ${args[0]}: No such file or directory`;
  if (node.type === 'directory') return `less: ${args[0]}: Is a directory`;
  return node.content || '(empty file)';
}

export function wc(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args, flags } = ctx;
  const fileArgs = args.filter(a => !a.startsWith('-'));
  if (fileArgs.length === 0) return 'wc: missing operand';

  const showLines = flags.includes('l') || flags.length === 0;
  const showWords = flags.includes('w') || flags.length === 0;
  const showChars = flags.includes('c') || flags.includes('m') || flags.length === 0;

  const results: string[] = [];
  let totalLines = 0, totalWords = 0, totalChars = 0;

  for (const file of fileArgs) {
    const path = resolvePath(currentDirectory, file);
    const node = getNodeAtPath(filesystem, path);
    if (!node) { results.push(`wc: ${file}: No such file or directory`); continue; }
    if (node.type === 'directory') { results.push(`wc: ${file}: Is a directory`); continue; }
    const content = node.content || '';
    const lines = content.split('\n').length;
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const chars = content.length;
    totalLines += lines; totalWords += words; totalChars += chars;
    const parts: string[] = [];
    if (showLines) parts.push(lines.toString().padStart(7));
    if (showWords) parts.push(words.toString().padStart(7));
    if (showChars) parts.push(chars.toString().padStart(7));
    results.push(`${parts.join('')} ${file}`);
  }

  if (fileArgs.length > 1) {
    const parts: string[] = [];
    if (showLines) parts.push(totalLines.toString().padStart(7));
    if (showWords) parts.push(totalWords.toString().padStart(7));
    if (showChars) parts.push(totalChars.toString().padStart(7));
    results.push(`${parts.join('')} total`);
  }

  return results.join('\n');
}

export function diff(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args } = ctx;
  if (args.length < 2) return 'diff: missing operand after diff\nUsage: diff FILE1 FILE2';

  const fileArgs = args.filter(a => !a.startsWith('-'));
  if (fileArgs.length < 2) return 'Usage: diff FILE1 FILE2';

  const path1 = resolvePath(currentDirectory, fileArgs[0]);
  const path2 = resolvePath(currentDirectory, fileArgs[1]);
  const node1 = getNodeAtPath(filesystem, path1);
  const node2 = getNodeAtPath(filesystem, path2);

  if (!node1) return `diff: ${fileArgs[0]}: No such file or directory`;
  if (!node2) return `diff: ${fileArgs[1]}: No such file or directory`;

  const lines1 = (node1.content || '').split('\n');
  const lines2 = (node2.content || '').split('\n');

  if (lines1.join('\n') === lines2.join('\n')) return '';

  const results: string[] = [];
  const maxLen = Math.max(lines1.length, lines2.length);

  for (let i = 0; i < maxLen; i++) {
    if (lines1[i] !== lines2[i]) {
      if (lines1[i] !== undefined) results.push(`${i + 1}c${i + 1}`);
      if (lines1[i] !== undefined) results.push(`< ${lines1[i]}`);
      results.push('---');
      if (lines2[i] !== undefined) results.push(`> ${lines2[i]}`);
    }
  }

  return results.join('\n');
}

export function sort(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args, flags } = ctx;
  const fileArgs = args.filter(a => !a.startsWith('-'));
  const reverse = flags.includes('r');
  const numeric = flags.includes('n');
  const unique = flags.includes('u');

  if (fileArgs.length === 0) return 'sort: reading standard input is not supported in this simulator';

  const results: string[] = [];
  for (const file of fileArgs) {
    const path = resolvePath(currentDirectory, file);
    const node = getNodeAtPath(filesystem, path);
    if (!node) { results.push(`sort: cannot read: ${file}: No such file or directory`); continue; }
    if (node.type === 'directory') { results.push(`sort: read error: Is a directory`); continue; }
    let lines = (node.content || '').split('\n');
    if (unique) lines = Array.from(new Set(lines));
    lines.sort((a, b) => {
      if (numeric) return parseFloat(a) - parseFloat(b);
      return a.localeCompare(b);
    });
    if (reverse) lines.reverse();
    results.push(lines.join('\n'));
  }
  return results.join('\n');
}

export function uniq(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args, flags } = ctx;
  const fileArgs = args.filter(a => !a.startsWith('-'));
  const countDups = flags.includes('c');
  const onlyDups = flags.includes('d');
  const onlyUniq = flags.includes('u');

  if (fileArgs.length === 0) return 'uniq: reading standard input is not supported';

  const path = resolvePath(currentDirectory, fileArgs[0]);
  const node = getNodeAtPath(filesystem, path);
  if (!node) return `uniq: ${fileArgs[0]}: No such file or directory`;
  if (node.type === 'directory') return `uniq: ${fileArgs[0]}: Is a directory`;

  const lines = (node.content || '').split('\n');
  const results: string[] = [];
  let i = 0;

  while (i < lines.length) {
    let count = 1;
    while (i + count < lines.length && lines[i + count] === lines[i]) count++;

    if (onlyDups && count === 1) { i += count; continue; }
    if (onlyUniq && count > 1) { i += count; continue; }

    if (countDups) {
      results.push(`${count.toString().padStart(7)} ${lines[i]}`);
    } else {
      results.push(lines[i]);
    }
    i += count;
  }

  return results.join('\n');
}

export function file_cmd(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args } = ctx;
  const fileArgs = args.filter(a => !a.startsWith('-'));
  if (fileArgs.length === 0) return 'file: missing operand';

  const results: string[] = [];
  for (const arg of fileArgs) {
    const path = resolvePath(currentDirectory, arg);
    const node = getNodeAtPath(filesystem, path);
    if (!node) { results.push(`file: '${arg}': cannot open (No such file or directory)`); continue; }
    if (node.type === 'directory') { results.push(`${arg}: directory`); continue; }
    const content = node.content || '';
    let type = 'ASCII text';
    if (arg.endsWith('.sh')) type = 'Bourne-Again shell script, ASCII text executable';
    else if (arg.endsWith('.py')) type = 'Python script, ASCII text executable';
    else if (arg.endsWith('.md')) type = 'ASCII text';
    else if (arg.endsWith('.tar.gz')) type = 'gzip compressed data, from Unix';
    else if (arg.endsWith('.zip')) type = 'Zip archive data';
    else if (!content) type = 'empty';
    results.push(`${arg}: ${type}`);
  }
  return results.join('\n');
}

export function stat(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args } = ctx;
  const fileArgs = args.filter(a => !a.startsWith('-'));
  if (fileArgs.length === 0) return 'stat: missing operand';

  const results: string[] = [];
  for (const arg of fileArgs) {
    const path = resolvePath(currentDirectory, arg);
    const node = getNodeAtPath(filesystem, path);
    if (!node) { results.push(`stat: cannot statx '${arg}': No such file or directory`); continue; }
    const size = getFileSize(node);
    const inode = Math.floor(Math.random() * 900000) + 100000;
    results.push(`  File: ${arg}
  Size: ${size}\tBlocks: ${Math.ceil(size/512)}\tIO Block: 4096\t${node.type === 'directory' ? 'directory' : 'regular file'}
Device: 8,1\tInode: ${inode}\tLinks: ${node.type === 'directory' ? 2 : 1}
Access: ${node.permissions || (node.type === 'directory' ? 'drwxr-xr-x' : '-rw-r--r--')} Uid: ( 1000/  parrot)   Gid: ( 1000/  parrot)
Access: 2026-03-29 10:00:00.000000000 +0000
Modify: 2026-03-29 10:00:00.000000000 +0000
Change: 2026-03-29 10:00:00.000000000 +0000
 Birth: 2026-01-15 09:00:00.000000000 +0000`);
  }
  return results.join('\n\n');
}

export function nano(ctx: CommandContext): string {
  const { args, currentDirectory } = ctx;
  if (!args[0]) return 'Usage: nano <file>';
  return `__OPEN_EDITOR__${resolvePath(currentDirectory, args[0])}`;
}

export function vim(ctx: CommandContext): string {
  const { args, currentDirectory } = ctx;
  if (!args[0]) return 'Usage: vim <file>';
  return `__OPEN_EDITOR__${resolvePath(currentDirectory, args[0])}`;
}

export function awk_cmd(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args } = ctx;
  if (args.length < 2) return "Usage: awk 'PROGRAM' FILE";

  const program = args[0];
  const fileArg = args[1];
  const path = resolvePath(currentDirectory, fileArg);
  const node = getNodeAtPath(filesystem, path);
  if (!node) return `awk: can't open source file ${fileArg}`;
  if (node.type === 'directory') return `awk: ${fileArg}: Is a directory`;

  const content = node.content || '';
  const lines = content.split('\n');
  const results: string[] = [];

  // Simple awk: support print $N patterns
  const printMatch = program.match(/\{print\s+(.+)\}/);
  if (printMatch) {
    const fields = printMatch[1].split(',').map(f => f.trim());
    lines.forEach(line => {
      const cols = line.split(/\s+/);
      const output = fields.map(f => {
        if (f === '$0') return line;
        const n = parseInt(f.replace('$', ''));
        if (!isNaN(n)) return cols[n - 1] || '';
        return f.replace(/"/g, '');
      }).join(' ');
      results.push(output);
    });
  } else {
    results.push(`awk: ${program}: (simulated - basic awk support only)`);
  }

  return results.join('\n');
}

export function sed_cmd(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args, flags, updateFilesystem } = ctx;
  if (args.length < 2) return "Usage: sed 's/PATTERN/REPLACEMENT/' FILE";

  const program = args[0];
  const fileArg = args[1];
  const inPlace = flags.includes('i');
  const path = resolvePath(currentDirectory, fileArg);
  const node = getNodeAtPath(filesystem, path);
  if (!node) return `sed: ${fileArg}: No such file or directory`;
  if (node.type === 'directory') return `sed: ${fileArg}: Is a directory`;

  const content = node.content || '';

  // Support s/pattern/replacement/[g] form
  const subMatch = program.match(/^s\/(.*?)\/(.*?)\/([gi]*)$/);
  if (!subMatch) return `sed: -e expression #1, char 0: no previous regular expression`;

  const [, pattern, replacement, gflags] = subMatch;
  try {
    const regex = new RegExp(pattern, gflags.includes('g') ? 'g' : '');
    const newContent = content.replace(regex, replacement);
    if (inPlace) {
      const newNode = { ...node, content: newContent, modified: formatDate() };
      updateFilesystem(setNodeAtPath(filesystem, path, newNode));
      return '';
    }
    return newContent;
  } catch {
    return `sed: invalid regex '${pattern}'`;
  }
}

export function cut(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args, flags } = ctx;

  let delimiter = '\t';
  let fields: number[] = [];
  let fileArg = '';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-d' && args[i+1]) { delimiter = args[++i]; }
    else if (args[i] === '-f' && args[i+1]) {
      fields = args[++i].split(',').map(f => parseInt(f) - 1);
    }
    else if (args[i].startsWith('-d')) { delimiter = args[i].slice(2); }
    else if (args[i].startsWith('-f')) { fields = args[i].slice(2).split(',').map(f => parseInt(f) - 1); }
    else if (!args[i].startsWith('-')) { fileArg = args[i]; }
  }

  if (!fileArg) return 'cut: you must specify a list of bytes, characters, or fields';

  const path = resolvePath(currentDirectory, fileArg);
  const node = getNodeAtPath(filesystem, path);
  if (!node) return `cut: ${fileArg}: No such file or directory`;
  if (node.type === 'directory') return `cut: ${fileArg}: Is a directory`;

  const lines = (node.content || '').split('\n');
  return lines.map(line => {
    const parts = line.split(delimiter);
    return fields.map(f => parts[f] || '').join(delimiter);
  }).join('\n');
}

export function tr_cmd(ctx: CommandContext): string {
  if (args_global(ctx).length < 2) return "Usage: tr SET1 SET2";
  return "(tr: requires piped input - use with echo or cat)";
}

function args_global(ctx: CommandContext) {
  return ctx.args.filter(a => !a.startsWith('-'));
}

export function tee(ctx: CommandContext): string {
  return '(tee: requires piped input)';
}

export function xargs(ctx: CommandContext): string {
  return '(xargs: requires piped input)';
}

export function paste(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args } = ctx;
  const fileArgs = args.filter(a => !a.startsWith('-'));
  if (fileArgs.length === 0) return 'paste: missing operand';

  const fileContents = fileArgs.map(f => {
    const path = resolvePath(currentDirectory, f);
    const node = getNodeAtPath(filesystem, path);
    if (!node || node.type === 'directory') return [];
    return (node.content || '').split('\n');
  });

  const maxLen = Math.max(...fileContents.map(c => c.length));
  const results: string[] = [];
  for (let i = 0; i < maxLen; i++) {
    results.push(fileContents.map(c => c[i] || '').join('\t'));
  }
  return results.join('\n');
}

export function base64_cmd(ctx: CommandContext): string {
  const { args, flags, filesystem, currentDirectory } = ctx;
  const decode = flags.includes('d');
  const fileArgs = args.filter(a => !a.startsWith('-'));

  if (fileArgs.length === 0) return decode ? '(base64 -d: requires input)' : '(base64: requires input)';

  const path = resolvePath(currentDirectory, fileArgs[0]);
  const node = getNodeAtPath(filesystem, path);
  if (node && node.type === 'file') {
    const content = node.content || '';
    if (decode) {
      try { return atob(content); } catch { return 'base64: invalid input'; }
    } else {
      return btoa(content);
    }
  }
  // treat arg as literal string
  if (decode) {
    try { return atob(fileArgs[0]); } catch { return 'base64: invalid input'; }
  }
  return btoa(fileArgs[0]);
}

export function md5sum(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args } = ctx;
  const fileArgs = args.filter(a => !a.startsWith('-'));
  if (fileArgs.length === 0) return 'md5sum: missing operand';

  return fileArgs.map(f => {
    const path = resolvePath(currentDirectory, f);
    const node = getNodeAtPath(filesystem, path);
    if (!node) return `md5sum: ${f}: No such file or directory`;
    // Deterministic fake hash based on content length
    const len = node.content?.length || 0;
    const hash = ['5f4dcc3b5aa765d61d', '8327deb882cf99af5b', '3dad4d5f3b15c38fb', '97e5ac8d20a16b4fa'][len % 4];
    return `${hash.padEnd(32, '0')}  ${f}`;
  }).join('\n');
}

export function sha256sum(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args } = ctx;
  const fileArgs = args.filter(a => !a.startsWith('-'));
  if (fileArgs.length === 0) return 'sha256sum: missing operand';

  return fileArgs.map(f => {
    const path = resolvePath(currentDirectory, f);
    const node = getNodeAtPath(filesystem, path);
    if (!node) return `sha256sum: ${f}: No such file or directory`;
    const hash = 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f';
    return `${hash}  ${f}`;
  }).join('\n');
}

export function xxd(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args } = ctx;
  const fileArgs = args.filter(a => !a.startsWith('-'));
  if (fileArgs.length === 0) return 'xxd: missing input file';

  const path = resolvePath(currentDirectory, fileArgs[0]);
  const node = getNodeAtPath(filesystem, path);
  if (!node) return `xxd: ${fileArgs[0]}: No such file or directory`;
  if (node.type === 'directory') return `xxd: ${fileArgs[0]}: Is a directory`;

  const content = node.content || '';
  const lines: string[] = [];
  for (let i = 0; i < Math.min(content.length, 256); i += 16) {
    const chunk = content.slice(i, i + 16);
    const hex = Array.from(chunk).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
    const ascii = Array.from(chunk).map(c => c.charCodeAt(0) >= 32 && c.charCodeAt(0) < 127 ? c : '.').join('');
    const offset = i.toString(16).padStart(8, '0');
    lines.push(`${offset}: ${hex.padEnd(47)}  ${ascii}`);
  }
  if (content.length > 256) lines.push('...');
  return lines.join('\n');
}

export function strings_cmd(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args } = ctx;
  const fileArgs = args.filter(a => !a.startsWith('-'));
  if (fileArgs.length === 0) return 'strings: missing operand';

  const path = resolvePath(currentDirectory, fileArgs[0]);
  const node = getNodeAtPath(filesystem, path);
  if (!node) return `strings: ${fileArgs[0]}: No such file or directory`;
  const content = node.content || '';
  const matches = content.match(/[\x20-\x7e]{4,}/g) || [];
  return matches.join('\n');
}

export function hexdump(ctx: CommandContext): string {
  return xxd(ctx);
}

export function od(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args } = ctx;
  const fileArgs = args.filter(a => !a.startsWith('-'));
  if (fileArgs.length === 0) return 'od: missing operand';

  const path = resolvePath(currentDirectory, fileArgs[0]);
  const node = getNodeAtPath(filesystem, path);
  if (!node) return `od: ${fileArgs[0]}: No such file or directory`;
  if (node.type === 'directory') return `od: ${fileArgs[0]}: Is a directory`;

  const content = node.content || '';
  const lines: string[] = [];
  for (let i = 0; i < Math.min(content.length, 128); i += 8) {
    const chunk = content.slice(i, i + 8);
    const octal = Array.from(chunk).map(c => c.charCodeAt(0).toString(8).padStart(3,'0')).join(' ');
    lines.push(`${i.toString(8).padStart(7,'0')} ${octal}`);
  }
  lines.push(`${Math.min(content.length, 128).toString(8).padStart(7,'0')}`);
  return lines.join('\n');
}

export function seq_cmd(ctx: CommandContext): string {
  const fileArgs = ctx.args.filter(a => !a.startsWith('-'));
  if (fileArgs.length === 0) return 'seq: missing operand';

  let start = 1, increment = 1, end = 1;
  if (fileArgs.length === 1) { end = parseInt(fileArgs[0]); }
  else if (fileArgs.length === 2) { start = parseInt(fileArgs[0]); end = parseInt(fileArgs[1]); }
  else { start = parseInt(fileArgs[0]); increment = parseInt(fileArgs[1]); end = parseInt(fileArgs[2]); }

  if (isNaN(start) || isNaN(end) || isNaN(increment)) return 'seq: invalid argument';
  if (Math.abs((end - start) / increment) > 1000) return 'seq: output limited to 1000 values';

  const results: string[] = [];
  for (let i = start; increment > 0 ? i <= end : i >= end; i += increment) {
    results.push(i.toString());
  }
  return results.join('\n');
}

export function shuf_cmd(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args, flags } = ctx;
  const fileArgs = args.filter(a => !a.startsWith('-'));

  if (fileArgs.length === 0) return '(shuf: requires file input)';

  const path = resolvePath(currentDirectory, fileArgs[0]);
  const node = getNodeAtPath(filesystem, path);
  if (!node) return `shuf: ${fileArgs[0]}: No such file or directory`;
  if (node.type === 'directory') return `shuf: ${fileArgs[0]}: Is a directory`;

  const lines = (node.content || '').split('\n').filter(Boolean);
  for (let i = lines.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lines[i], lines[j]] = [lines[j], lines[i]];
  }
  return lines.join('\n');
}

export function yes_cmd(ctx: CommandContext): string {
  const word = ctx.args[0] || 'y';
  const lines = Array(20).fill(word);
  return lines.join('\n') + '\n...(press Ctrl+C to stop)';
}
