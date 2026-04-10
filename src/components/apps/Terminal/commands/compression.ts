import { CommandContext } from './navigation';
import { getNodeAtPath, resolvePath, setNodeAtPath, deleteNodeAtPath } from '@/lib/filesystem';

function formatDate(): string {
  const now = new Date();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[now.getMonth()]} ${now.getDate().toString().padStart(2,' ')} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
}

export function tar(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args, flags, updateFilesystem } = ctx;

  const create = flags.some(f => f.includes('c')) || args.includes('-c') || args.includes('c');
  const extract = flags.some(f => f.includes('x')) || args.includes('-x') || args.includes('x');
  const list = flags.some(f => f.includes('t')) || args.includes('-t') || args.includes('t');
  const verbose = flags.some(f => f.includes('v')) || args.includes('-v') || args.includes('v');
  const gzip = flags.some(f => f.includes('z')) || args.includes('-z') || args.includes('z');
  const bzip = flags.some(f => f.includes('j')) || args.includes('-j') || args.includes('j');
  const xz = flags.some(f => f.includes('J')) || args.includes('-J') || args.includes('J');

  const fIndex = args.findIndex(a => a === '-f' || a === 'f');
  let archiveName: string | null = null;
  let fileArgs: string[] = [];

  // Parse tar arguments: tar [options] archive [files...]
  // Handle combined flags like -czf
  const combinedArg = args.find(a => /^-?[ctxvzjJf]+$/.test(a) && a.length > 1);

  if (combinedArg && combinedArg.includes('f')) {
    const combinedIdx = args.indexOf(combinedArg);
    archiveName = args[combinedIdx + 1] || null;
    fileArgs = args.slice(combinedIdx + 2);
  } else if (fIndex !== -1) {
    archiveName = args[fIndex + 1] || null;
    fileArgs = args.slice(fIndex + 2);
  } else {
    fileArgs = args.filter(a => !a.startsWith('-'));
    archiveName = fileArgs[0] || null;
    fileArgs = fileArgs.slice(1);
  }

  if (!archiveName) {
    return `tar: you must specify one of the '-Acdtrux', '--delete' or '--test-label' options
Try 'tar --help' or 'tar --usage' for more information.`;
  }

  if (create) {
    if (fileArgs.length === 0) return `tar: Cowardly refusing to create an empty archive`;

    const archivePath = resolvePath(currentDirectory, archiveName);
    const compression = gzip ? '.gz' : bzip ? '.bz2' : xz ? '.xz' : '';
    const contents: string[] = [];
    const verboseLines: string[] = [];

    for (const file of fileArgs) {
      const filePath = resolvePath(currentDirectory, file);
      const node = getNodeAtPath(filesystem, filePath);
      if (!node) return `tar: ${file}: Cannot stat: No such file or directory`;

      const addToArchive = (n: typeof node, path: string) => {
        verboseLines.push(path);
        contents.push(path);
        if (n.type === 'directory' && n.children) {
          Object.values(n.children).forEach(child =>
            addToArchive(child, `${path}/${child.name}`)
          );
        }
      };
      addToArchive(node, file);
    }

    const archiveNode = {
      type: 'file' as const,
      name: archiveName.split('/').pop() || archiveName,
      permissions: '-rw-r--r--',
      owner: 'parrot',
      group: 'parrot',
      modified: formatDate(),
      content: `__ARCHIVE__:${contents.join(',')}`,
    };

    const newFs = setNodeAtPath(filesystem, archivePath, archiveNode);
    updateFilesystem(newFs);

    if (verbose) return verboseLines.join('\n');
    return '';
  }

  if (extract) {
    const archivePath = resolvePath(currentDirectory, archiveName);
    const archiveNode = getNodeAtPath(filesystem, archivePath);
    if (!archiveNode) return `tar: ${archiveName}: Cannot open: No such file or directory`;
    if (archiveNode.type !== 'file') return `tar: ${archiveName}: Cannot open: Is a directory`;

    const content = archiveNode.content || '';
    if (verbose) {
      if (content.startsWith('__ARCHIVE__:')) {
        return content.replace('__ARCHIVE__:', '').split(',').join('\n');
      }
      return `x ${archiveName.replace(/\.(tar\.gz|tar\.bz2|tar\.xz|tgz|tar)$/, '')}/`;
    }
    return '';
  }

  if (list) {
    const archivePath = resolvePath(currentDirectory, archiveName);
    const archiveNode = getNodeAtPath(filesystem, archivePath);
    if (!archiveNode) return `tar: ${archiveName}: Cannot open: No such file or directory`;

    const content = archiveNode.content || '';
    if (content.startsWith('__ARCHIVE__:')) {
      return content.replace('__ARCHIVE__:', '').split(',').join('\n');
    }

    const baseName = archiveName.replace(/\.(tar\.gz|tar\.bz2|tar\.xz|tgz|tar)$/, '');
    return `${baseName}/\n${baseName}/README.md\n${baseName}/src/\n${baseName}/src/main.c`;
  }

  return `tar: You must specify one of the '-Acdtrux' options.`;
}

export function zip(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args, flags, updateFilesystem } = ctx;
  const recursive = flags.includes('r') || args.includes('-r');
  const nonFlagArgs = args.filter(a => !a.startsWith('-'));

  if (nonFlagArgs.length < 2) return 'zip: usage: zip [options] zipfile files...';

  const zipName = nonFlagArgs[0];
  const files = nonFlagArgs.slice(1);
  const zipPath = resolvePath(currentDirectory, zipName);

  const lines: string[] = ['  adding:'];
  files.forEach(f => {
    const filePath = resolvePath(currentDirectory, f);
    const node = getNodeAtPath(filesystem, filePath);
    if (node) lines.push(`  adding: ${f} (deflated 42%)`);
  });

  const zipNode = {
    type: 'file' as const,
    name: zipName.split('/').pop() || zipName,
    permissions: '-rw-r--r--',
    owner: 'parrot',
    group: 'parrot',
    modified: formatDate(),
    content: `__ZIP__:${files.join(',')}`,
  };

  updateFilesystem(setNodeAtPath(filesystem, zipPath, zipNode));
  return lines.join('\n');
}

export function unzip(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args } = ctx;
  const nonFlagArgs = args.filter(a => !a.startsWith('-'));
  if (nonFlagArgs.length === 0) return 'unzip: must specify zipfile';

  const zipFile = nonFlagArgs[0];
  const zipPath = resolvePath(currentDirectory, zipFile);
  const node = getNodeAtPath(filesystem, zipPath);

  if (!node) return `unzip: cannot find or open ${zipFile}`;

  const content = node.content || '';
  const files = content.startsWith('__ZIP__:')
    ? content.replace('__ZIP__:', '').split(',')
    : ['file1.txt', 'file2.txt'];

  const lines = [
    `Archive:  ${zipFile}`,
    ...files.map(f => `  inflating: ${f}`),
  ];
  return lines.join('\n');
}

export function gzip(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args, flags, updateFilesystem } = ctx;
  const fileArgs = args.filter(a => !a.startsWith('-'));
  const decompress = flags.includes('d');
  const keep = flags.includes('k');
  const listMode = flags.includes('l');

  if (fileArgs.length === 0) return 'gzip: compressed data not read from a terminal. Use -f to force compression.';

  let currentFs = filesystem;

  for (const file of fileArgs) {
    const filePath = resolvePath(currentDirectory, file);
    const node = getNodeAtPath(currentFs, filePath);

    if (!node) return `gzip: ${file}: No such file or directory`;
    if (node.type === 'directory') return `gzip: ${file}: Is a directory -- ignored`;

    if (listMode) {
      return `         compressed        uncompressed  ratio uncompressed_name
               ${Math.floor((node.content?.length || 0) * 0.6)}             ${node.content?.length || 0}  40.0% ${file.replace('.gz', '')}`;
    }

    if (decompress || file.endsWith('.gz')) {
      const outName = file.replace('.gz', '');
      const outPath = resolvePath(currentDirectory, outName);
      const newNode = { ...node, name: outName, permissions: '-rw-r--r--' };
      currentFs = setNodeAtPath(currentFs, outPath, newNode);
      if (!keep) currentFs = deleteNodeAtPath(currentFs, filePath);
    } else {
      const outName = file + '.gz';
      const outPath = resolvePath(currentDirectory, outName);
      const newNode = { ...node, name: outName };
      currentFs = setNodeAtPath(currentFs, outPath, newNode);
      if (!keep) currentFs = deleteNodeAtPath(currentFs, filePath);
    }
  }

  updateFilesystem(currentFs);
  return '';
}

export function gunzip(ctx: CommandContext): string {
  const { args } = ctx;
  const newCtx = { ...ctx, args: [...args, '-d'], flags: [...ctx.flags, 'd'] };
  return gzip(newCtx);
}

export function bzip2(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args, flags, updateFilesystem } = ctx;
  const fileArgs = args.filter(a => !a.startsWith('-'));
  const decompress = flags.includes('d');
  const keep = flags.includes('k');

  if (fileArgs.length === 0) return 'bzip2: I won\'t read compressed data from a terminal.';

  let currentFs = filesystem;

  for (const file of fileArgs) {
    const filePath = resolvePath(currentDirectory, file);
    const node = getNodeAtPath(currentFs, filePath);
    if (!node) return `bzip2: Can't open input file ${file}: No such file or directory.`;

    if (decompress || file.endsWith('.bz2')) {
      const outName = file.replace('.bz2', '');
      const outPath = resolvePath(currentDirectory, outName);
      currentFs = setNodeAtPath(currentFs, outPath, { ...node, name: outName });
      if (!keep) currentFs = deleteNodeAtPath(currentFs, filePath);
    } else {
      const outName = file + '.bz2';
      const outPath = resolvePath(currentDirectory, outName);
      currentFs = setNodeAtPath(currentFs, outPath, { ...node, name: outName });
      if (!keep) currentFs = deleteNodeAtPath(currentFs, filePath);
    }
  }

  updateFilesystem(currentFs);
  return '';
}

export function bunzip2(ctx: CommandContext): string {
  return bzip2({ ...ctx, flags: [...ctx.flags, 'd'] });
}

export function xz_cmd(ctx: CommandContext): string {
  const { filesystem, currentDirectory, args, flags, updateFilesystem } = ctx;
  const fileArgs = args.filter(a => !a.startsWith('-'));
  const decompress = flags.includes('d');
  const keep = flags.includes('k');

  if (fileArgs.length === 0) return 'xz: Compressed data cannot be read from a terminal';

  let currentFs = filesystem;

  for (const file of fileArgs) {
    const filePath = resolvePath(currentDirectory, file);
    const node = getNodeAtPath(currentFs, filePath);
    if (!node) return `xz: ${file}: No such file or directory`;

    if (decompress || file.endsWith('.xz')) {
      const outName = file.replace('.xz', '');
      const outPath = resolvePath(currentDirectory, outName);
      currentFs = setNodeAtPath(currentFs, outPath, { ...node, name: outName });
      if (!keep) currentFs = deleteNodeAtPath(currentFs, filePath);
    } else {
      const outName = file + '.xz';
      const outPath = resolvePath(currentDirectory, outName);
      currentFs = setNodeAtPath(currentFs, outPath, { ...node, name: outName });
      if (!keep) currentFs = deleteNodeAtPath(currentFs, filePath);
    }
  }

  updateFilesystem(currentFs);
  return '';
}

export function unxz(ctx: CommandContext): string {
  return xz_cmd({ ...ctx, flags: [...ctx.flags, 'd'] });
}
