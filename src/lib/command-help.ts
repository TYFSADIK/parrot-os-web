export const COMMAND_HELP: Record<string, string> = {
  pwd: `pwd - Print name of current/working directory

SYNOPSIS
       pwd [OPTION]...

DESCRIPTION
       Print the full filename of the current working directory.

       -L, --logical
              use PWD from environment, even if it contains symlinks

       -P, --physical
              avoid all symlinks

EXAMPLE
       $ pwd
       /home/parrot`,

  ls: `ls - list directory contents

SYNOPSIS
       ls [OPTION]... [FILE]...

DESCRIPTION
       List information about the FILEs (the current directory by default).
       Sort entries alphabetically if none of -cftuvSUX nor --sort is specified.

       -a, --all
              do not ignore entries starting with .

       -l     use a long listing format

       -h, --human-readable
              with -l and -s, print sizes like 1K 234M 2G etc.

       -R, --recursive
              list subdirectories recursively

EXAMPLE
       $ ls -la
       total 48
       drwxr-xr-x  8 parrot parrot 4096 Mar 29 10:00 .
       drwxr-xr-x  3 root   root   4096 Jan 15 09:00 ..`,

  cd: `cd - Change the shell working directory

SYNOPSIS
       cd [dir]

DESCRIPTION
       Change the current directory to dir. The default dir is the value
       of the HOME shell variable.

       -     the previous working directory

EXAMPLE
       $ cd /home/parrot/Documents
       $ cd ..
       $ cd ~`,

  cat: `cat - concatenate files and print on the standard output

SYNOPSIS
       cat [OPTION]... [FILE]...

DESCRIPTION
       Concatenate FILE(s) to standard output.

       -n, --number
              number all output lines

       -A, --show-all
              equivalent to -vET

EXAMPLE
       $ cat file.txt
       $ cat -n file.txt`,

  grep: `grep - print lines that match patterns

SYNOPSIS
       grep [OPTION...] PATTERNS [FILE...]

DESCRIPTION
       grep searches for PATTERNS in each FILE.

       -i, --ignore-case
              Ignore case distinctions in patterns and input data.

       -r, --recursive
              Read all files under each directory, recursively.

       -n, --line-number
              Prefix each line of output with the 1-based line number.

       -v, --invert-match
              Invert the sense of matching.

       -c, --count
              Print a count of matching lines for each input file.

EXAMPLE
       $ grep "password" /etc/passwd
       $ grep -ri "error" /var/log/`,

  find: `find - search for files in a directory hierarchy

SYNOPSIS
       find [-H] [-L] [-P] [-D debugopts] [-Olevel] [starting-point...] [expression]

DESCRIPTION
       This manual page documents the GNU version of find.

       -name pattern
              Base of file name matches shell pattern.

       -type c
              File is of type c: d=directory, f=file, l=symlink

       -size n[cwbkMG]
              File uses n units of space.

EXAMPLE
       $ find /home -name "*.txt"
       $ find . -type f -name "*.sh"
       $ find / -size +100M`,

  chmod: `chmod - change file mode bits

SYNOPSIS
       chmod [OPTION]... MODE[,MODE]... FILE...
       chmod [OPTION]... OCTAL-MODE FILE...

DESCRIPTION
       chmod changes the file mode bits of each given file according to mode.

       Permissions: r=read(4), w=write(2), x=execute(1)
       Owner, Group, Others: u, g, o, a

EXAMPLES
       chmod 755 file    (rwxr-xr-x)
       chmod 644 file    (rw-r--r--)
       chmod +x script.sh
       chmod -R 755 dir/`,

  ssh: `ssh - OpenSSH remote login client

SYNOPSIS
       ssh [-46AaCfGgKkMNnqsTtVvXxYy] [-B bind_interface] [-b bind_address]
           [-c cipher_spec] [-D [bind_address:]port] [-E log_file]
           [-e escape_char] [-F configfile] [-I pkcs11] [-i identity_file]
           [-J destination] [-L address] [-l login_name] [-m mac_spec]
           [-O ctl_cmd] [-o option] [-p port] [-Q query_option] [-R address]
           [-S ctl_path] [-W host:port] [-w local_tun[:remote_tun]]
           destination [command]

DESCRIPTION
       ssh (SSH client) is a program for logging into a remote machine and for
       executing commands on a remote machine.

EXAMPLE
       $ ssh user@192.168.1.100
       $ ssh -p 2222 user@host.com
       $ ssh -i ~/.ssh/id_rsa user@host.com`,

  nmap: `nmap - Network exploration tool and security / port scanner

SYNOPSIS
       nmap [Scan Type(s)] [Options] {target specification}

DESCRIPTION
       Nmap ("Network Mapper") is an open source tool for network exploration
       and security auditing.

       -sS    TCP SYN scan (default)
       -sV    Probe open ports to determine service/version info
       -sC    Perform a script scan using default scripts
       -O     Enable OS detection
       -A     Enable OS detection, version detection, script scanning
       -p     Specify ports to scan
       -T<0-5> Set timing template

EXAMPLES
       $ nmap 192.168.1.1
       $ nmap -sV -p 80,443 example.com
       $ nmap -A -T4 192.168.1.0/24`,

  apt: `apt - command-line interface

SYNOPSIS
       apt [-h] [-o=config_string] [-c=config_file] [-t=target_release]
           [-a=architecture] {list | search | show | update | install pkg...
           | remove pkg... | upgrade | full-upgrade | edit-sources | {-v | --version}
           | {-h | --help}}

DESCRIPTION
       apt provides a high-level commandline interface for the package management
       system.

COMMANDS
       update          - update list of available packages
       upgrade         - upgrade the system
       install pkg     - install packages
       remove pkg      - remove packages
       search term     - search in package descriptions
       show pkg        - show package details
       list            - list packages

EXAMPLE
       $ sudo apt update
       $ sudo apt install nmap
       $ apt search python3`,

  sudo: `sudo, sudoedit — execute a command as another user

SYNOPSIS
       sudo -h | -K | -k | -V
       sudo -v [-ABknS] [-g group] [-h host] [-p prompt] [-u user]
       sudo [-ABbEHknPS] [-C num] [-D directory] [-g group] [-h host]
            [-i | -s] [-T timeout] [-u user] [VAR=value] [-i | -s]
            [command [arg...]]

DESCRIPTION
       sudo allows a permitted user to execute a command as the superuser or
       another user, as specified by the security policy.

EXAMPLE
       $ sudo apt update
       $ sudo -i    (switch to root shell)
       $ sudo -u www-data command`,

  tar: `tar — an archiving utility

SYNOPSIS
       tar [OPTION...] [FILE]...

DESCRIPTION
       tar is an archiving program designed to store multiple files in a single
       file (an archive), and to manipulate such archives.

       -c, --create
              Create a new archive.

       -x, --extract
              Extract files from an archive.

       -z, --gzip
              Filter the archive through gzip.

       -v, --verbose
              Verbosely list files processed.

       -f, --file=ARCHIVE
              Use archive file or device ARCHIVE.

EXAMPLES
       $ tar -czf archive.tar.gz directory/
       $ tar -xzf archive.tar.gz
       $ tar -tvf archive.tar.gz   (list contents)`,
};

export function getCommandHelp(command: string): string {
  return COMMAND_HELP[command] || `No manual entry for ${command}

Try 'help ${command}' or '${command} --help' for usage information.`;
}

export const LEARNING_MODE_EXPLANATIONS: Record<string, string> = {
  pwd: 'pwd (Print Working Directory) shows you exactly where you are in the filesystem. Think of it as asking "where am I?" The filesystem is organized like a tree, with / at the root.',
  ls: 'ls (LiSt) shows files and directories. The -l flag gives a long format with permissions, owner, size, and date. The -a flag shows hidden files (starting with .). Combining flags: ls -la',
  cd: 'cd (Change Directory) moves you around the filesystem. cd ~ takes you home, cd .. goes up one level, cd - returns to the previous directory. The filesystem structure follows the FHS (Filesystem Hierarchy Standard).',
  cat: 'cat (conCATenate) reads file contents and displays them. Originally designed to combine files, but commonly used to view them. For large files, use less or head/tail instead.',
  grep: 'grep (Global Regular Expression Print) searches for patterns in text. It\'s one of the most powerful tools in Linux. Use -r for recursive search, -i for case-insensitive, -n to show line numbers.',
  find: 'find searches the filesystem for files matching criteria. Unlike locate (which uses a database), find searches in real-time. Use -name for filename patterns, -type for file types, -size for file sizes.',
  chmod: 'chmod (CHange MODe) modifies file permissions. Linux uses three permission sets: owner (u), group (g), others (o). Each can have read(r/4), write(w/2), execute(x/1). Common: 755 (rwxr-xr-x), 644 (rw-r--r--).',
  mkdir: 'mkdir (MaKe DIRectory) creates new directories. Use -p to create nested directories and parent directories that don\'t exist yet. Example: mkdir -p projects/web/src',
  rm: 'rm (ReMove) deletes files and directories. WARNING: There\'s no trash can in the terminal! rm -rf removes directories recursively. Always double-check before using rm -rf!',
  touch: 'touch creates empty files or updates timestamps. Commonly used to create placeholder files or trigger build systems that check modification times.',
  cp: 'cp (CoPy) copies files and directories. Use -r or -R for recursive copy of directories. Use -p to preserve permissions and timestamps.',
  mv: 'mv (MoVe) moves or renames files and directories. Unlike cp, it doesn\'t keep the original. mv is also used for renaming: mv oldname.txt newname.txt',
  sudo: 'sudo (Super User DO) runs commands with elevated (root) privileges. Parrot OS uses sudo for system administration tasks. Never run sudo unless you understand what the command does!',
  apt: 'apt (Advanced Package Tool) manages software packages on Debian-based systems like Parrot OS. apt update refreshes the package list, apt install adds software, apt remove uninstalls it.',
  ssh: 'ssh (Secure SHell) provides encrypted remote access to other systems. Always use key-based authentication instead of passwords for better security. The default port is 22.',
  nmap: 'nmap (Network MAPper) is a powerful network scanner used for security auditing. It can discover hosts, scan ports, detect services, and identify operating systems. Use responsibly!',
  ps: 'ps (Process Status) shows running processes. ps aux shows all processes with details. The output includes PID (Process ID), CPU%, MEM%, and the command name.',
  kill: 'kill sends signals to processes. kill <PID> sends SIGTERM (graceful shutdown). kill -9 <PID> sends SIGKILL (force kill). Use ps or top to find the PID first.',
  ping: 'ping tests network connectivity by sending ICMP echo requests. It shows latency (round-trip time) and packet loss. Use -c to limit the number of packets sent.',
  ip: 'ip is the modern replacement for ifconfig. ip addr shows interface addresses, ip route shows routing table, ip link shows interface status.',
  df: 'df (Disk Free) shows disk space usage. The -h flag makes output human-readable (KB, MB, GB). df / shows root filesystem usage, df -h shows all filesystems.',
  du: 'du (Disk Usage) shows how much space files and directories use. du -sh * shows sizes of all items in current directory. Very useful for finding what\'s eating disk space.',
  tar: 'tar (Tape ARchive) creates and extracts archives. tar -czf = Create, gZip, Filename. tar -xzf = eXtract, gZip, Filename. The "z" flag handles gzip compression automatically.',
  history: 'history shows your command history. Use !! to repeat the last command, !n to run command number n, and Ctrl+R to search through history.',
  echo: 'echo prints text to stdout. It\'s commonly used in shell scripts. echo $VARIABLE prints environment variable values. Use -n to suppress the newline at the end.',
  man: 'man (MANual) shows documentation for commands. It\'s your best friend for learning! Navigate with arrow keys, search with /, and quit with q. Try: man ls, man chmod, man ssh.',
  pipe: 'Pipes (|) connect commands, passing output of one to input of another. This is the Unix philosophy: small programs that do one thing well, combined powerfully. Example: ps aux | grep firefox | wc -l',
};
