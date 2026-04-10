export interface FSNode {
  type: 'file' | 'directory';
  name: string;
  content?: string;
  children?: Record<string, FSNode>;
  permissions?: string;
  owner?: string;
  group?: string;
  size?: number;
  modified?: string;
}

export const defaultFilesystem: FSNode = {
  type: 'directory',
  name: '/',
  permissions: 'drwxr-xr-x',
  owner: 'root',
  group: 'root',
  modified: 'Jan 15 09:00',
  children: {
    home: {
      type: 'directory',
      name: 'home',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      group: 'root',
      modified: 'Jan 15 09:00',
      children: {
        parrot: {
          type: 'directory',
          name: 'parrot',
          permissions: 'drwxr-xr-x',
          owner: 'parrot',
          group: 'parrot',
          modified: 'Mar 29 10:00',
          children: {
            Desktop: {
              type: 'directory',
              name: 'Desktop',
              permissions: 'drwxr-xr-x',
              owner: 'parrot',
              group: 'parrot',
              modified: 'Mar 29 10:00',
              children: {
                'readme.txt': {
                  type: 'file',
                  name: 'readme.txt',
                  permissions: '-rw-r--r--',
                  owner: 'parrot',
                  group: 'parrot',
                  modified: 'Mar 29 10:00',
                  content: `Welcome to Parrot OS!
This is a simulated Parrot OS desktop environment.
Type 'help' in the terminal to get started.

Parrot OS is a Debian-based Linux distribution focused on
security, development, and privacy.

Key features:
- Security and penetration testing tools
- Privacy-focused applications
- Development environment
- MATE desktop environment
- Based on Debian Testing

Visit https://parrotsec.org for more information.`,
                },
                'notes.txt': {
                  type: 'file',
                  name: 'notes.txt',
                  permissions: '-rw-r--r--',
                  owner: 'parrot',
                  group: 'parrot',
                  modified: 'Mar 28 14:22',
                  content: `My Notes
========
TODO: Learn Linux commands
- Practice with the terminal
- Complete all lessons
- Try the security tools

Commands to learn:
- ls, cd, pwd (navigation)
- cat, grep, find (file operations)
- chmod, chown (permissions)
- ps, top, kill (processes)
- nmap, netstat (networking)
- apt, dpkg (package management)

Resources:
- man pages (man <command>)
- tldr pages
- OverTheWire wargames
- HackTheBox`,
                },
              },
            },
            Documents: {
              type: 'directory',
              name: 'Documents',
              permissions: 'drwxr-xr-x',
              owner: 'parrot',
              group: 'parrot',
              modified: 'Mar 27 16:45',
              children: {
                'cheatsheet.md': {
                  type: 'file',
                  name: 'cheatsheet.md',
                  permissions: '-rw-r--r--',
                  owner: 'parrot',
                  group: 'parrot',
                  modified: 'Mar 26 11:30',
                  content: `# Linux Command Cheat Sheet

## Navigation
\`\`\`
pwd          - Print working directory
ls           - List directory contents
ls -la       - List with details and hidden files
cd <dir>     - Change directory
cd ..        - Go up one level
cd ~         - Go to home directory
cd -         - Go to previous directory
\`\`\`

## File Operations
\`\`\`
touch <file>          - Create empty file
cat <file>            - Display file contents
cp <src> <dst>        - Copy file
mv <src> <dst>        - Move/rename file
rm <file>             - Remove file
rm -rf <dir>          - Remove directory recursively
mkdir <dir>           - Create directory
mkdir -p <path>       - Create nested directories
rmdir <dir>           - Remove empty directory
\`\`\`

## Text Processing
\`\`\`
grep <pattern> <file> - Search for pattern
grep -r <pattern> .   - Recursive search
grep -i <pattern>     - Case insensitive
find . -name "*.txt"  - Find files by name
find . -type f        - Find only files
find . -type d        - Find only directories
sed 's/old/new/g'     - Replace text
awk '{print $1}'      - Print first column
cut -d: -f1           - Cut by delimiter
sort <file>           - Sort lines
uniq <file>           - Remove duplicates
wc -l <file>          - Count lines
\`\`\`

## Permissions
\`\`\`
chmod 755 <file>      - Set permissions (rwxr-xr-x)
chmod +x <file>       - Make executable
chown user:group file - Change ownership
ls -la                - View permissions
id                    - Show current user info
sudo <command>        - Run as root
\`\`\`

## Processes
\`\`\`
ps aux               - List all processes
top                  - Interactive process viewer
htop                 - Better process viewer
kill <pid>           - Kill process by PID
killall <name>       - Kill by name
jobs                 - List background jobs
bg                   - Resume in background
fg                   - Bring to foreground
\`\`\`

## Networking
\`\`\`
ip addr              - Show IP addresses
ip route             - Show routing table
ping <host>          - Test connectivity
netstat -tulpn       - Show listening ports
ss -tulpn            - Socket statistics
nmap <host>          - Network scanning
curl <url>           - Transfer data from URL
wget <url>           - Download file
ssh user@host        - SSH connection
\`\`\`

## Package Management (Debian/Parrot)
\`\`\`
apt update           - Update package list
apt upgrade          - Upgrade packages
apt install <pkg>    - Install package
apt remove <pkg>     - Remove package
apt search <query>   - Search packages
dpkg -l              - List installed packages
dpkg -i <deb>        - Install .deb file
\`\`\`

## Disk Usage
\`\`\`
df -h                - Disk free space
du -sh <dir>         - Directory size
lsblk                - List block devices
mount                - Show mounted filesystems
free -h              - Memory usage
\`\`\`

## Compression
\`\`\`
tar -czf out.tar.gz dir/    - Create gzipped tarball
tar -xzf file.tar.gz        - Extract tarball
zip -r out.zip dir/         - Create zip
unzip file.zip              - Extract zip
gzip file                   - Compress file
gunzip file.gz              - Decompress file
\`\`\`

## Security Tools (Parrot OS)
\`\`\`
nmap -sV <target>           - Version detection scan
nmap -sC <target>           - Script scan
hydra -l user -P pass.txt   - Password brute force
hashcat -m 0 hash.txt dict  - Hash cracking
john hash.txt               - Password cracker
aircrack-ng capture.cap     - Wireless security
sqlmap -u <url>             - SQL injection testing
nikto -h <host>             - Web vulnerability scanner
\`\`\`

## Shell Scripting
\`\`\`bash
#!/bin/bash
# Variables
NAME="Parrot"
echo "Hello, $NAME!"

# Conditionals
if [ -f file.txt ]; then
  echo "File exists"
fi

# Loops
for i in {1..5}; do
  echo "Number: $i"
done

# Functions
greet() {
  echo "Hello, $1!"
}
greet "World"
\`\`\`
`,
                },
                'passwords.txt': {
                  type: 'file',
                  name: 'passwords.txt',
                  permissions: '-rw-------',
                  owner: 'parrot',
                  group: 'parrot',
                  modified: 'Mar 20 09:15',
                  content: `# This file intentionally left as example
# Never store real passwords in plaintext!
# Use a password manager like KeePassXC instead

hash_example: 5f4dcc3b5aa765d61d8327deb882cf99
# Above hash is MD5 of "password" - very weak!

# Better practices:
# - Use unique passwords for each service
# - Enable 2FA wherever possible
# - Use password managers
# - Minimum 16 characters
# - Mix letters, numbers, symbols`,
                },
              },
            },
            Downloads: {
              type: 'directory',
              name: 'Downloads',
              permissions: 'drwxr-xr-x',
              owner: 'parrot',
              group: 'parrot',
              modified: 'Mar 25 13:00',
              children: {
                'kali-linux-readme.txt': {
                  type: 'file',
                  name: 'kali-linux-readme.txt',
                  permissions: '-rw-r--r--',
                  owner: 'parrot',
                  group: 'parrot',
                  modified: 'Mar 25 13:00',
                  content: `Kali Linux vs Parrot OS - A Comparison
=======================================

Both are Debian-based security-focused Linux distributions,
but they have different philosophies and target audiences.

KALI LINUX:
- Developed by Offensive Security
- Focused purely on penetration testing
- Over 600 security tools pre-installed
- RAM: Minimum 2GB (recommended 4GB+)
- Best for: Professional penetration testers

PARROT OS:
- Developed by Parrot Security
- Balanced approach: security + privacy + development
- More lightweight than Kali
- RAM: Minimum 512MB (recommended 2GB+)
- Better daily driver experience
- Privacy tools included (Tor, AnonSurf)
- Development tools included

KEY ADVANTAGES OF PARROT OS:
1. More lightweight and faster
2. Better for daily use (not just pentesting)
3. AnonSurf for anonymization
4. Parrot Home edition for general use
5. Better MATE desktop customization
6. More privacy-focused

EDITIONS:
- Parrot Security - Full security suite
- Parrot Home - General use
- Parrot HTB - HackTheBox edition
- Parrot Cloud - Minimal for servers

Website: https://parrotsec.org
Downloads: https://parrotsec.org/download`,
                },
              },
            },
            Pictures: {
              type: 'directory',
              name: 'Pictures',
              permissions: 'drwxr-xr-x',
              owner: 'parrot',
              group: 'parrot',
              modified: 'Jan 15 09:00',
              children: {
                '.gitkeep': {
                  type: 'file',
                  name: '.gitkeep',
                  permissions: '-rw-r--r--',
                  owner: 'parrot',
                  group: 'parrot',
                  modified: 'Jan 15 09:00',
                  content: '',
                },
              },
            },
            '.bashrc': {
              type: 'file',
              name: '.bashrc',
              permissions: '-rw-r--r--',
              owner: 'parrot',
              group: 'parrot',
              modified: 'Mar 29 10:00',
              content: `# ~/.bashrc: executed by bash(1) for non-login shells.

# If not running interactively, don't do anything
case $- in
    *i*) ;;
      *) return;;
esac

# History settings
HISTCONTROL=ignoreboth
HISTSIZE=1000
HISTFILESIZE=2000
shopt -s histappend

# Check window size after each command
shopt -s checkwinsize

# Make less more friendly for non-text input files
[ -x /usr/bin/lesspipe ] && eval "$(SHELL=/bin/sh lesspipe)"

# Set variable identifying the chroot
if [ -z "\${debian_chroot:-}" ] && [ -r /etc/debian_chroot ]; then
    debian_chroot=$(cat /etc/debian_chroot)
fi

# Color prompt
force_color_prompt=yes

if [ -n "$force_color_prompt" ]; then
    if [ -x /usr/bin/tput ] && tput setaf 1 >&/dev/null; then
        color_prompt=yes
    else
        color_prompt=
    fi
fi

# Parrot OS custom prompt
if [ "$color_prompt" = yes ]; then
    PS1='\\[\\033[0;32m\\]┌──(\\[\\033[1;32m\\]\\u㉿\\h\\[\\033[0;32m\\])-[\\[\\033[0;34m\\]\\w\\[\\033[0;32m\\]]\\n└─\\[\\033[1;32m\\]\\$\\[\\033[0m\\] '
else
    PS1='┌──(\\u㉿\\h)-[\\w]\\n└─\\$ '
fi
unset color_prompt force_color_prompt

# Aliases
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'
alias ls='ls --color=auto'
alias grep='grep --color=auto'
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'
alias update='sudo apt update && sudo apt upgrade -y'
alias install='sudo apt install'
alias remove='sudo apt remove'
alias search='apt search'
alias cls='clear'
alias ..='cd ..'
alias ...='cd ../..'
alias ports='netstat -tulpn'
alias myip='curl ifconfig.me'
alias df='df -h'
alias du='du -sh'

# Functions
extract() {
    if [ -f $1 ] ; then
        case $1 in
            *.tar.bz2)   tar xjf $1     ;;
            *.tar.gz)    tar xzf $1     ;;
            *.bz2)       bunzip2 $1     ;;
            *.rar)       unrar e $1     ;;
            *.gz)        gunzip $1      ;;
            *.tar)       tar xf $1      ;;
            *.tbz2)      tar xjf $1     ;;
            *.tgz)       tar xzf $1     ;;
            *.zip)       unzip $1       ;;
            *.Z)         uncompress $1  ;;
            *.7z)        7z x $1        ;;
            *)     echo "'$1' cannot be extracted via extract()" ;;
        esac
    else
        echo "'$1' is not a valid file"
    fi
}

# Set PATH
export PATH="$HOME/.local/bin:$PATH"

# Editor
export EDITOR=nano
export VISUAL=nano

# Load bash completions
if ! shopt -oq posix; then
  if [ -f /usr/share/bash-completion/bash_completion ]; then
    . /usr/share/bash-completion/bash_completion
  elif [ -f /etc/bash_completion ]; then
    . /etc/bash_completion
  fi
fi`,
            },
            '.profile': {
              type: 'file',
              name: '.profile',
              permissions: '-rw-r--r--',
              owner: 'parrot',
              group: 'parrot',
              modified: 'Jan 15 09:00',
              content: `# ~/.profile: executed by the command interpreter for login shells.

# if running bash
if [ -n "$BASH_VERSION" ]; then
    # include .bashrc if it exists
    if [ -f "$HOME/.bashrc" ]; then
        . "$HOME/.bashrc"
    fi
fi

# set PATH so it includes user's private bin if it exists
if [ -d "$HOME/bin" ] ; then
    PATH="$HOME/bin:$PATH"
fi

# set PATH so it includes user's private bin if it exists
if [ -d "$HOME/.local/bin" ] ; then
    PATH="$HOME/.local/bin:$PATH"
fi

# Parrot OS specific settings
export PARROT_VERSION="5.3"
export PARROT_CODENAME="Electro Ara"

# GPG
export GPG_TTY=$(tty)`,
            },
            '.bash_history': {
              type: 'file',
              name: '.bash_history',
              permissions: '-rw-------',
              owner: 'parrot',
              group: 'parrot',
              modified: 'Mar 29 09:58',
              content: `ls -la
cd Desktop
cat readme.txt
pwd
mkdir test_dir
touch test_file.txt
echo "Hello World" > test_file.txt
cat test_file.txt
rm test_file.txt
cd ..
grep -r "password" /etc/
sudo apt update
sudo apt upgrade -y
nmap -sV localhost
ip addr show
netstat -tulpn
ps aux | grep bash
find /home -name "*.txt"
chmod 755 script.sh
history`,
            },
          },
        },
      },
    },
    etc: {
      type: 'directory',
      name: 'etc',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      group: 'root',
      modified: 'Mar 29 10:00',
      children: {
        hostname: {
          type: 'file',
          name: 'hostname',
          permissions: '-rw-r--r--',
          owner: 'root',
          group: 'root',
          modified: 'Jan 15 09:00',
          content: 'parrot-os',
        },
        'os-release': {
          type: 'file',
          name: 'os-release',
          permissions: '-rw-r--r--',
          owner: 'root',
          group: 'root',
          modified: 'Jan 15 09:00',
          content: `PRETTY_NAME="Parrot OS 5.3 (Electro Ara)"
NAME="Parrot OS"
VERSION_ID="5.3"
VERSION="5.3 (Electro Ara)"
VERSION_CODENAME=electro
ID=parrot
ID_LIKE=debian
HOME_URL="https://www.parrotsec.org/"
SUPPORT_URL="https://community.parrotsec.org/"
BUG_REPORT_URL="https://www.parrotsec.org/security/"`,
        },
        passwd: {
          type: 'file',
          name: 'passwd',
          permissions: '-rw-r--r--',
          owner: 'root',
          group: 'root',
          modified: 'Jan 15 09:00',
          content: `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
systemd-network:x:100:102:systemd Network Management,,,:/run/systemd:/usr/sbin/nologin
systemd-resolve:x:101:103:systemd Resolver,,,:/run/systemd:/usr/sbin/nologin
messagebus:x:102:105::/nonexistent:/usr/sbin/nologin
sshd:x:103:65534::/run/sshd:/usr/sbin/nologin
parrot:x:1000:1000:Parrot User,,,:/home/parrot:/bin/bash`,
        },
        hosts: {
          type: 'file',
          name: 'hosts',
          permissions: '-rw-r--r--',
          owner: 'root',
          group: 'root',
          modified: 'Jan 15 09:00',
          content: `127.0.0.1       localhost
127.0.1.1       parrot-os
::1             localhost ip6-localhost ip6-loopback
ff02::1         ip6-allnodes
ff02::2         ip6-allrouters

# Custom entries
192.168.1.1     router.local
192.168.1.100   nas.local`,
        },
        fstab: {
          type: 'file',
          name: 'fstab',
          permissions: '-rw-r--r--',
          owner: 'root',
          group: 'root',
          modified: 'Jan 15 09:00',
          content: `# /etc/fstab: static file system information.
#
# Use 'blkid' to print the universally unique identifier for a
# device; this may be used with UUID= as a more robust way to name devices
# that works even if disks are added and removed.
#
# <file system> <mount point>   <type>  <options>       <dump>  <pass>
UUID=a1b2c3d4-e5f6-7890-abcd-ef1234567890 / ext4 errors=remount-ro 0 1
UUID=b2c3d4e5-f6a7-8901-bcde-f12345678901 /boot/efi vfat umask=0077 0 1
UUID=c3d4e5f6-a7b8-9012-cdef-123456789012 swap swap defaults 0 0
tmpfs /tmp tmpfs defaults,size=2G 0 0`,
        },
        apt: {
          type: 'directory',
          name: 'apt',
          permissions: 'drwxr-xr-x',
          owner: 'root',
          group: 'root',
          modified: 'Jan 15 09:00',
          children: {
            'sources.list': {
              type: 'file',
              name: 'sources.list',
              permissions: '-rw-r--r--',
              owner: 'root',
              group: 'root',
              modified: 'Jan 15 09:00',
              content: `# Parrot OS repositories
deb https://deb.parrot.sh/parrot/ lory main contrib non-free non-free-firmware
#deb-src https://deb.parrot.sh/parrot/ lory main contrib non-free non-free-firmware

# Security updates
deb https://deb.parrot.sh/parrot/ lory-security main contrib non-free non-free-firmware
#deb-src https://deb.parrot.sh/parrot/ lory-security main contrib non-free non-free-firmware

# Backports
#deb https://deb.parrot.sh/parrot/ lory-backports main contrib non-free non-free-firmware

# Debian repositories (inherited)
deb https://deb.debian.org/debian/ testing main contrib non-free non-free-firmware`,
            },
          },
        },
      },
    },
    var: {
      type: 'directory',
      name: 'var',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      group: 'root',
      modified: 'Mar 29 10:00',
      children: {
        log: {
          type: 'directory',
          name: 'log',
          permissions: 'drwxr-xr-x',
          owner: 'root',
          group: 'syslog',
          modified: 'Mar 29 10:00',
          children: {
            syslog: {
              type: 'file',
              name: 'syslog',
              permissions: '-rw-r-----',
              owner: 'syslog',
              group: 'adm',
              modified: 'Mar 29 10:00',
              content: `Mar 29 10:00:01 parrot-os kernel: Linux version 6.1.0-1parrot1-amd64 (parrot@parrot-build) (gcc-12 (Debian 12.2.0-14) 12.2.0, GNU ld (GNU Binutils for Debian) 2.40) #1 SMP PREEMPT_DYNAMIC Parrot 6.1.15-1parrot1 (2023-04-01)
Mar 29 10:00:01 parrot-os kernel: Command line: BOOT_IMAGE=/boot/vmlinuz-6.1.0-1parrot1-amd64 root=UUID=a1b2c3d4 ro quiet splash
Mar 29 10:00:01 parrot-os kernel: BIOS-provided physical RAM map:
Mar 29 10:00:01 parrot-os kernel: ACPI: RSDP 0x00000000000F05B0 000024 (v02 BOCHS )
Mar 29 10:00:02 parrot-os kernel: PCI: Using configuration type 1 for base access
Mar 29 10:00:02 parrot-os kernel: clocksource: tsc-early: mask: 0xffffffffffffffff max_cycles: 0x3162a8b1406
Mar 29 10:00:02 parrot-os systemd[1]: Started Journal Service.
Mar 29 10:00:03 parrot-os systemd[1]: Starting Load Kernel Modules...
Mar 29 10:00:03 parrot-os systemd[1]: Finished Load Kernel Modules.
Mar 29 10:00:03 parrot-os kernel: EXT4-fs (sda1): mounted filesystem with ordered data mode
Mar 29 10:00:04 parrot-os systemd[1]: Reached target Local File Systems.
Mar 29 10:00:04 parrot-os systemd[1]: Starting Network Service...
Mar 29 10:00:05 parrot-os NetworkManager[892]: <info> NetworkManager (version 1.42.4) is starting...
Mar 29 10:00:05 parrot-os NetworkManager[892]: <info> Read config: /etc/NetworkManager/NetworkManager.conf
Mar 29 10:00:06 parrot-os systemd[1]: Started Network Manager.
Mar 29 10:00:06 parrot-os NetworkManager[892]: <info> device (wlan0): state change: unmanaged -> unavailable
Mar 29 10:00:07 parrot-os kernel: wlan0: authenticate with aa:bb:cc:dd:ee:ff
Mar 29 10:00:07 parrot-os kernel: wlan0: send auth to aa:bb:cc:dd:ee:ff (try 1/3)
Mar 29 10:00:08 parrot-os kernel: wlan0: authenticated
Mar 29 10:00:08 parrot-os NetworkManager[892]: <info> device (wlan0): state change: prepare -> config
Mar 29 10:00:09 parrot-os dhclient[1247]: DHCPREQUEST for 192.168.1.105 on wlan0
Mar 29 10:00:09 parrot-os dhclient[1247]: DHCPACK of 192.168.1.105 from 192.168.1.1
Mar 29 10:00:09 parrot-os NetworkManager[892]: <info> (wlan0): IP4 address 192.168.1.105/24
Mar 29 10:00:10 parrot-os systemd[1]: Started Login Service.`,
            },
            'auth.log': {
              type: 'file',
              name: 'auth.log',
              permissions: '-rw-r-----',
              owner: 'syslog',
              group: 'adm',
              modified: 'Mar 29 10:00',
              content: `Mar 29 10:00:01 parrot-os sshd[892]: Server listening on 0.0.0.0 port 22.
Mar 29 10:00:01 parrot-os sshd[892]: Server listening on :: port 22.
Mar 29 10:00:15 parrot-os sudo: pam_unix(sudo:session): session opened for user root by parrot(uid=0)
Mar 29 10:00:15 parrot-os sudo: parrot : TTY=pts/0 ; PWD=/home/parrot ; USER=root ; COMMAND=/usr/bin/apt update
Mar 29 10:00:45 parrot-os sudo: pam_unix(sudo:session): session closed for user root
Mar 29 10:01:22 parrot-os login[1145]: pam_unix(login:session): session opened for user parrot by LOGIN(uid=0)
Mar 29 10:01:22 parrot-os systemd-logind[845]: New session 1 of user parrot.
Mar 29 10:05:33 parrot-os sudo: parrot : TTY=pts/0 ; PWD=/home/parrot ; USER=root ; COMMAND=/usr/bin/apt install nmap
Mar 29 10:05:33 parrot-os sudo: pam_unix(sudo:session): session opened for user root by parrot(uid=0)
Mar 29 10:06:12 parrot-os sudo: pam_unix(sudo:session): session closed for user root`,
            },
          },
        },
      },
    },
    usr: {
      type: 'directory',
      name: 'usr',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      group: 'root',
      modified: 'Jan 15 09:00',
      children: {
        bin: {
          type: 'directory',
          name: 'bin',
          permissions: 'drwxr-xr-x',
          owner: 'root',
          group: 'root',
          modified: 'Jan 15 09:00',
          children: {},
        },
        local: {
          type: 'directory',
          name: 'local',
          permissions: 'drwxr-xr-x',
          owner: 'root',
          group: 'root',
          modified: 'Jan 15 09:00',
          children: {
            bin: {
              type: 'directory',
              name: 'bin',
              permissions: 'drwxr-xr-x',
              owner: 'root',
              group: 'root',
              modified: 'Jan 15 09:00',
              children: {},
            },
          },
        },
      },
    },
    tmp: {
      type: 'directory',
      name: 'tmp',
      permissions: 'drwxrwxrwt',
      owner: 'root',
      group: 'root',
      modified: 'Mar 29 10:00',
      children: {},
    },
    root: {
      type: 'directory',
      name: 'root',
      permissions: 'drwx------',
      owner: 'root',
      group: 'root',
      modified: 'Jan 15 09:00',
      children: {},
    },
  },
};

export function getNodeAtPath(fs: FSNode, path: string): FSNode | null {
  if (path === '/') return fs;
  const parts = path.split('/').filter(Boolean);
  let current: FSNode = fs;
  for (const part of parts) {
    if (part === '..') continue;
    if (!current.children || !current.children[part]) return null;
    current = current.children[part];
  }
  return current;
}

export function getParentPath(path: string): string {
  if (path === '/') return '/';
  const parts = path.split('/').filter(Boolean);
  parts.pop();
  return '/' + parts.join('/');
}

export function resolvePath(currentDir: string, inputPath: string): string {
  if (inputPath.startsWith('/')) return normalizePath(inputPath);
  if (inputPath === '~' || inputPath === '') return '/home/parrot';
  if (inputPath.startsWith('~/')) return normalizePath('/home/parrot/' + inputPath.slice(2));
  return normalizePath(currentDir + '/' + inputPath);
}

export function normalizePath(path: string): string {
  const parts = path.split('/').filter(Boolean);
  const resolved: string[] = [];
  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') {
      resolved.pop();
    } else {
      resolved.push(part);
    }
  }
  return '/' + resolved.join('/');
}

export function formatSize(size: number): string {
  if (size < 1024) return size + 'B';
  if (size < 1024 * 1024) return (size / 1024).toFixed(1) + 'K';
  if (size < 1024 * 1024 * 1024) return (size / 1024 / 1024).toFixed(1) + 'M';
  return (size / 1024 / 1024 / 1024).toFixed(1) + 'G';
}

export function getFileSize(node: FSNode): number {
  if (node.type === 'file') {
    return node.content ? node.content.length : 0;
  }
  if (node.children) {
    return Object.values(node.children).reduce((acc, child) => acc + getFileSize(child), 4096);
  }
  return 4096;
}

export function setNodeAtPath(fs: FSNode, path: string, node: FSNode): FSNode {
  const newFs = deepClone(fs);
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 0) return node;
  let current = newFs;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current.children) current.children = {};
    if (!current.children[parts[i]]) return newFs;
    current = current.children[parts[i]];
  }
  if (!current.children) current.children = {};
  current.children[parts[parts.length - 1]] = node;
  return newFs;
}

export function deleteNodeAtPath(fs: FSNode, path: string): FSNode {
  const newFs = deepClone(fs);
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 0) return newFs;
  let current = newFs;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current.children || !current.children[parts[i]]) return newFs;
    current = current.children[parts[i]];
  }
  if (current.children) {
    delete current.children[parts[parts.length - 1]];
  }
  return newFs;
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function listDirectory(node: FSNode): FSNode[] {
  if (!node.children) return [];
  return Object.values(node.children);
}

export function getPermissionString(node: FSNode): string {
  return node.permissions || (node.type === 'directory' ? 'drwxr-xr-x' : '-rw-r--r--');
}
