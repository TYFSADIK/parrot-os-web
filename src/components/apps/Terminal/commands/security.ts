import { CommandContext } from './navigation';

const DISCLAIMER = `
⚠️  EDUCATIONAL NOTICE ⚠️
This tool is for authorized security testing only.
Unauthorized use against systems you don't own or lack permission to test is ILLEGAL.
Always obtain written authorization before testing.
`;

export function hydra(ctx: CommandContext): string {
  const { args } = ctx;

  if (args.includes('--help') || args.includes('-h') || args.length === 0) {
    return `Hydra v9.4 (c) 2022 by van Hauser/THC & David Maciejak

Syntax: hydra [[[-l LOGIN|-L FILE] [-p PASS|-P FILE]] | [-C FILE]]
              [-e nsr] [-o FILE] [-t TASKS] [-M FILE] [-T TASKS]
              [-w TIME] [-W TIME] [-f] [-s PORT] [-x MIN:MAX:CHARSET]
              [-c TIME] [-ISOuvVd46] [-m MODULE_OPT] [server service [OPT]]

Options:
  -l LOGIN or -L FILE  login with LOGIN name, or load several logins from FILE
  -p PASS or -P FILE   try password PASS, or load passwords from FILE
  -C FILE              colon separated "login:pass" format, instead of -L/-P options
  -M FILE              list of servers to attack, one entry per line
  -t TASKS             run TASKS number of connects in parallel per target (default: 16)
  -m OPT               options specific to a module, see -U output for information
  -w TIME              wait time for a response (32)
  -f / -F              exit when a login/pass pair is found (-M: -f per host, -F global)
  -e nsr               try "n" null password, "s" login as pass and/or "r" reversed login
  -o FILE              write found login/password pairs to FILE
  -b FORMAT            specify the format for the -o FILE: text(default), jsonv1, json
  -u                   by default hydra checks all passwords for one login and then tries the next login.
  -R                   restore a previous aborted/crashed session
  -I                   ignore an existing restore file (don't wait 10 seconds)
  -S                   connect via SSL
  -s PORT              if the service is on a different default port, define it here
  -v / -V / -d         verbose mode / show login+pass for each attempt / debug mode
  -4 / -6              prefer IPv4 (default) or IPv6 addresses
  -x MIN:MAX:CHARSET   password bruteforce generation, type "-x -h" to get help

Supported services: adam6500 asterisk cisco cisco-enable cvs firebird ftp ftps http[s]-{head|get|post} http[s]-{get|post}-form http-proxy http-proxy-urlenum icq imap[s] irc ldap2[s] ldap3[-{cram|digest}md5][s] memcached mongodb mssql mysql nntp oracle-listener oracle-sid pcanywhere pcnfs pop3[s] postgres radmin2 rdp redis rexec rlogin rpcap rsh rtsp s7-300 sip smb smtp[s] smtp-enum snmp socks5 ssh sshkey svn teamspeak telnet[s] vmauthd vnc xmpp

${DISCLAIMER}

EXAMPLE (authorized testing only):
  hydra -l admin -P wordlist.txt 192.168.1.1 ssh
  hydra -L users.txt -P passwords.txt ftp://target.com`;
  }

  return `${DISCLAIMER}
[WARNING] Many SSH configurations limit the number of parallel tasks
[DATA] max 16 tasks per 1 server, overall 16 tasks, 1 server
[DATA] attacking ssh://target:22/
[ATTEMPT] target 192.168.1.1 - login "${args.find(a => !a.startsWith('-')) || 'admin'}" - pass 1 of 1
[VERBOSE] host: 192.168.1.1   login: admin   password: ***

[SIMULATION] This is a simulated output for educational purposes.
Real hydra attacks require authorization from the target system owner.`;
}

export function hashcat(ctx: CommandContext): string {
  const { args } = ctx;

  if (args.includes('--help') || args.includes('-h') || args.length === 0) {
    return `hashcat (v6.2.6) starting in help mode

Usage: hashcat [options]... hash|hashfile|hccapxfile [dictionary|mask|directory]...

- [ Options ] -

 Options Short / Long           | Type | Description                                          | Example
================================+======+======================================================+===========
 -m, --hash-type                | Num  | Hash-type, references below (add --help to list)     | -m 1000
 -a, --attack-mode              | Num  | Attack-mode, see references below                     | -a 3
 -V, --version                  |      | Print version                                        |
 -h, --help                     |      | Print help                                           |
 --quiet                        |      | Suppress output                                      |
 -b, --benchmark                |      | Run benchmark of selected hash-modes                  |
 -D, --opencl-device-types      | Str  | OpenCL device-types to use, separated with comma      | -D 1
 -d, --backend-devices          | Str  | Backend devices to use, separated with comma          | -d 1
 -o, --outfile                  | File | Define outfile for recovered hash                     | -o outfile.txt
 -p, --separator                | Char | Separator char for hashlists and outfile              | -p :
 --example-hashes               |      | Show an example hash for each hash-mode               |
 --keep-guessing                |      | Keep guessing the hash after it has been cracked      |
 --skip                         | Num  | Skip number of words from start                       | --skip=1000
 --limit                        | Num  | Limit number of words from start + skipped            | --limit=1000

- [ Hash modes ] -

      # | Name                                                | Category
  ======+=========================+=============================
    900 | MD4                                                 | Raw Hash
      0 | MD5                                                 | Raw Hash
    100 | SHA1                                                | Raw Hash
   1300 | SHA2-224                                            | Raw Hash
   1400 | SHA2-256                                            | Raw Hash
   1700 | SHA2-512                                            | Raw Hash
   1000 | NTLM                                                | Operating System
   3000 | LM                                                  | Operating System
   5500 | NetNTLMv1 / NetNTLMv1+ESS                          | Network Protocol
   5600 | NetNTLMv2                                           | Network Protocol
   2500 | WPA-EAPOL-PBKDF2                                    | Network Protocol
   2501 | WPA-EAPOL-PMK                                       | Network Protocol

${DISCLAIMER}

EXAMPLE (authorized use only):
  hashcat -m 0 hashes.txt wordlist.txt        (MD5 dictionary attack)
  hashcat -m 0 -a 3 hash.txt ?a?a?a?a?a?a    (MD5 brute force)
  hashcat -m 1000 ntlm.txt rockyou.txt        (NTLM dictionary attack)`;
  }

  const mode = args.indexOf('-m') !== -1 ? args[args.indexOf('-m') + 1] : '0';
  return `${DISCLAIMER}
hashcat (v6.2.6) starting...

OpenCL API (OpenCL 3.0 ) - Platform #1 [NVIDIA Corporation]
* Device #1: NVIDIA GeForce GTX 1650, 3904/3904 MiB (976 MiB allocatable), 14MCU

Minimum password length supported by kernel: 0
Maximum password length supported by kernel: 256

Hashes: 1 digests; 1 unique digests, 1 unique salts
Bitmaps: 16 bits, 65536 entries

[SIMULATION] Running in simulation mode for educational purposes.
To use hashcat for authorized penetration testing, install it on your system.`;
}

export function john(ctx: CommandContext): string {
  const { args } = ctx;

  if (args.length === 0 || args.includes('--help')) {
    return `John the Ripper password cracker, version 1.9.0-jumbo-1 OMP [linux-gnu 64-bit]
Copyright (c) 1996-2019 by Solar Designer and others
Homepage: https://www.openwall.com/john/

Usage: john [OPTIONS] [PASSWORD-FILES]

--help                     Print usage summary
--single[=SECTION[,..]]    "Single crack" mode, using default or named rules
--wordlist[=FILE]          Wordlist mode, read words from FILE or stdin
--stdin                    Read candidates from stdin
--pipe                     Like --stdin, but bulk reads, and allows rules
--loopback[=FILE]          Like --wordlist, but read from a .pot file
--dupe-suppression         Suppress all dupes in wordlist (and force preload)
--format=NAME              Force hash of type NAME. The NAME indicates the specific
                           hash algorithm or format: raw-md5, raw-sha1, bcrypt, etc.
--incremental[=MODE]       "Incremental" mode [using section MODE]
--mask[=MASK]              Mask mode using MASK (or default from john.conf)
--restore[=NAME]           Restore an interrupted session [called NAME]
--session=NAME             Give a new session the NAME
--status[=NAME]            Print status of a session [called NAME]
--show[=LEFT]              Show cracked passwords [if =LEFT, show uncracked]
--test[=TIME]              Run tests and benchmarks for TIME seconds each
--users=[-]LOGIN|UID[,..]  [Do not] load this (these) user(s) only
--groups=[-]GID[,..]       Load users [not] of this (these) group(s) only
--shells=[-]SHELL[,..]     Load users with[out] this (these) shell(s) only
--salts=[-]COUNT[:MAX]     Load salts with[out] at least COUNT [to MAX] hashes
--save-memory=LEVEL        Enable memory saving, at LEVEL 1..3

${DISCLAIMER}`;
  }

  return `${DISCLAIMER}
John the Ripper password cracker, version 1.9.0-jumbo-1

Loaded 1 password hash (MD5 [MD5 256/256 AVX2 8x3])

[SIMULATION] John the Ripper is running in simulation mode.
For authorized penetration testing, use the actual tool.

Press 'q' or Ctrl-C to abort, almost any other key for status`;
}

export function aircrack_ng(ctx: CommandContext): string {
  const { args } = ctx;

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    return `  Aircrack-ng 1.7  - (C) 2006-2022 Thomas d'Otreppe
  https://www.aircrack-ng.org

  Usage: aircrack-ng [options] <.cap / .ivs file(s)>

  Common options:
    -a <amode> : force attack mode (1/WEP, 2/WPA-PSK)
    -e <essid> : target selection: network identifier
    -b <bssid> : target selection: access point's MAC
    -p <nbcpu> : # of CPU to use  (default: all CPUs)
    -q         : enable quiet mode (no status output)
    -C <macs>  : merge the given APs to a virtual one
    -l <file>  : write key to file. Overwrites file.

  Static WEP cracking options:
    -c         : search alpha-numeric characters only
    -t         : search binary coded decimal chr only
    -h         : search the numeric key for Fritz!BOX
    -d <mask>  : use masking of the key (A1:XX:CF:YY)
    -m <maddr> : MAC address to filter usable packets
    -n <nbits> : WEP key length :  64/128/152/256/512

  WPA-PSK options:
    -w <words> : path to wordlist(s) filename(s)
    -N <file>  : path to PMKID file
    -P <nb>    : number of threads to use  (default: 1)

${DISCLAIMER}`;
  }

  return `${DISCLAIMER}
  Aircrack-ng 1.7

  [00:00:01] Tested 1234 keys (got 0 IVs)

  [SIMULATION] Aircrack-ng is running in simulation mode.
  For authorized wireless security testing, use the actual tool
  with proper authorization.

  KB    depth   byte(vote)`;
}

export function wireshark(ctx: CommandContext): string {
  return `${DISCLAIMER}

Wireshark - The world's foremost network protocol analyzer

Note: Wireshark requires a graphical interface and cannot run in this terminal.
Please launch Wireshark from the Applications menu or use:
  tshark - the terminal-based version

Usage: wireshark [-i <capture interface>|-] [-f <capture filter>]
                 [-Y <display filter>] [-w <outfile>|-] [options] [<infile>]

Alternative: tshark (terminal version)
  tshark -i wlan0                              # Capture on wlan0
  tshark -i wlan0 -w capture.pcap             # Save to file
  tshark -r capture.pcap                       # Read from file
  tshark -r capture.pcap -Y "http"            # Filter HTTP
  tshark -r capture.pcap -Y "tcp.port==80"   # Filter by port

${DISCLAIMER}`;
}

export function msfconsole(ctx: CommandContext): string {
  return `
         .                                         .
 .  .:ozOOOOOOOz$oz:,....                .....,:oz$OOOOOOOzo:.  .
   .OOOOOOOOOOOOOOOOOOOOOO8OOOOOOOOOOOOo$OOOOOOOOOOOOOOOOOOOOOO.
  .OOOOOOO8ooo$OOOOOOOOOooOOOOOOOOOOOOO$ooOOOOOOOOOOOOOO8oooO.
   OOOOOOOOooo$OOOOOOOOOoo$OOOOOOOOOOOooOOOOOOOOOOOOOO8oooOOO.
   OOOOOOOOooo$OOOOOOOOOooOOOOOOOOOOOooOOOOOOOOOOOOOOoooOOOOO.
   OOOOOOOOooo$OOOOOOOOOooOOOOOOOOOOOo$OOOOOOOOOOOOOoooOOOOOO.
   OOOOOOOOooo$OOOOOOOOOooOOOOOOOOOOOooOOOOOOOOOOOOooooOOOOOO.
    OOOOOOOOooo$OOOOOOOOoooOOOOOOOOOOooOOOOOOOOOOOoooooOOOOOO.
     OOOOOOOOooooOOOOOOOooooOOOOOOOOooooOOOOOOOOOooooooOOOOOO.
      $OOOOOOOOooooooooooooooooooooooooooooooooooooooooOOOOOOO$
         OOOOOOOOOOOooooooooooooooooooooooooooooOOOOOOOOOOOO.
            $OOOOOOOOOOOOOOOOOOOooooooooOOOOOOOOOOOOOOOOOO$
               $OOOOOOOOOOOOOOOOOooooooOOOOOOOOOOOOOOOOO$
                  $OOOOOOOOOOOOOOoooooOOOOOOOOOOOOOOO$
                     $OOOOOOOOOOooooooOOOOOOOOOOOO$
                        $OOOOOOOooooooOOOOOOOOO$
                           $OOOOoooooooOOOOO$
                              $Ooooooooo$
                                 $OO$

       =[ metasploit v6.3.21-dev                           ]
+ -- --=[ 2317 exploits - 1229 auxiliary - 413 post       ]
+ -- --=[ 1392 payloads - 46 encoders - 11 nops           ]
+ -- --=[ 9 evasion                                       ]

Mettle ms meterpreter (MSF)

${DISCLAIMER}

msf6 > (Simulated Metasploit console - for educational purposes only)

Key commands:
  help          - Show help
  search <term> - Search for modules
  use <module>  - Use a module
  info          - Show module info
  options       - Show module options
  run/exploit   - Run the module
  sessions      - List sessions
  exit          - Exit msfconsole

Common modules:
  auxiliary/scanner/portscan/tcp
  exploit/multi/handler
  auxiliary/scanner/smb/smb_ms17_010
  post/multi/recon/local_exploit_suggester`;
}

export function nikto(ctx: CommandContext): string {
  const { args } = ctx;
  const host = args.find(a => !a.startsWith('-')) || 'target.example.com';

  if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    return `Nikto v2.1.6
Options:
  -ask+               Whether to ask about submitting updates
  -config+            Use this config file
  -Display+           Turn on/off display outputs
  -dbcheck            check database and other key files for syntax errors
  -Format+            save file (-o) format
  -Help               Extended help information
  -host+              target host/URL
  -id+                Host authentication to use, format is id:pass or id:pass:realm
  -list-plugins       List all available plugins
  -maxtime+           Maximum testing time per host
  -nointeractive      Disables interactive features
  -nolookup           Disables DNS lookups
  -nossl              Disables the use of SSL
  -no404              Disables nikto attempting to guess a 404 page
  -output+            Write output to this file
  -Pause+             Pause between tests (seconds)
  -port+              Port to use (default 80)
  -root+              Prepend root value to all requests
  -ssl                Force ssl mode on port
  -timeout+           Timeout for requests (default 10 seconds)
  -Tuning+            Scan tuning
  -userdbs            Load only user databases, not the standard databases
  -until+             Run until the specified time or duration
  -update             Update databases and plugins from CIRT.net
  -Version            Print plugin and database versions
  -vhost+             Virtual host (for Host header)

${DISCLAIMER}`;
  }

  return `${DISCLAIMER}
- Nikto v2.1.6
---------------------------------------------------------------------------
+ Target IP:          ${host === 'target.example.com' ? '93.184.216.34' : host}
+ Target Hostname:    ${host}
+ Target Port:        80
+ Start Time:         ${new Date().toISOString().replace('T', ' ').slice(0,19)} (GMT)
---------------------------------------------------------------------------
+ Server: nginx/1.22.1
+ /: The anti-clickjacking X-Frame-Options header is not present.
+ /: The X-XSS-Protection header is not defined.
+ /: The X-Content-Type-Options header is not set.
+ No CGI Directories found
+ /robots.txt: Entry '/admin/' is returned a non-forbidden or redirect HTTP code.
+ /robots.txt: Entry '/wp-admin/' is returned a non-forbidden or redirect HTTP code.
+ /admin/: Admin login page/section found.
+ /#wp-config.php: #wp-config.php file found. This file contains the credentials.
+ 8074 requests: 0 error(s) and 7 item(s) reported on remote host

[SIMULATION] This is simulated output for educational purposes only.`;
}

export function sqlmap(ctx: CommandContext): string {
  const { args } = ctx;

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    return `        ___
       __H__
 ___ ___["]_____ ___ ___  {1.7.4#stable}
|_ -| . [)]     | .'| . |
|___|_  [.]_|_|_|__,|  _|
      |_|V...       |_|   https://sqlmap.org

Usage: python3 sqlmap [options]

Options:
  -h, --help          Show basic help message and exit
  -u URL, --url=URL   Target URL (e.g. "http://www.site.com/vuln.php?id=1")
  --dbs               Enumerate DBMS databases
  --tables            Enumerate DBMS database tables
  --dump              Dump DBMS database table entries
  -D DB               DBMS database to enumerate
  -T TBL              DBMS database table(s) to enumerate
  -C COL              DBMS database table column(s) to enumerate
  --batch             Never ask for user input, use the default behavior
  --level=LEVEL       Level of tests to perform (1-5, default 1)
  --risk=RISK         Risk of tests to perform (0-3, default 1)
  --technique=TECH    SQL injection techniques to use
  --random-agent      Use randomly selected HTTP User-Agent header value

${DISCLAIMER}`;
  }

  const url = args.find(a => a.startsWith('http')) || 'http://target.com/page.php?id=1';
  return `${DISCLAIMER}
        ___
       __H__
 ___ ___[,]_____ ___ ___  {1.7.4#stable}
|_ -| . [.]     | .'| . |
|___|_  ["]_|_|_|__,|  _|
      |_|V...       |_|   https://sqlmap.org

[*] starting @ ${new Date().toISOString().replace('T', ' ').slice(0,19)}

[INFO] testing connection to the target URL
[INFO] testing if the target URL content is stable
[INFO] target URL content is stable
[INFO] testing if GET parameter 'id' is dynamic
[INFO] GET parameter 'id' appears to be dynamic
[INFO] heuristic (basic) test shows that GET parameter 'id' might be injectable

[SIMULATION] Running in simulation mode for educational purposes.
The target URL: ${url}`;
}
