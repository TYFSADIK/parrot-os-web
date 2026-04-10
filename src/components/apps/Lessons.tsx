'use client';

import React, { useState } from 'react';
import { useDesktopStore } from '@/store/desktop';

interface LessonModule {
  id: string;
  title: string;
  icon: string;
  description: string;
  theory: string;
  examples: Array<{ label: string; command: string }>;
  challenge: string;
  hint: string;
  quiz: Array<{ question: string; options: string[]; answer: number }>;
}

const LESSONS: LessonModule[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: '🚀',
    description: 'Introduction to Linux and Parrot OS',
    theory: `# What is Linux?

Linux is an open-source operating system kernel created by Linus Torvalds in 1991. Unlike Windows or macOS, Linux is freely available and can be modified by anyone.

## What is Parrot OS?

Parrot OS is a Debian-based Linux distribution designed for security professionals, privacy advocates, and developers. It includes:

- **Security tools**: Pre-installed penetration testing tools
- **Privacy tools**: AnonSurf, Tor browser, and more
- **Development tools**: Compilers, interpreters, IDEs
- **MATE Desktop**: A fast, lightweight desktop environment

## The Terminal

The terminal (also called command line or shell) is the most powerful way to interact with Linux. In Parrot OS, the default shell is **bash** (Bourne Again Shell).

The terminal prompt looks like:
\`\`\`
┌──(parrot㉿parrot-os)-[~]
└─$ _
\`\`\`

- **parrot** = username
- **parrot-os** = hostname
- **~** = current directory (~ means home)
- **$** = you're a regular user (# means root)

## Why Use the Terminal?

1. **Speed**: Many tasks are faster via terminal
2. **Power**: More control and options
3. **Automation**: Scripts can automate repetitive tasks
4. **Remote access**: SSH into remote systems
5. **Learning**: Essential for security work`,
    examples: [
      { label: 'Print working directory', command: 'pwd' },
      { label: 'List files', command: 'ls' },
      { label: 'System info', command: 'neofetch' },
    ],
    challenge: 'Open the terminal and run the `neofetch` command to see system information.',
    hint: 'Type "neofetch" in the terminal and press Enter.',
    quiz: [
      {
        question: 'What does the ~ symbol mean in the terminal prompt?',
        options: ['Root directory', 'Home directory', 'Current directory', 'Parent directory'],
        answer: 1,
      },
      {
        question: 'What does $ in the prompt indicate?',
        options: ['Dollar amount', 'Root user', 'Regular user', 'Superuser'],
        answer: 2,
      },
      {
        question: 'Who created the Linux kernel?',
        options: ['Bill Gates', 'Linus Torvalds', 'Richard Stallman', 'Dennis Ritchie'],
        answer: 1,
      },
    ],
  },
  {
    id: 'navigation',
    title: 'Navigation',
    icon: '🧭',
    description: 'Navigate the filesystem with pwd, ls, and cd',
    theory: `# Navigating the Linux Filesystem

Linux uses a hierarchical filesystem starting at the root (**/**).

## The Filesystem Hierarchy

\`\`\`
/
├── home/        - User home directories
│   └── parrot/  - Your home directory (~)
├── etc/         - Configuration files
├── var/         - Variable data (logs, etc.)
├── usr/         - User programs
├── tmp/         - Temporary files
├── root/        - Root user's home
└── bin/         - Essential binaries
\`\`\`

## Navigation Commands

### pwd - Print Working Directory
Shows where you are right now:
\`\`\`
$ pwd
/home/parrot
\`\`\`

### ls - List Directory Contents
Shows files and directories:
\`\`\`
$ ls              # Basic list
$ ls -l           # Long format with details
$ ls -la          # Include hidden files
$ ls -lh          # Human-readable sizes
\`\`\`

Long format explained:
\`\`\`
-rw-r--r-- 1 parrot parrot 1234 Mar 29 10:00 filename.txt
│└┘└┘└┘     │ └────┘ └────┘  │           └── filename
│ │ │ │     │   │       │    └── file size
│ │ │ │     │   │       └─── group
│ │ │ │     │   └────── owner
│ │ │ │     └── hard links
│ └─┤ └── others permissions
│   └── group permissions
└── type + owner permissions
\`\`\`

### cd - Change Directory
Move around the filesystem:
\`\`\`
$ cd /home/parrot/Documents  # Absolute path
$ cd Documents               # Relative path
$ cd ..                      # Go up one level
$ cd ~                       # Go home
$ cd -                       # Go to previous directory
\`\`\``,
    examples: [
      { label: 'Show current location', command: 'pwd' },
      { label: 'List files with details', command: 'ls -la' },
      { label: 'Go to home directory', command: 'cd ~' },
      { label: 'Show directory tree', command: 'tree /home/parrot' },
    ],
    challenge: 'Navigate to /home/parrot/Documents and list its contents.',
    hint: 'Use: cd /home/parrot/Documents && ls -la',
    quiz: [
      {
        question: 'What does `cd ..` do?',
        options: ['Goes to root', 'Goes up one level', 'Goes home', 'Lists files'],
        answer: 1,
      },
      {
        question: 'Which flag shows hidden files in ls?',
        options: ['-h', '-l', '-a', '-r'],
        answer: 2,
      },
      {
        question: 'What is the root directory in Linux?',
        options: ['/root', '/home', '/', '/usr'],
        answer: 2,
      },
    ],
  },
  {
    id: 'files-text',
    title: 'Files & Text',
    icon: '📄',
    description: 'Create, read, copy, move, and search files',
    theory: `# Working with Files

## Creating Files

**touch** - Create an empty file or update timestamps:
\`\`\`
$ touch newfile.txt
$ touch file1.txt file2.txt  # Multiple files
\`\`\`

**mkdir** - Create directories:
\`\`\`
$ mkdir mydir
$ mkdir -p path/to/nested/dir  # Create parent dirs too
\`\`\`

## Reading Files

**cat** - Display file contents:
\`\`\`
$ cat file.txt
$ cat -n file.txt  # With line numbers
\`\`\`

**head/tail** - View beginning/end of files:
\`\`\`
$ head -n 5 file.txt   # First 5 lines
$ tail -n 5 file.txt   # Last 5 lines
$ tail -f log.txt      # Follow (live updates)
\`\`\`

**less** - Paginate through files:
\`\`\`
$ less file.txt
# Navigate: space=next page, b=back, q=quit, /=search
\`\`\`

## Copying and Moving

**cp** - Copy files:
\`\`\`
$ cp source.txt dest.txt
$ cp -r sourcedir/ destdir/  # Copy directory
\`\`\`

**mv** - Move or rename files:
\`\`\`
$ mv oldname.txt newname.txt  # Rename
$ mv file.txt /tmp/           # Move to /tmp
\`\`\`

**rm** - Remove files (NO TRASH!):
\`\`\`
$ rm file.txt
$ rm -r directory/    # Remove directory
$ rm -rf /tmp/stuff/  # Force remove (CAREFUL!)
\`\`\`

## Searching

**grep** - Search for patterns:
\`\`\`
$ grep "password" /etc/passwd
$ grep -r "error" /var/log/     # Recursive
$ grep -i "linux" file.txt      # Case insensitive
$ grep -n "todo" *.txt          # Show line numbers
\`\`\`

**find** - Find files:
\`\`\`
$ find /home -name "*.txt"
$ find . -type f -newer file.txt
$ find / -size +100M
\`\`\``,
    examples: [
      { label: 'Create a file', command: 'touch /home/parrot/test.txt' },
      { label: 'View file', command: 'cat /home/parrot/Desktop/readme.txt' },
      { label: 'Search in file', command: 'grep "Parrot" /home/parrot/Desktop/readme.txt' },
      { label: 'Word count', command: 'wc -l /home/parrot/Documents/cheatsheet.md' },
    ],
    challenge: 'Create a file called "mytest.txt" in /tmp and write something to it.',
    hint: 'Use: touch /tmp/mytest.txt, then use cat or nano to add content.',
    quiz: [
      {
        question: 'Which command reads a file with line numbers?',
        options: ['cat', 'cat -n', 'ls -n', 'head -n'],
        answer: 1,
      },
      {
        question: 'What flag makes grep search recursively in directories?',
        options: ['-f', '-n', '-i', '-r'],
        answer: 3,
      },
      {
        question: 'Which command is DANGEROUS because it permanently deletes?',
        options: ['mv', 'cp', 'rm -rf', 'rmdir'],
        answer: 2,
      },
    ],
  },
  {
    id: 'permissions',
    title: 'Permissions',
    icon: '🔐',
    description: 'Understand Linux file permissions',
    theory: `# Linux File Permissions

## Permission Structure

Every file and directory has permissions for three groups:
- **u** = User (owner)
- **g** = Group
- **o** = Others (everyone else)

Each group can have three permissions:
- **r** = Read (4)
- **w** = Write (2)
- **x** = Execute (1)

## Reading Permissions

\`\`\`
-rwxr-xr--
│└┘└┘└┘
│ │ │ └── Others: r-- (read only = 4)
│ │ └──── Group: r-x (read+execute = 5)
│ └────── User: rwx (all = 7)
└──────── Type: - = file, d = directory, l = link
\`\`\`

## chmod - Change Permissions

**Numeric mode (octal):**
\`\`\`
$ chmod 755 script.sh   # rwxr-xr-x
$ chmod 644 file.txt    # rw-r--r--
$ chmod 600 private.txt # rw------- (private!)
$ chmod 777 risky.sh    # rwxrwxrwx (dangerous!)
\`\`\`

**Symbolic mode:**
\`\`\`
$ chmod +x script.sh      # Add execute for all
$ chmod u+x script.sh     # Add execute for user
$ chmod g-w file.txt      # Remove write from group
$ chmod o=r file.txt      # Others can only read
$ chmod a+r file.txt      # All can read
\`\`\`

## Common Permission Values

| Octal | Symbolic   | Use case |
|-------|------------|----------|
| 755   | rwxr-xr-x  | Programs, directories |
| 644   | rw-r--r--  | Regular files |
| 600   | rw-------  | Private files |
| 700   | rwx------  | Private scripts |
| 777   | rwxrwxrwx  | Public access (risky!) |

## chown - Change Ownership

\`\`\`
$ chown parrot file.txt           # Change owner
$ chown parrot:parrot file.txt    # Change owner and group
$ chown -R parrot:parrot dir/     # Recursive
\`\`\`

## sudo - Run as Root

\`\`\`
$ sudo apt update          # Run apt as root
$ sudo -i                  # Become root
$ sudo -u www-data command # Run as another user
\`\`\`

**Golden rule**: Never run commands as root unless necessary!`,
    examples: [
      { label: 'Check permissions', command: 'ls -la /home/parrot/' },
      { label: 'Make script executable', command: 'chmod +x /home/parrot/Desktop/readme.txt' },
      { label: 'Show my identity', command: 'id' },
      { label: 'Show groups', command: 'groups' },
    ],
    challenge: 'Use chmod to make /home/parrot/Desktop/readme.txt executable (chmod +x).',
    hint: 'Use: chmod +x /home/parrot/Desktop/readme.txt',
    quiz: [
      {
        question: 'What does chmod 755 translate to in symbolic notation?',
        options: ['rwxrwxrwx', 'rwxr-xr-x', 'rwxrw-r--', 'r-xr-xr-x'],
        answer: 1,
      },
      {
        question: 'What permission value means the owner can read and write, but nobody else?',
        options: ['600', '644', '700', '755'],
        answer: 0,
      },
      {
        question: 'What command changes file ownership?',
        options: ['chmod', 'chgrp', 'chown', 'chperm'],
        answer: 2,
      },
    ],
  },
  {
    id: 'processes',
    title: 'Processes',
    icon: '⚡',
    description: 'Manage processes and signals',
    theory: `# Process Management in Linux

## What is a Process?

A process is a running instance of a program. Every process has:
- **PID** - Process ID (unique number)
- **PPID** - Parent Process ID
- **Owner** - User who started it
- **Status** - Running, Sleeping, Zombie, etc.

## Viewing Processes

**ps** - Process snapshot:
\`\`\`
$ ps          # Current shell processes
$ ps aux      # All processes (detailed)
$ ps -ef      # All processes (full format)
$ ps aux | grep firefox  # Find specific process
\`\`\`

**top** - Interactive process viewer:
\`\`\`
$ top
# Key commands in top:
# q = quit
# k = kill process
# M = sort by memory
# P = sort by CPU
\`\`\`

**htop** - Enhanced process viewer:
\`\`\`
$ htop  # Better than top with colors and mouse support
\`\`\`

## Signals and Kill

**kill** - Send signal to process:
\`\`\`
$ kill 1234          # Send SIGTERM (graceful)
$ kill -9 1234       # Send SIGKILL (force kill)
$ kill -15 1234      # Send SIGTERM (same as default)
$ killall firefox    # Kill by name
$ pkill -9 firefox   # Kill by name with force
\`\`\`

## Common Signals

| Signal | Number | Meaning |
|--------|--------|---------|
| SIGTERM | 15 | Graceful shutdown |
| SIGKILL | 9 | Force kill (cannot be ignored) |
| SIGHUP | 1 | Reload configuration |
| SIGINT | 2 | Interrupt (Ctrl+C) |
| SIGSTOP | 19 | Pause process |
| SIGCONT | 18 | Continue process |

## Background Jobs

\`\`\`
$ command &    # Run in background
$ jobs         # List background jobs
$ bg           # Resume paused job in background
$ fg           # Bring job to foreground
$ Ctrl+Z       # Pause current process
$ nohup cmd &  # Run after logout
\`\`\``,
    examples: [
      { label: 'List all processes', command: 'ps aux' },
      { label: 'Interactive viewer', command: 'top' },
      { label: 'Process tree', command: 'pstree' },
      { label: 'List jobs', command: 'jobs' },
    ],
    challenge: 'Find the PID of the bash process using ps aux and grep.',
    hint: 'Use: ps aux | grep bash',
    quiz: [
      {
        question: 'What signal does `kill -9` send?',
        options: ['SIGTERM', 'SIGHUP', 'SIGKILL', 'SIGSTOP'],
        answer: 2,
      },
      {
        question: 'What does PID stand for?',
        options: ['Program Identifier', 'Process ID', 'Parent ID', 'Process Input Data'],
        answer: 1,
      },
      {
        question: 'Which command shows a real-time process list?',
        options: ['ps', 'ls', 'top', 'jobs'],
        answer: 2,
      },
    ],
  },
  {
    id: 'networking',
    title: 'Networking',
    icon: '🌐',
    description: 'Network tools and concepts',
    theory: `# Linux Networking

## Network Interfaces

Every network connection uses an interface:
- **lo** - Loopback (127.0.0.1)
- **eth0** - Wired Ethernet
- **wlan0** - WiFi
- **tun0** - VPN tunnel

**ip** command (modern):
\`\`\`
$ ip addr show          # Show all interfaces
$ ip addr show wlan0    # Specific interface
$ ip route show         # Routing table
$ ip link show          # Link status
\`\`\`

**ifconfig** (old):
\`\`\`
$ ifconfig             # All interfaces
$ ifconfig wlan0       # Specific interface
\`\`\`

## Testing Connectivity

**ping** - Test reachability:
\`\`\`
$ ping google.com        # Continuous ping
$ ping -c 4 google.com   # Send 4 packets
$ ping -i 2 host         # 2 second interval
\`\`\`

## Port Scanning and Enumeration

**netstat/ss** - Show connections:
\`\`\`
$ netstat -tulpn    # Listening ports
$ ss -tulpn         # Same with ss (faster)
$ netstat -an       # All connections
\`\`\`

**nmap** - Network scanner:
\`\`\`
$ nmap localhost            # Basic scan
$ nmap -sV 192.168.1.0/24  # Version detection on subnet
$ nmap -sC -sV target.com  # Script scan + version
$ nmap -A target.com        # Aggressive (all options)
$ nmap -p 80,443 target.com # Specific ports
\`\`\`

## DNS Tools

\`\`\`
$ dig google.com        # DNS lookup
$ dig google.com MX     # MX records
$ nslookup google.com   # Another DNS tool
$ host google.com       # Simple lookup
$ whois example.com     # Domain registration info
\`\`\`

## File Transfer

\`\`\`
$ curl https://example.com           # Fetch URL
$ curl -O https://example.com/file   # Download file
$ wget https://example.com/file      # Download file
$ scp file.txt user@host:/path/      # Secure copy
\`\`\``,
    examples: [
      { label: 'Show IP addresses', command: 'ip addr show' },
      { label: 'Test connectivity', command: 'ping -c 4 localhost' },
      { label: 'Show open ports', command: 'netstat -tulpn' },
      { label: 'DNS lookup', command: 'dig google.com' },
    ],
    challenge: 'Scan localhost with nmap to see what ports are open.',
    hint: 'Use: nmap localhost',
    quiz: [
      {
        question: 'What is the loopback IP address?',
        options: ['192.168.1.1', '10.0.0.1', '127.0.0.1', '0.0.0.0'],
        answer: 2,
      },
      {
        question: 'What does nmap -sV do?',
        options: ['Stealth scan', 'Version detection', 'Verbose output', 'Scan vulnerabilities'],
        answer: 1,
      },
      {
        question: 'Which command shows listening ports?',
        options: ['ping', 'dig', 'netstat -tulpn', 'curl'],
        answer: 2,
      },
    ],
  },
  {
    id: 'packages',
    title: 'Package Management',
    icon: '📦',
    description: 'Install and manage software with apt',
    theory: `# Package Management in Parrot OS

Parrot OS uses APT (Advanced Package Tool) for software management. Software is distributed in **.deb** packages.

## The APT Workflow

\`\`\`
sudo apt update          # 1. Refresh package list
sudo apt upgrade         # 2. Upgrade installed packages
sudo apt install <pkg>   # 3. Install new package
sudo apt remove <pkg>    # 4. Remove package
sudo apt autoremove      # 5. Remove unused packages
\`\`\`

## Common APT Commands

\`\`\`
# Update package database
sudo apt update

# See what can be upgraded
apt list --upgradable

# Install a package
sudo apt install nmap

# Install multiple packages
sudo apt install nmap wireshark python3-pip

# Remove a package
sudo apt remove nmap

# Remove package AND config files
sudo apt purge nmap

# Search for packages
apt search network scanner
apt search nmap

# Show package info
apt show nmap

# List installed packages
apt list --installed
dpkg -l
\`\`\`

## Understanding Repositories

Repositories (repos) are servers hosting packages:
\`\`\`
$ cat /etc/apt/sources.list
\`\`\`

Parrot OS repos include:
- **parrot** - Parrot-specific packages
- **debian** - Debian base packages
- **security** - Security updates

## dpkg - Low-level Package Tool

\`\`\`
dpkg -l               # List installed packages
dpkg -l | grep nmap   # Search installed
dpkg -i package.deb   # Install .deb file directly
dpkg -r package       # Remove package
dpkg --contents pkg.deb  # List contents
\`\`\`

## pip - Python Package Manager

\`\`\`
pip install requests    # Install Python package
pip list               # List installed
pip uninstall package  # Remove package
pip search <query>     # Search packages
\`\`\``,
    examples: [
      { label: 'Update package list', command: 'apt update' },
      { label: 'Search for nmap', command: 'apt search nmap' },
      { label: 'Show nmap info', command: 'apt show nmap' },
      { label: 'List installed', command: 'dpkg -l' },
    ],
    challenge: 'Search for the "wireshark" package and view its information.',
    hint: 'Use: apt search wireshark, then: apt show wireshark',
    quiz: [
      {
        question: 'What does `apt update` do?',
        options: ['Upgrades all packages', 'Refreshes package list', 'Installs updates', 'Fixes broken packages'],
        answer: 1,
      },
      {
        question: 'How do you install a package called "nmap"?',
        options: ['apt get nmap', 'sudo apt install nmap', 'install nmap', 'apt-add nmap'],
        answer: 1,
      },
      {
        question: 'What file format do Debian packages use?',
        options: ['.rpm', '.pkg', '.deb', '.tar.gz'],
        answer: 2,
      },
    ],
  },
  {
    id: 'security-tools',
    title: 'Security Tools',
    icon: '🔒',
    description: 'Overview of Parrot OS security tools',
    theory: `# Parrot OS Security Tools

⚠️ **IMPORTANT**: These tools are for AUTHORIZED security testing only.
Never use these tools on systems you don't own or lack written permission to test.

## Categories of Security Tools

### Information Gathering
- **nmap** - Network scanning and host discovery
- **whois** - Domain registration info
- **dig/nslookup** - DNS information
- **maltego** - Visual link analysis
- **shodan** - Internet-connected device search

### Vulnerability Analysis
- **nikto** - Web vulnerability scanner
- **lynis** - Security auditing tool
- **nessus** - Professional vulnerability scanner

### Exploitation
- **Metasploit** - Exploitation framework
- **sqlmap** - SQL injection testing
- **BeEF** - Browser exploitation

### Password Attacks
- **hydra** - Online password brute-forcing
- **john** (John the Ripper) - Password cracking
- **hashcat** - GPU-accelerated hash cracking
- **crunch** - Wordlist generator

### Wireless
- **aircrack-ng** - Wireless security assessment
- **kismet** - Wireless network detector
- **wifite** - Automated wireless auditing

### Sniffing & Spoofing
- **Wireshark** - Network protocol analyzer
- **tcpdump** - Command-line packet analyzer
- **Ettercap** - Network sniffer/MITM

### Forensics
- **Autopsy** - Digital forensics platform
- **Volatility** - Memory forensics
- **binwalk** - Firmware analysis

## Responsible Use

1. **Get written authorization** before any testing
2. **Document everything** you do during tests
3. **Report findings** to the system owner
4. **Never access** personal data unnecessarily
5. **Follow** the code of ethics for security professionals

## Learning Resources

- **HackTheBox** (hackthebox.com) - Legal practice environment
- **TryHackMe** (tryhackme.com) - Guided security training
- **VulnHub** - Downloadable vulnerable VMs
- **OverTheWire** - Linux wargames
- **CTF competitions** - Capture The Flag events`,
    examples: [
      { label: 'Basic nmap scan', command: 'nmap localhost' },
      { label: 'Nmap with version detection', command: 'nmap -sV localhost' },
      { label: 'Nikto help', command: 'nikto --help' },
      { label: 'Show network connections', command: 'ss -tulpn' },
    ],
    challenge: 'Run a basic nmap scan on localhost and identify open ports.',
    hint: 'Use: nmap localhost',
    quiz: [
      {
        question: 'What is required before performing a penetration test?',
        options: ['Root access', 'Written authorization', 'Kali Linux', 'VPN connection'],
        answer: 1,
      },
      {
        question: 'Which tool is used for SQL injection testing?',
        options: ['hydra', 'nmap', 'sqlmap', 'nikto'],
        answer: 2,
      },
      {
        question: 'What does Wireshark do?',
        options: ['Scan networks', 'Crack passwords', 'Analyze network traffic', 'Find vulnerabilities'],
        answer: 2,
      },
    ],
  },
  {
    id: 'shell-scripting',
    title: 'Shell Scripting',
    icon: '📝',
    description: 'Write bash scripts to automate tasks',
    theory: `# Shell Scripting Basics

Shell scripts let you automate repetitive tasks by combining commands.

## Your First Script

Create a file with **.sh** extension:
\`\`\`bash
#!/bin/bash
# This is a comment
echo "Hello, World!"
\`\`\`

The **shebang** (\`#!/bin/bash\`) tells the OS which interpreter to use.

Make it executable and run:
\`\`\`
chmod +x hello.sh
./hello.sh
\`\`\`

## Variables

\`\`\`bash
# Define variable (no spaces around =!)
NAME="Parrot"
AGE=5

# Use variable with $
echo "Hello, $NAME!"
echo "OS age: $\{AGE} years"

# Command substitution
CURRENT_DATE=$(date)
echo "Today is: $CURRENT_DATE"

# Read from user
read -p "Enter your name: " USER_NAME
echo "Hello, $USER_NAME!"
\`\`\`

## Conditionals

\`\`\`bash
if [ -f file.txt ]; then
  echo "File exists!"
elif [ -d directory ]; then
  echo "It's a directory"
else
  echo "Neither"
fi

# Comparison operators
if [ $NUM -eq 5 ]; then   # Equal
if [ $NUM -ne 5 ]; then   # Not equal
if [ $NUM -lt 5 ]; then   # Less than
if [ $NUM -gt 5 ]; then   # Greater than
if [ "$STR" = "hello" ]; # String equal
\`\`\`

## Loops

\`\`\`bash
# For loop
for i in {1..5}; do
  echo "Number: $i"
done

# While loop
COUNT=0
while [ $COUNT -lt 5 ]; do
  echo "Count: $COUNT"
  ((COUNT++))
done

# Loop over files
for file in *.txt; do
  echo "Processing: $file"
done
\`\`\`

## Functions

\`\`\`bash
# Define function
greet() {
  local name=$1  # $1 = first argument
  echo "Hello, $name!"
}

# Call function
greet "Parrot"
greet "World"

# Return values
add() {
  echo $(( $1 + $2 ))
}
RESULT=$(add 5 3)
echo "5 + 3 = $RESULT"
\`\`\`

## Useful Patterns

\`\`\`bash
# Check if root
if [ $(id -u) -ne 0 ]; then
  echo "This script must be run as root"
  exit 1
fi

# Process command-line arguments
echo "Script name: $0"
echo "First arg: $1"
echo "All args: $@"
echo "Arg count: $#"
\`\`\``,
    examples: [
      { label: 'Echo a variable', command: 'echo "Hello, $USER!"' },
      { label: 'Show date', command: 'date "+%Y-%m-%d %H:%M:%S"' },
      { label: 'Command substitution', command: 'echo "You are: $(whoami)"' },
      { label: 'Sequence loop', command: 'for i in $(seq 1 5); do echo "Item $i"; done' },
    ],
    challenge: 'Create a script that prints the current date and disk usage.',
    hint: 'Use: echo "Date: $(date)" && echo "Disk: $(df -h /)"',
    quiz: [
      {
        question: 'What is the shebang line?',
        options: ['#!/usr/bin/env', '#!/bin/bash', '#! shell script', '# beginning'],
        answer: 1,
      },
      {
        question: 'How do you access the first argument in a bash script?',
        options: ['$0', '$1', '$FIRST', 'args[0]'],
        answer: 1,
      },
      {
        question: 'What does `chmod +x script.sh` do?',
        options: ['Creates the script', 'Makes it executable', 'Runs the script', 'Copies the script'],
        answer: 1,
      },
    ],
  },
  {
    id: 'parrot-tools',
    title: 'Parrot Tools',
    icon: '🦜',
    description: 'Specific Parrot OS tools and features',
    theory: `# Parrot OS Unique Features

## AnonSurf - Anonymous Browsing

AnonSurf routes all traffic through Tor network:
\`\`\`
$ sudo anonsurf start   # Start anonymization
$ sudo anonsurf status  # Check status
$ sudo anonsurf stop    # Stop
$ sudo anonsurf change  # Change Tor circuit
\`\`\`

## Parrot Updater

\`\`\`
# Update system
$ sudo parrot-upgrade

# Or use apt
$ sudo apt update && sudo apt full-upgrade
\`\`\`

## Included Security Tool Categories

### Web Application Testing
- **Burp Suite** - Web application security testing
- **OWASP ZAP** - Web vulnerability scanner
- **sqlmap** - SQL injection
- **nikto** - Web server scanning
- **dirb/gobuster** - Directory brute-forcing

### Network Forensics
- **Wireshark** - Packet analysis
- **tcpdump** - Command-line capture
- **NetworkMiner** - Network forensics

### Exploit Development
- **gdb-peda** - Enhanced GDB
- **pwndbg** - GDB plugin for exploit dev
- **ROPgadget** - ROP chain building
- **pwntools** - CTF framework

### OSINT Tools
- **maltego** - Link analysis
- **recon-ng** - Reconnaissance framework
- **theHarvester** - Email/domain harvesting
- **Shodan** - IoT search engine

### Mobile Security
- **apktool** - APK reverse engineering
- **jadx** - Java decompiler
- **MobSF** - Mobile security framework

## Parrot OS Terminal Features

The Parrot terminal includes:
- Custom prompt with git integration
- Color-coded output
- Auto-completion
- Command history search (Ctrl+R)

## Useful Parrot Shortcuts

\`\`\`
# Quick scans
alias full-scan='nmap -A -T4'
alias web-scan='nikto -h'
alias pass-audit='john --wordlist=/usr/share/wordlists/rockyou.txt'

# Network shortcuts
alias myip='curl ifconfig.me'
alias ports='netstat -tulpn'
alias scan='nmap -sV -sC'

# Common paths
/usr/share/wordlists/      # Password lists
/usr/share/nmap/           # Nmap scripts
/usr/share/metasploit-framework/  # Metasploit
\`\`\`

## Practice Environments

1. **Metasploitable** - Intentionally vulnerable Linux
2. **DVWA** - Damn Vulnerable Web Application
3. **HackTheBox** - Online hacking platform
4. **TryHackMe** - Guided security training
5. **VulnHub** - Vulnerable VM downloads`,
    examples: [
      { label: 'Check IP address', command: 'ip addr show' },
      { label: 'Network scan', command: 'nmap -sV localhost' },
      { label: 'System info', command: 'neofetch' },
      { label: 'View Parrot version', command: 'lsb_release -a' },
    ],
    challenge: 'Use lsb_release -a to check which version of Parrot OS is running.',
    hint: 'Type: lsb_release -a',
    quiz: [
      {
        question: 'What does AnonSurf do in Parrot OS?',
        options: ['Encrypts files', 'Routes traffic through Tor', 'Scans for viruses', 'Updates the system'],
        answer: 1,
      },
      {
        question: 'Where are wordlists stored in Parrot OS?',
        options: ['/etc/passwords', '/usr/share/wordlists', '/root/lists', '/home/lists'],
        answer: 1,
      },
      {
        question: 'Which tool is used for web application security testing?',
        options: ['nmap', 'Burp Suite', 'Wireshark', 'john'],
        answer: 1,
      },
    ],
  },
];

export default function Lessons() {
  const { lessonProgress, updateLessonProgress, openWindow } = useDesktopStore();
  const [selectedModule, setSelectedModule] = useState<LessonModule | null>(null);
  const [activeSection, setActiveSection] = useState<'theory' | 'examples' | 'challenge' | 'quiz'>('theory');
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const getProgress = (moduleId: string) => {
    return lessonProgress[moduleId] || 0;
  };

  const handleModuleSelect = (module: LessonModule) => {
    setSelectedModule(module);
    setActiveSection('theory');
    setQuizAnswers({});
    setQuizSubmitted(false);
    setShowHint(false);
  };

  const handleSectionComplete = (section: 'theory' | 'examples' | 'challenge' | 'quiz') => {
    if (!selectedModule) return;
    const sectionIndex = ['theory', 'examples', 'challenge', 'quiz'].indexOf(section) + 1;
    updateLessonProgress(selectedModule.id, sectionIndex);
  };

  const handleRunCommand = (command: string) => {
    // Open terminal and send command (visual only - opens terminal)
    openWindow('terminal');
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    const allCorrect = selectedModule?.quiz.every(
      (q, i) => quizAnswers[i] === q.answer
    );
    if (allCorrect) {
      handleSectionComplete('quiz');
    }
  };

  const getQuizScore = () => {
    if (!selectedModule) return 0;
    return selectedModule.quiz.filter((q, i) => quizAnswers[i] === q.answer).length;
  };

  if (!selectedModule) {
    return (
      <div className="flex flex-col h-full bg-parrot-bg text-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-parrot-panel border-b border-parrot-border">
          <h1 className="text-xl font-bold text-parrot-accent">Linux Lessons</h1>
          <p className="text-sm text-gray-400 mt-1">
            Learn Linux from the ground up. Complete all 10 modules to master the basics.
          </p>
        </div>

        {/* Progress overview */}
        <div className="px-6 py-3 bg-parrot-surface/20 border-b border-parrot-border flex items-center gap-4">
          <div className="text-sm text-gray-400">
            Progress: {LESSONS.filter(l => getProgress(l.id) >= 4).length}/{LESSONS.length} completed
          </div>
          <div className="flex-1 bg-parrot-border rounded-full h-2">
            <div
              className="h-2 rounded-full bg-parrot-accent transition-all"
              style={{ width: `${(LESSONS.filter(l => getProgress(l.id) >= 4).length / LESSONS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Module list */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {LESSONS.map((module, idx) => {
            const progress = getProgress(module.id);
            const completed = progress >= 4;
            return (
              <div
                key={module.id}
                className={`lesson-card p-4 rounded-lg bg-parrot-panel cursor-pointer ${completed ? 'completed' : ''}`}
                onClick={() => handleModuleSelect(module)}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{module.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Module {idx + 1}</span>
                      {completed && <span className="text-xs text-parrot-accent">✓ Completed</span>}
                    </div>
                    <h3 className="font-semibold text-white">{module.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{module.description}</p>

                    {/* Progress dots */}
                    <div className="flex gap-1 mt-2">
                      {['Theory', 'Examples', 'Challenge', 'Quiz'].map((s, si) => (
                        <div
                          key={s}
                          className={`w-2 h-2 rounded-full ${
                            progress > si ? 'bg-parrot-accent' : 'bg-parrot-border'
                          }`}
                          title={s}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-parrot-bg text-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-parrot-panel border-b border-parrot-border">
        <button
          onClick={() => setSelectedModule(null)}
          className="text-parrot-accent hover:text-parrot-accent-dark text-sm"
        >
          ← Back
        </button>
        <span className="text-xl">{selectedModule.icon}</span>
        <div>
          <h2 className="font-bold text-white text-sm">{selectedModule.title}</h2>
          <p className="text-xs text-gray-400">{selectedModule.description}</p>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex border-b border-parrot-border bg-parrot-panel">
        {(['theory', 'examples', 'challenge', 'quiz'] as const).map((section, idx) => {
          const progress = getProgress(selectedModule.id);
          const done = progress > idx;
          return (
            <button
              key={section}
              onClick={() => { setActiveSection(section); }}
              className={`px-4 py-2 text-xs capitalize border-b-2 transition-colors ${
                activeSection === section
                  ? 'border-parrot-accent text-parrot-accent'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              } ${done ? 'after:content-["✓"] after:ml-1 after:text-parrot-accent' : ''}`}
            >
              {section} {done ? '✓' : ''}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeSection === 'theory' && (
          <div>
            <div
              className="prose prose-invert max-w-none text-sm leading-relaxed"
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {/* Render markdown-like content */}
              {selectedModule.theory.split('\n').map((line, i) => {
                if (line.startsWith('# ')) {
                  return <h1 key={i} className="text-parrot-accent text-xl font-bold mt-4 mb-2">{line.slice(2)}</h1>;
                }
                if (line.startsWith('## ')) {
                  return <h2 key={i} className="text-parrot-accent text-lg font-semibold mt-4 mb-2">{line.slice(3)}</h2>;
                }
                if (line.startsWith('### ')) {
                  return <h3 key={i} className="text-white font-semibold mt-3 mb-1">{line.slice(4)}</h3>;
                }
                if (line.startsWith('```')) {
                  return null;
                }
                if (line.startsWith('- **')) {
                  const match = line.match(/- \*\*([^*]+)\*\* - (.*)/);
                  if (match) {
                    return (
                      <div key={i} className="flex gap-2 text-sm">
                        <span className="text-yellow-400 font-mono">{match[1]}</span>
                        <span className="text-gray-300">- {match[2]}</span>
                      </div>
                    );
                  }
                }
                if (line.startsWith('$ ')) {
                  return (
                    <div key={i} className="font-mono text-parrot-accent bg-parrot-terminal/50 px-2 py-0.5 rounded text-xs">
                      {line}
                    </div>
                  );
                }
                if (line.trim() === '') return <div key={i} className="h-2" />;
                return <p key={i} className="text-sm text-gray-300">{line}</p>;
              })}
            </div>
            <button
              onClick={() => { handleSectionComplete('theory'); setActiveSection('examples'); }}
              className="mt-6 px-4 py-2 bg-parrot-accent text-parrot-bg rounded text-sm hover:bg-parrot-accent-dark font-medium"
            >
              Next: Examples →
            </button>
          </div>
        )}

        {activeSection === 'examples' && (
          <div>
            <h3 className="font-semibold text-white mb-4">Interactive Examples</h3>
            <p className="text-sm text-gray-400 mb-6">
              Click "Run" to open a terminal with this command pre-filled, or copy and paste it yourself.
            </p>
            <div className="space-y-3">
              {selectedModule.examples.map((example, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-parrot-panel rounded-lg border border-parrot-border">
                  <div className="flex-1">
                    <div className="text-xs text-gray-400 mb-1">{example.label}</div>
                    <code className="text-parrot-accent font-mono text-sm">{example.command}</code>
                  </div>
                  <button
                    onClick={() => handleRunCommand(example.command)}
                    className="px-3 py-1.5 bg-parrot-accent text-parrot-bg rounded text-xs hover:bg-parrot-accent-dark font-medium whitespace-nowrap"
                  >
                    Open Terminal
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => { handleSectionComplete('examples'); setActiveSection('challenge'); }}
              className="mt-6 px-4 py-2 bg-parrot-accent text-parrot-bg rounded text-sm hover:bg-parrot-accent-dark font-medium"
            >
              Next: Challenge →
            </button>
          </div>
        )}

        {activeSection === 'challenge' && (
          <div>
            <h3 className="font-semibold text-white mb-4">Challenge</h3>
            <div className="p-4 bg-parrot-panel border border-parrot-accent/30 rounded-lg mb-4">
              <p className="text-sm text-gray-200">{selectedModule.challenge}</p>
            </div>

            {showHint ? (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg mb-4">
                <p className="text-sm text-yellow-300">💡 Hint: {selectedModule.hint}</p>
              </div>
            ) : (
              <button
                onClick={() => setShowHint(true)}
                className="mb-4 px-3 py-1.5 border border-parrot-border text-gray-400 rounded text-xs hover:border-parrot-accent hover:text-parrot-accent"
              >
                Show Hint
              </button>
            )}

            <button
              onClick={() => openWindow('terminal')}
              className="block mb-6 px-4 py-2 bg-parrot-surface border border-parrot-accent/30 text-parrot-accent rounded text-sm hover:bg-parrot-surface/80"
            >
              Open Terminal
            </button>

            <button
              onClick={() => { handleSectionComplete('challenge'); setActiveSection('quiz'); }}
              className="px-4 py-2 bg-parrot-accent text-parrot-bg rounded text-sm hover:bg-parrot-accent-dark font-medium"
            >
              I completed the challenge → Take Quiz
            </button>
          </div>
        )}

        {activeSection === 'quiz' && (
          <div>
            <h3 className="font-semibold text-white mb-4">Quiz</h3>
            {quizSubmitted ? (
              <div className={`p-4 rounded-lg mb-6 ${
                getQuizScore() === selectedModule.quiz.length
                  ? 'bg-green-500/10 border border-green-500/30'
                  : 'bg-yellow-500/10 border border-yellow-500/30'
              }`}>
                <p className="font-semibold">
                  Score: {getQuizScore()}/{selectedModule.quiz.length}
                </p>
                <p className="text-sm mt-1">
                  {getQuizScore() === selectedModule.quiz.length
                    ? '🎉 Perfect score! Module completed!'
                    : '📚 Review the theory and try again.'}
                </p>
              </div>
            ) : null}

            <div className="space-y-6">
              {selectedModule.quiz.map((q, qi) => (
                <div key={qi} className="p-4 bg-parrot-panel rounded-lg border border-parrot-border">
                  <p className="font-medium mb-3 text-sm">{qi + 1}. {q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((option, oi) => {
                      const isSelected = quizAnswers[qi] === oi;
                      const isCorrect = oi === q.answer;
                      let className = 'w-full text-left px-3 py-2 rounded border text-sm transition-colors ';
                      if (quizSubmitted) {
                        if (isCorrect) className += 'bg-green-500/20 border-green-500/50 text-green-300';
                        else if (isSelected) className += 'bg-red-500/20 border-red-500/50 text-red-300';
                        else className += 'border-parrot-border text-gray-400';
                      } else {
                        className += isSelected
                          ? 'bg-parrot-accent/20 border-parrot-accent text-parrot-accent'
                          : 'border-parrot-border hover:border-parrot-accent/50 hover:bg-parrot-surface';
                      }
                      return (
                        <button
                          key={oi}
                          className={className}
                          onClick={() => !quizSubmitted && setQuizAnswers(prev => ({ ...prev, [qi]: oi }))}
                          disabled={quizSubmitted}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {!quizSubmitted ? (
              <button
                onClick={handleQuizSubmit}
                disabled={Object.keys(quizAnswers).length < selectedModule.quiz.length}
                className="mt-6 px-4 py-2 bg-parrot-accent text-parrot-bg rounded text-sm hover:bg-parrot-accent-dark font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Quiz
              </button>
            ) : (
              <div className="mt-6 flex gap-3">
                {getQuizScore() < selectedModule.quiz.length && (
                  <button
                    onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); }}
                    className="px-4 py-2 border border-parrot-border text-gray-300 rounded text-sm hover:border-parrot-accent"
                  >
                    Retry Quiz
                  </button>
                )}
                <button
                  onClick={() => setSelectedModule(null)}
                  className="px-4 py-2 bg-parrot-accent text-parrot-bg rounded text-sm hover:bg-parrot-accent-dark font-medium"
                >
                  Back to Modules
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
