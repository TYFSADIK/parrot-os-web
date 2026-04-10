import { FSNode, getNodeAtPath, resolvePath, setNodeAtPath, normalizePath } from '@/lib/filesystem';
import { CommandContext } from './commands/navigation';
import * as navCmds from './commands/navigation';
import * as fileCmds from './commands/files';
import * as sysCmds from './commands/system';
import * as netCmds from './commands/network';
import * as pkgCmds from './commands/packages';
import * as permCmds from './commands/permissions';
import * as procCmds from './commands/processes';
import * as diskCmds from './commands/disk';
import * as compCmds from './commands/compression';
import * as funCmds from './commands/fun';
import * as secCmds from './commands/security';

export interface ParsedCommand {
  command: string;
  args: string[];
  flags: string[];
  rawArgs: string;
  redirectOut?: string;   // > file
  redirectAppend?: string; // >> file
  redirectIn?: string;    // < file
  stderrToStdout?: boolean; // 2>&1
}

export interface CommandResult {
  output: string;
  newDirectory?: string;
  newFilesystem?: FSNode;
  openEditor?: string;
  clear?: boolean;
}

export function parseFlags(args: string[]): { flags: string[]; nonFlagArgs: string[] } {
  const flags: string[] = [];
  const nonFlagArgs: string[] = [];

  for (const arg of args) {
    if (arg.startsWith('--')) {
      flags.push(arg.slice(2));
    } else if (arg.startsWith('-') && arg.length > 1 && !arg.match(/^-\d/)) {
      // Split combined flags like -la into ['l', 'a']
      const flagChars = arg.slice(1).split('');
      flags.push(...flagChars);
    } else {
      nonFlagArgs.push(arg);
    }
  }

  return { flags, nonFlagArgs };
}

export function tokenizeCommand(input: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let inSingle = false;
  let inDouble = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (char === "'" && !inDouble) {
      inSingle = !inSingle;
    } else if (char === '"' && !inSingle) {
      inDouble = !inDouble;
    } else if (char === ' ' && !inSingle && !inDouble) {
      if (current) {
        tokens.push(current);
        current = '';
      }
    } else {
      current += char;
    }
  }

  if (current) tokens.push(current);
  return tokens;
}

export function parseCommand(input: string): ParsedCommand & { redirectOut?: string; redirectAppend?: string; redirectIn?: string; stderrToStdout?: boolean } {
  let redirectOut: string | undefined;
  let redirectAppend: string | undefined;
  let redirectIn: string | undefined;
  let stderrToStdout = false;

  // Handle 2>&1
  if (input.includes('2>&1')) {
    stderrToStdout = true;
    input = input.replace('2>&1', '').trim();
  }

  // Handle >> (before >)
  const appendMatch = input.match(/(.*?)>>(.*)/);
  if (appendMatch) {
    input = appendMatch[1].trim();
    redirectAppend = appendMatch[2].trim().split(' ')[0];
  } else {
    // Handle >
    const outMatch = input.match(/(.*?)>(.*)/);
    if (outMatch) {
      input = outMatch[1].trim();
      redirectOut = outMatch[2].trim().split(' ')[0];
    }
  }

  // Handle <
  const inMatch = input.match(/(.*?)<(.*)/);
  if (inMatch) {
    input = inMatch[1].trim();
    redirectIn = inMatch[2].trim().split(' ')[0];
  }

  const tokens = tokenizeCommand(input.trim());
  const command = tokens[0] || '';
  const rawTokens = tokens.slice(1);
  const rawArgs = rawTokens.join(' ');

  const { flags, nonFlagArgs } = parseFlags(rawTokens);

  return {
    command: command.toLowerCase(),
    args: nonFlagArgs,
    flags,
    rawArgs,
    redirectOut,
    redirectAppend,
    redirectIn,
    stderrToStdout,
  };
}

export function getAvailableCommands(): string[] {
  return [
    'pwd', 'ls', 'cd', 'mkdir', 'rmdir', 'tree', 'find', 'locate',
    'cat', 'head', 'tail', 'touch', 'cp', 'mv', 'rm', 'grep', 'nano', 'vim', 'less',
    'wc', 'diff', 'sort', 'uniq', 'file', 'stat', 'awk', 'sed', 'cut', 'tr', 'tee',
    'xargs', 'paste', 'base64', 'md5sum', 'sha256sum', 'xxd', 'od', 'strings', 'hexdump',
    'seq', 'shuf', 'yes',
    'whoami', 'id', 'uname', 'uptime', 'date', 'cal', 'echo', 'env', 'history',
    'which', 'whereis', 'hostname', 'lsb_release', 'printenv', 'alias', 'export',
    'clear', 'reset', 'exit', 'help', 'man', 'set', 'unset', 'source', 'printf', 'read',
    'ps', 'top', 'htop', 'kill', 'killall', 'bg', 'fg', 'jobs', 'pstree', 'nice', 'nohup',
    'ip', 'ifconfig', 'ping', 'netstat', 'ss', 'nmap', 'curl', 'wget', 'ssh', 'scp',
    'traceroute', 'dig', 'nslookup', 'whois', 'arp', 'route',
    'apt', 'dpkg',
    'chmod', 'chown', 'chgrp', 'sudo', 'su', 'passwd', 'umask', 'groups',
    'df', 'du', 'mount', 'umount', 'lsblk', 'fdisk', 'free', 'iostat', 'vmstat',
    'tar', 'zip', 'unzip', 'gzip', 'gunzip', 'bzip2', 'bunzip2', 'xz', 'unxz',
    'neofetch', 'cowsay', 'fortune', 'sl', 'figlet', 'lolcat', 'matrix', 'banner', 'toilet',
    'hydra', 'hashcat', 'john', 'aircrack-ng', 'wireshark', 'msfconsole', 'nikto', 'sqlmap',
  ];
}

export function tabComplete(input: string, filesystem: FSNode, currentDirectory: string): string[] {
  const parts = tokenizeCommand(input);
  const isCompletingCommand = parts.length === 0 || (parts.length === 1 && !input.endsWith(' '));
  const availableCommands = getAvailableCommands();

  if (isCompletingCommand) {
    const prefix = parts[0] || '';
    return availableCommands.filter(cmd => cmd.startsWith(prefix));
  }

  // Complete file/directory paths
  const lastPart = input.endsWith(' ') ? '' : parts[parts.length - 1];
  const dirPart = lastPart.includes('/') ? lastPart.substring(0, lastPart.lastIndexOf('/') + 1) : '';
  const filePrefix = lastPart.includes('/') ? lastPart.substring(lastPart.lastIndexOf('/') + 1) : lastPart;

  let searchDir = currentDirectory;
  if (dirPart) {
    searchDir = resolvePath(currentDirectory, dirPart);
  }

  const dirNode = getNodeAtPath(filesystem, searchDir);
  if (!dirNode || !dirNode.children) return [];

  const matches = Object.keys(dirNode.children)
    .filter(name => name.startsWith(filePrefix))
    .map(name => {
      const child = dirNode.children![name];
      return dirPart + name + (child.type === 'directory' ? '/' : '');
    });

  return matches;
}

function createContext(
  command: string,
  args: string[],
  flags: string[],
  rawArgs: string,
  filesystem: FSNode,
  currentDirectory: string,
  setCurrentDirectory: (d: string) => void,
  updateFilesystem: (fs: FSNode) => void
): CommandContext {
  return {
    filesystem,
    currentDirectory,
    setCurrentDirectory,
    updateFilesystem,
    args,
    flags,
    rawArgs,
  };
}

export async function executeCommand(
  input: string,
  filesystem: FSNode,
  currentDirectory: string,
  commandHistory: string[],
  setCurrentDirectory: (d: string) => void,
  updateFilesystem: (fs: FSNode) => void,
  openEditorCallback?: (path: string) => void
): Promise<CommandResult> {
  const trimmed = input.trim();
  if (!trimmed) return { output: '' };

  // Handle special history shortcuts
  if (trimmed === '!!') {
    const lastCmd = commandHistory[commandHistory.length - 1];
    if (!lastCmd) return { output: 'bash: !!: event not found' };
    return executeCommand(lastCmd, filesystem, currentDirectory, commandHistory, setCurrentDirectory, updateFilesystem, openEditorCallback);
  }

  if (trimmed.match(/^!\d+$/)) {
    const n = parseInt(trimmed.slice(1)) - 1;
    const cmd = commandHistory[n];
    if (!cmd) return { output: `bash: !${n + 1}: event not found` };
    return executeCommand(cmd, filesystem, currentDirectory, commandHistory, setCurrentDirectory, updateFilesystem, openEditorCallback);
  }

  // Handle pipes
  if (trimmed.includes('|')) {
    const pipeSegments = trimmed.split('|').map(s => s.trim());
    let pipeOutput = '';

    for (const segment of pipeSegments) {
      const result = await executeSingleCommand(
        segment + (pipeOutput ? ` ${pipeOutput}` : ''),
        filesystem,
        currentDirectory,
        commandHistory,
        setCurrentDirectory,
        updateFilesystem,
        openEditorCallback
      );
      pipeOutput = result.output;
      if (result.newFilesystem) filesystem = result.newFilesystem;
      if (result.newDirectory) currentDirectory = result.newDirectory;
    }

    return { output: pipeOutput };
  }

  // Handle semicolons (multiple commands)
  if (trimmed.includes(';')) {
    const parts = trimmed.split(';').map(s => s.trim()).filter(Boolean);
    let lastOutput = '';
    let lastFs = filesystem;
    let lastDir = currentDirectory;

    for (const part of parts) {
      const result = await executeCommand(part, lastFs, lastDir, commandHistory, setCurrentDirectory, updateFilesystem, openEditorCallback);
      lastOutput = result.output;
      if (result.newFilesystem) lastFs = result.newFilesystem;
      if (result.newDirectory) lastDir = result.newDirectory;
    }
    return { output: lastOutput };
  }

  return executeSingleCommand(trimmed, filesystem, currentDirectory, commandHistory, setCurrentDirectory, updateFilesystem, openEditorCallback);
}

async function executeSingleCommand(
  input: string,
  filesystem: FSNode,
  currentDirectory: string,
  commandHistory: string[],
  setCurrentDirectory: (d: string) => void,
  updateFilesystem: (fs: FSNode) => void,
  openEditorCallback?: (path: string) => void
): Promise<CommandResult> {
  const parsed = parseCommand(input);
  const { command, args, flags, rawArgs } = parsed;

  let newDirectory: string | undefined;
  let newFilesystem: FSNode | undefined;

  const localSetDir = (d: string) => { newDirectory = d; setCurrentDirectory(d); };
  const localUpdateFs = (fs: FSNode) => { newFilesystem = fs; updateFilesystem(fs); };

  const ctx = createContext(command, args, flags, rawArgs, filesystem, currentDirectory, localSetDir, localUpdateFs);

  let output = '';

  switch (command) {
    // Navigation
    case 'pwd': output = navCmds.pwd(ctx); break;
    case 'ls': output = navCmds.ls(ctx); break;
    case 'dir': output = navCmds.ls(ctx); break;
    case 'cd': output = navCmds.cd(ctx); break;
    case 'mkdir': output = navCmds.mkdir(ctx); break;
    case 'rmdir': output = navCmds.rmdir(ctx); break;
    case 'tree': output = navCmds.tree(ctx); break;
    case 'find': output = navCmds.find_cmd(ctx); break;
    case 'locate': output = navCmds.locate(ctx); break;

    // Files
    case 'cat': output = fileCmds.cat(ctx); break;
    case 'head': output = fileCmds.head(ctx); break;
    case 'tail': output = fileCmds.tail(ctx); break;
    case 'touch': output = fileCmds.touch(ctx); break;
    case 'cp': output = fileCmds.cp(ctx); break;
    case 'mv': output = fileCmds.mv(ctx); break;
    case 'rm': output = fileCmds.rm(ctx); break;
    case 'grep': output = fileCmds.grep(ctx); break;
    case 'less': output = fileCmds.less(ctx); break;
    case 'more': output = fileCmds.less(ctx); break;
    case 'wc': output = fileCmds.wc(ctx); break;
    case 'diff': output = fileCmds.diff(ctx); break;
    case 'sort': output = fileCmds.sort(ctx); break;
    case 'uniq': output = fileCmds.uniq(ctx); break;
    case 'file': output = fileCmds.file_cmd(ctx); break;
    case 'stat': output = fileCmds.stat(ctx); break;
    case 'awk': output = fileCmds.awk_cmd(ctx); break;
    case 'sed': output = fileCmds.sed_cmd(ctx); break;
    case 'cut': output = fileCmds.cut(ctx); break;
    case 'tr': output = fileCmds.tr_cmd(ctx); break;
    case 'tee': output = fileCmds.tee(ctx); break;
    case 'xargs': output = fileCmds.xargs(ctx); break;
    case 'paste': output = fileCmds.paste(ctx); break;
    case 'base64': output = fileCmds.base64_cmd(ctx); break;
    case 'md5sum': output = fileCmds.md5sum(ctx); break;
    case 'sha256sum': output = fileCmds.sha256sum(ctx); break;
    case 'xxd': output = fileCmds.xxd(ctx); break;
    case 'od': output = fileCmds.od(ctx); break;
    case 'strings': output = fileCmds.strings_cmd(ctx); break;
    case 'hexdump': output = fileCmds.hexdump(ctx); break;
    case 'seq': output = fileCmds.seq_cmd(ctx); break;
    case 'shuf': output = fileCmds.shuf_cmd(ctx); break;
    case 'yes': output = fileCmds.yes_cmd(ctx); break;

    // Text editors -> open window
    case 'nano':
    case 'vim':
    case 'vi': {
      const result = command === 'nano' ? fileCmds.nano(ctx) : fileCmds.vim(ctx);
      if (result.startsWith('__OPEN_EDITOR__')) {
        const path = result.replace('__OPEN_EDITOR__', '');
        if (openEditorCallback) openEditorCallback(path);
        output = `Opening ${path} in Text Editor...`;
      } else {
        output = result;
      }
      break;
    }

    // System
    case 'whoami': output = sysCmds.whoami(ctx); break;
    case 'id': output = sysCmds.id_cmd(ctx); break;
    case 'uname': output = sysCmds.uname(ctx); break;
    case 'uptime': output = sysCmds.uptime(ctx); break;
    case 'date': output = sysCmds.date_cmd(ctx); break;
    case 'cal': output = sysCmds.cal(ctx); break;
    case 'echo': output = sysCmds.echo_cmd(ctx); break;
    case 'env': output = sysCmds.env_cmd(ctx); break;
    case 'history': output = sysCmds.history_cmd(ctx, commandHistory); break;
    case 'which': output = sysCmds.which_cmd(ctx); break;
    case 'whereis': output = sysCmds.whereis_cmd(ctx); break;
    case 'hostname': output = sysCmds.hostname_cmd(ctx); break;
    case 'lsb_release': output = sysCmds.lsb_release(ctx); break;
    case 'printenv': output = sysCmds.printenv_cmd(ctx); break;
    case 'alias': output = sysCmds.alias_cmd(ctx); break;
    case 'unalias': output = ''; break;
    case 'export': output = sysCmds.export_cmd(ctx); break;
    case 'source': output = sysCmds.source_cmd(ctx); break;
    case '.': output = sysCmds.source_cmd(ctx); break;
    case 'set': output = sysCmds.set_cmd(ctx); break;
    case 'unset': output = sysCmds.unset_cmd(ctx); break;
    case 'printf': output = sysCmds.printf_cmd(ctx); break;
    case 'read': output = sysCmds.read_cmd(ctx); break;
    case 'clear': output = '__CLEAR__'; break;
    case 'reset': output = '__CLEAR__'; break;
    case 'exit': output = sysCmds.exit_cmd(); break;
    case 'logout': output = sysCmds.exit_cmd(); break;
    case 'help': output = sysCmds.help_cmd(ctx); break;
    case 'man': output = sysCmds.man_cmd(ctx); break;
    case 'info': output = sysCmds.man_cmd(ctx); break;

    // Processes
    case 'ps': output = procCmds.ps(ctx); break;
    case 'top': output = procCmds.top(ctx); break;
    case 'htop': output = procCmds.htop(ctx); break;
    case 'kill': output = procCmds.kill_cmd(ctx); break;
    case 'killall': output = procCmds.killall(ctx); break;
    case 'pkill': output = procCmds.killall(ctx); break;
    case 'bg': output = procCmds.bg(ctx); break;
    case 'fg': output = procCmds.fg(ctx); break;
    case 'jobs': output = procCmds.jobs(ctx); break;
    case 'pstree': output = procCmds.pstree(ctx); break;
    case 'nice': output = procCmds.nice(ctx); break;
    case 'nohup': output = procCmds.nohup(ctx); break;

    // Networking
    case 'ip': output = netCmds.ip_cmd(ctx); break;
    case 'ifconfig': output = netCmds.ifconfig(ctx); break;
    case 'ping': output = netCmds.ping(ctx); break;
    case 'netstat': output = netCmds.netstat(ctx); break;
    case 'ss': output = netCmds.ss(ctx); break;
    case 'nmap': output = netCmds.nmap(ctx); break;
    case 'curl': output = netCmds.curl(ctx); break;
    case 'wget': output = netCmds.wget(ctx); break;
    case 'ssh': output = netCmds.ssh_cmd(ctx); break;
    case 'scp': output = netCmds.scp(ctx); break;
    case 'traceroute': output = netCmds.traceroute(ctx); break;
    case 'tracepath': output = netCmds.traceroute(ctx); break;
    case 'dig': output = netCmds.dig(ctx); break;
    case 'nslookup': output = netCmds.nslookup(ctx); break;
    case 'whois': output = netCmds.whois(ctx); break;
    case 'arp': output = netCmds.arp(ctx); break;
    case 'route': output = netCmds.route(ctx); break;

    // Packages
    case 'apt':
    case 'apt-get': output = pkgCmds.apt(ctx); break;
    case 'dpkg': output = pkgCmds.dpkg(ctx); break;

    // Permissions
    case 'chmod': output = permCmds.chmod(ctx); break;
    case 'chown': output = permCmds.chown(ctx); break;
    case 'chgrp': output = permCmds.chgrp(ctx); break;
    case 'sudo': output = permCmds.sudo(ctx); break;
    case 'su': output = permCmds.su(ctx); break;
    case 'passwd': output = permCmds.passwd(ctx); break;
    case 'umask': output = permCmds.umask(ctx); break;
    case 'groups': output = permCmds.groups(ctx); break;
    case 'newgrp': output = permCmds.newgrp(ctx); break;

    // Disk
    case 'df': output = diskCmds.df(ctx); break;
    case 'du': output = diskCmds.du(ctx); break;
    case 'mount': output = diskCmds.mount(ctx); break;
    case 'umount': output = diskCmds.umount(ctx); break;
    case 'lsblk': output = diskCmds.lsblk(ctx); break;
    case 'fdisk': output = diskCmds.fdisk(ctx); break;
    case 'free': output = diskCmds.free(ctx); break;
    case 'iostat': output = diskCmds.iostat(ctx); break;
    case 'vmstat': output = diskCmds.vmstat(ctx); break;

    // Compression
    case 'tar': output = compCmds.tar(ctx); break;
    case 'zip': output = compCmds.zip(ctx); break;
    case 'unzip': output = compCmds.unzip(ctx); break;
    case 'gzip': output = compCmds.gzip(ctx); break;
    case 'gunzip': output = compCmds.gunzip(ctx); break;
    case 'bzip2': output = compCmds.bzip2(ctx); break;
    case 'bunzip2': output = compCmds.bunzip2(ctx); break;
    case 'xz': output = compCmds.xz_cmd(ctx); break;
    case 'unxz': output = compCmds.unxz(ctx); break;

    // Fun
    case 'neofetch': output = funCmds.neofetch(ctx); break;
    case 'cowsay': output = funCmds.cowsay(ctx); break;
    case 'fortune': output = funCmds.fortune(ctx); break;
    case 'sl': output = funCmds.sl(ctx); break;
    case 'figlet': output = funCmds.figlet(ctx); break;
    case 'lolcat': output = funCmds.lolcat(ctx); break;
    case 'matrix': output = funCmds.matrix(ctx); break;
    case 'banner': output = funCmds.banner(ctx); break;
    case 'toilet': output = funCmds.toilet(ctx); break;

    // Security (educational)
    case 'hydra': output = secCmds.hydra(ctx); break;
    case 'hashcat': output = secCmds.hashcat(ctx); break;
    case 'john': output = secCmds.john(ctx); break;
    case 'aircrack-ng':
    case 'aircrack': output = secCmds.aircrack_ng(ctx); break;
    case 'wireshark':
    case 'tshark': output = secCmds.wireshark(ctx); break;
    case 'msfconsole':
    case 'msfvenom': output = secCmds.msfconsole(ctx); break;
    case 'nikto': output = secCmds.nikto(ctx); break;
    case 'sqlmap': output = secCmds.sqlmap(ctx); break;
    case 'burpsuite': output = 'BurpSuite requires a graphical interface. Launch from Applications > Pentesting menu.'; break;

    // Handle redirection output
    default: {
      // Try to handle common mistakes
      if (command.startsWith('./')) {
        output = `bash: ${command}: Permission denied`;
      } else if (command) {
        output = `bash: ${command}: command not found\nType 'help' to see available commands.`;
      }
    }
  }

  // Handle output redirection
  if (parsed.redirectOut && output && !output.startsWith('__CLEAR__')) {
    const targetPath = resolvePath(currentDirectory, parsed.redirectOut);
    const targetParts = targetPath.split('/').filter(Boolean);
    const targetName = targetParts[targetParts.length - 1];
    const parentPath = '/' + targetParts.slice(0, -1).join('/');
    const parentNode = getNodeAtPath(newFilesystem || filesystem, parentPath);

    if (parentNode) {
      const newNode = {
        type: 'file' as const,
        name: targetName,
        permissions: '-rw-r--r--',
        owner: 'parrot',
        group: 'parrot',
        modified: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        content: output,
      };
      const updatedFs = setNodeAtPath(newFilesystem || filesystem, targetPath, newNode);
      localUpdateFs(updatedFs);
      output = '';
    }
  }

  if (parsed.redirectAppend && output && !output.startsWith('__CLEAR__')) {
    const targetPath = resolvePath(currentDirectory, parsed.redirectAppend);
    const existingNode = getNodeAtPath(newFilesystem || filesystem, targetPath);
    const existingContent = existingNode?.content || '';
    const targetParts = targetPath.split('/').filter(Boolean);
    const targetName = targetParts[targetParts.length - 1];

    const newNode = {
      type: 'file' as const,
      name: targetName,
      permissions: '-rw-r--r--',
      owner: 'parrot',
      group: 'parrot',
      modified: new Date().toLocaleDateString(),
      content: existingContent + '\n' + output,
    };
    const updatedFs = setNodeAtPath(newFilesystem || filesystem, targetPath, newNode);
    localUpdateFs(updatedFs);
    output = '';
  }

  return {
    output: output === '__CLEAR__' ? '' : output,
    newDirectory,
    newFilesystem,
    clear: output === '__CLEAR__',
  };
}
