import { CommandContext } from './navigation';

export function ip_cmd(ctx: CommandContext): string {
  const { args } = ctx;
  const sub = args[0] || 'addr';

  if (sub === 'addr' || sub === 'a') {
    return `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN group default qlen 1000
    link/ether a4:c3:f0:85:41:d0 brd ff:ff:ff:ff:ff:ff
3: wlan0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
    link/ether 3c:58:c2:8d:e6:aa brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.105/24 brd 192.168.1.255 scope global dynamic noprefixroute wlan0
       valid_lft 85324sec preferred_lft 85324sec
    inet6 fe80::2a4b:c9f1:d8e2:3b5c/64 scope link noprefixroute
       valid_lft forever preferred_lft forever`;
  }

  if (sub === 'route' || sub === 'r') {
    return `default via 192.168.1.1 dev wlan0 proto dhcp src 192.168.1.105 metric 600
192.168.1.0/24 dev wlan0 proto kernel scope link src 192.168.1.105 metric 600`;
  }

  if (sub === 'link' || sub === 'l') {
    return `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: eth0: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/ether a4:c3:f0:85:41:d0 brd ff:ff:ff:ff:ff:ff
3: wlan0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP mode DORMANT group default qlen 1000
    link/ether 3c:58:c2:8d:e6:aa brd ff:ff:ff:ff:ff:ff`;
  }

  if (sub === 'neigh' || sub === 'n') {
    return `192.168.1.1 dev wlan0 lladdr aa:bb:cc:dd:ee:ff REACHABLE
192.168.1.100 dev wlan0 lladdr 11:22:33:44:55:66 STALE`;
  }

  return `Usage: ip [ OPTIONS ] OBJECT { COMMAND | help }
where  OBJECT := { address | link | route | neigh | ... }`;
}

export function ifconfig(ctx: CommandContext): string {
  const { args } = ctx;
  const iface = args[0];

  const lo = `lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 2847  bytes 223456 (218.2 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 2847  bytes 223456 (218.2 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0`;

  const wlan0 = `wlan0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.105  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 fe80::2a4b:c9f1:d8e2:3b5c  prefixlen 64  scopeid 0x20<link>
        ether 3c:58:c2:8d:e6:aa  txqueuelen 1000  (Ethernet)
        RX packets 124853  bytes 87234567 (83.2 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 45231  bytes 12456789 (11.8 MiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0`;

  const eth0 = `eth0: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
        ether a4:c3:f0:85:41:d0  txqueuelen 1000  (Ethernet)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0`;

  if (iface === 'lo') return lo;
  if (iface === 'wlan0') return wlan0;
  if (iface === 'eth0') return eth0;
  return [wlan0, eth0, lo].join('\n\n');
}

export function ping(ctx: CommandContext): string {
  const { args, flags } = ctx;
  if (!args[0]) return 'Usage: ping [-c count] HOST';

  const host = args.find(a => !a.startsWith('-')) || 'localhost';
  let count = 4;
  const cIdx = args.indexOf('-c');
  if (cIdx !== -1 && args[cIdx + 1]) count = parseInt(args[cIdx + 1]) || 4;
  count = Math.min(count, 10);

  const isLocalhost = host === 'localhost' || host === '127.0.0.1';
  const ip = isLocalhost ? '127.0.0.1' : '142.250.185.78';
  const baseMs = isLocalhost ? 0.1 : 12;

  const lines: string[] = [
    `PING ${host} (${ip}) 56(84) bytes of data.`,
  ];

  for (let i = 1; i <= count; i++) {
    const ms = (baseMs + Math.random() * 5).toFixed(3);
    lines.push(`64 bytes from ${isLocalhost ? host : ip} (${ip}): icmp_seq=${i} ttl=${isLocalhost ? 64 : 117} time=${ms} ms`);
  }

  const transmitted = count;
  const received = count;
  const avgMs = (baseMs + 2).toFixed(3);
  lines.push('');
  lines.push(`--- ${host} ping statistics ---`);
  lines.push(`${transmitted} packets transmitted, ${received} received, 0% packet loss, time ${(count * 1000).toFixed(0)}ms`);
  lines.push(`rtt min/avg/max/mdev = ${(baseMs).toFixed(3)}/${avgMs}/${(baseMs + 5).toFixed(3)}/1.234 ms`);

  return lines.join('\n');
}

export function netstat(ctx: CommandContext): string {
  const { flags } = ctx;
  const listening = flags.includes('l') || flags.some(f => f.includes('l'));
  const numeric = flags.includes('n') || flags.some(f => f.includes('n'));
  const udp = flags.includes('u') || flags.some(f => f.includes('u'));
  const tcp = flags.includes('t') || flags.some(f => f.includes('t'));

  const header = `Active Internet connections (servers and established)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name`;

  const connections = [
    'tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      892/sshd',
    'tcp        0      0 127.0.0.1:631           0.0.0.0:*               LISTEN      1045/cupsd',
    'tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      1234/nginx',
    'tcp        0    144 192.168.1.105:54892     142.250.185.78:443      ESTABLISHED 2341/firefox',
    'tcp        0      0 192.168.1.105:38124     151.101.193.140:443     ESTABLISHED 2341/firefox',
    'tcp6       0      0 :::22                   :::*                    LISTEN      892/sshd',
    'udp        0      0 0.0.0.0:68              0.0.0.0:*                           947/dhclient',
    'udp        0      0 0.0.0.0:5353            0.0.0.0:*                           1100/avahi-daemon',
    'udp        0      0 192.168.1.105:58291     8.8.8.8:53              ESTABLISHED 1200/systemd-resolve',
  ];

  if (listening) {
    return [header, ...connections.filter(c => c.includes('LISTEN'))].join('\n');
  }
  return [header, ...connections].join('\n');
}

export function ss(ctx: CommandContext): string {
  const { flags } = ctx;

  return `Netid  State   Recv-Q Send-Q   Local Address:Port     Peer Address:Port   Process
tcp    LISTEN  0      128          0.0.0.0:22            0.0.0.0:*           users:(("sshd",pid=892,fd=3))
tcp    LISTEN  0      128        127.0.0.1:631           0.0.0.0:*           users:(("cupsd",pid=1045,fd=7))
tcp    LISTEN  0      128          0.0.0.0:80            0.0.0.0:*           users:(("nginx",pid=1234,fd=6))
tcp    ESTAB   0      0    192.168.1.105:54892    142.250.185.78:443    users:(("firefox",pid=2341,fd=45))
tcp    ESTAB   0      0    192.168.1.105:38124   151.101.193.140:443    users:(("firefox",pid=2341,fd=47))
tcp    LISTEN  0      128             [::]:22               [::]:*           users:(("sshd",pid=892,fd=4))
udp    UNCONN  0      0          0.0.0.0:68            0.0.0.0:*           users:(("dhclient",pid=947,fd=6))
udp    UNCONN  0      0          0.0.0.0:5353          0.0.0.0:*           users:(("avahi-daemon",pid=1100,fd=14))`;
}

export function nmap(ctx: CommandContext): string {
  const { args, flags } = ctx;
  const target = args.find(a => !a.startsWith('-')) || 'localhost';
  const hasVersion = flags.includes('sV') || args.includes('-sV');
  const hasScripts = flags.includes('sC') || args.includes('-sC');
  const hasOS = flags.includes('O') || args.includes('-O');
  const hasAggressive = flags.includes('A') || args.includes('-A');

  const ip = target === 'localhost' ? '127.0.0.1' :
             target === '192.168.1.1' ? '192.168.1.1' : '192.168.1.105';

  const lines: string[] = [
    `Starting Nmap 7.93 ( https://nmap.org ) at ${new Date().toISOString().replace('T', ' ').slice(0,19)} UTC`,
    `Nmap scan report for ${target} (${ip})`,
    `Host is up (0.00042s latency).`,
    'Not shown: 994 closed tcp ports (reset)',
    'PORT     STATE SERVICE' + (hasVersion ? '  VERSION' : ''),
    '22/tcp   open  ssh' + (hasVersion ? '      OpenSSH 9.2p1 Debian 2 (protocol 2.0)' : ''),
    '80/tcp   open  http' + (hasVersion ? '     nginx 1.22.1' : ''),
    '443/tcp  open  https' + (hasVersion ? '    nginx 1.22.1' : ''),
    '631/tcp  open  ipp' + (hasVersion ? '      CUPS 2.4' : ''),
  ];

  if (hasOS || hasAggressive) {
    lines.push('');
    lines.push('OS detection:');
    lines.push('  Running: Linux 5.X|6.X');
    lines.push('  OS CPE: cpe:/o:linux:linux_kernel:5 cpe:/o:linux:linux_kernel:6');
    lines.push('  OS details: Linux 5.15 - 6.2');
  }

  if (hasScripts || hasAggressive) {
    lines.push('');
    lines.push('| ssh-hostkey:');
    lines.push('|   3072 5f:5a:b2:c3:d4:e5:f6:a7:b8:c9:d0:e1:f2:a3:b4 (RSA)');
    lines.push('|   256 3a:4b:5c:6d:7e:8f:9a:0b:1c:2d:3e:4f:5a:6b:7c (ECDSA)');
    lines.push('|_  256 1b:2c:3d:4e:5f:6a:7b:8c:9d:0e:1f:2a:3b:4c:5d (ED25519)');
  }

  lines.push('');
  lines.push(`Nmap done: 1 IP address (1 host up) scanned in ${(Math.random() * 3 + 0.5).toFixed(2)} seconds`);
  return lines.join('\n');
}

export function curl(ctx: CommandContext): string {
  const { args, flags } = ctx;
  const url = args.find(a => !a.startsWith('-') && (a.startsWith('http') || a.includes('.')));

  if (!url) return 'curl: no URL specified!\ncurl: try \'curl --help\' for more information';

  const silent = flags.includes('s') || args.includes('-s');
  const onlyIP = url === 'ifconfig.me' || url === 'https://ifconfig.me' || url === 'http://ifconfig.me';

  if (onlyIP) return '192.168.1.105';

  const showHeaders = flags.includes('I') || args.includes('-I');
  if (showHeaders) {
    return `HTTP/2 200
content-type: text/html; charset=UTF-8
date: ${new Date().toUTCString()}
server: nginx/1.22.1
content-length: 15280
cache-control: max-age=0, private, must-revalidate`;
  }

  const output = args.indexOf('-o');
  if (output !== -1 && args[output + 1]) {
    return `  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  4521  100  4521    0     0   8234      0 --:--:-- --:--:-- --:--:--  8234`;
  }

  return `<!DOCTYPE html>
<html>
<head><title>${url}</title></head>
<body>
<h1>Response from ${url}</h1>
<p>This is a simulated curl response.</p>
</body>
</html>`;
}

export function wget(ctx: CommandContext): string {
  const { args } = ctx;
  const url = args.find(a => !a.startsWith('-'));
  if (!url) return 'wget: missing URL\nUsage: wget [OPTION]... [URL]...';

  const filename = url.split('/').pop() || 'index.html';
  return `--${new Date().toISOString().replace('T', ' ').slice(0,19)}--  ${url}
Resolving ${url.split('/')[2]}... 151.101.193.140
Connecting to ${url.split('/')[2]}|151.101.193.140|:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 15280 (15K) [text/html]
Saving to: '${filename}'

${filename}      100%[===================>]  14.92K  --.-KB/s    in 0.08s

${new Date().toISOString().replace('T', ' ').slice(0,19)} (186 KB/s) - '${filename}' saved [15280/15280]`;
}

export function ssh_cmd(ctx: CommandContext): string {
  const { args, flags } = ctx;
  const target = args.find(a => !a.startsWith('-') && (a.includes('@') || a.includes('.')));
  if (!target) return 'Usage: ssh [options] [user@]host [command]';

  const port = args.indexOf('-p') !== -1 ? args[args.indexOf('-p') + 1] : '22';
  return `ssh: connect to host ${target} port ${port}: Connection refused
(Simulation: SSH connections are not supported in this environment)`;
}

export function scp(ctx: CommandContext): string {
  return 'scp: Connection refused\n(Simulation: SCP connections are not supported in this environment)';
}

export function traceroute(ctx: CommandContext): string {
  const { args } = ctx;
  const host = args.find(a => !a.startsWith('-')) || 'google.com';

  const lines: string[] = [
    `traceroute to ${host} (142.250.185.78), 30 hops max, 60 byte packets`,
  ];

  const hops = [
    ['192.168.1.1', 'router.local', ['1.234', '1.456', '1.312']],
    ['10.0.0.1', 'isp-gateway.net', ['8.234', '8.456', '8.312']],
    ['172.16.0.1', '172.16.0.1', ['12.234', '11.456', '12.012']],
    ['172.16.1.5', '172.16.1.5', ['15.234', '14.456', '15.312']],
    ['10.1.0.1', 'core-router.isp.net', ['18.234', '17.456', '18.012']],
    ['64.233.174.45', '64.233.174.45', ['25.234', '24.456', '25.012']],
    ['142.250.185.78', host, ['28.234', '27.456', '28.012']],
  ];

  hops.forEach((hop, i) => {
    const [ip, name, times] = hop as [string, string, string[]];
    lines.push(` ${i + 1}  ${name} (${ip})  ${times[0]} ms  ${times[1]} ms  ${times[2]} ms`);
  });

  return lines.join('\n');
}

export function dig(ctx: CommandContext): string {
  const { args } = ctx;
  const domain = args.find(a => !a.startsWith('-') && !a.startsWith('@')) || 'example.com';
  const recordType = args.find(a => ['A', 'AAAA', 'MX', 'NS', 'TXT', 'CNAME'].includes(a.toUpperCase())) || 'A';

  return `; <<>> DiG 9.18.12-0ubuntu0.22.04.3-Ubuntu <<>> ${domain} ${recordType}
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 12345
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 65494
;; QUESTION SECTION:
;${domain}.                      IN      ${recordType}

;; ANSWER SECTION:
${domain}.               299     IN      ${recordType}    93.184.216.34

;; Query time: 28 msec
;; SERVER: 8.8.8.8#53(8.8.8.8) (UDP)
;; WHEN: ${new Date().toUTCString()}
;; MSG SIZE  rcvd: 56`;
}

export function nslookup(ctx: CommandContext): string {
  const { args } = ctx;
  const domain = args.find(a => !a.startsWith('-')) || 'example.com';

  return `Server:\t\t8.8.8.8
Address:\t8.8.8.8#53

Non-authoritative answer:
Name:\t${domain}
Address: 93.184.216.34`;
}

export function whois(ctx: CommandContext): string {
  const { args } = ctx;
  const domain = args.find(a => !a.startsWith('-')) || 'example.com';

  return `Domain Name: ${domain.toUpperCase()}
Registry Domain ID: 2336799_DOMAIN_COM-VRSN
Registrar WHOIS Server: whois.iana.org
Registrar URL: http://res-dom.iana.org
Updated Date: 2023-08-14T07:01:31Z
Creation Date: 1995-08-14T04:00:00Z
Registry Expiry Date: 2024-08-13T04:00:00Z
Registrar: RESERVED-Internet Assigned Numbers Authority
Registrar IANA ID: 376
Domain Status: clientDeleteProhibited
Name Server: A.IANA-SERVERS.NET
Name Server: B.IANA-SERVERS.NET
DNSSEC: signedDelegation
URL of the ICANN Whois Inaccuracy Complaint Form: https://www.icann.org/wicf/`;
}

export function arp(ctx: CommandContext): string {
  const { flags } = ctx;
  return `Address                  HWtype  HWaddress           Flags Mask            Iface
192.168.1.1              ether   aa:bb:cc:dd:ee:ff   C                     wlan0
192.168.1.100            ether   11:22:33:44:55:66   C                     wlan0
192.168.1.102            ether   77:88:99:aa:bb:cc   C                     wlan0`;
}

export function route(ctx: CommandContext): string {
  const { flags } = ctx;
  return `Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
0.0.0.0         192.168.1.1     0.0.0.0         UG    600    0        0 wlan0
192.168.1.0     0.0.0.0         255.255.255.0   U     600    0        0 wlan0
169.254.0.0     0.0.0.0         255.255.0.0     U     1000   0        0 wlan0`;
}
