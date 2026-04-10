import { CommandContext } from './navigation';

const PACKAGES_DB: Record<string, { version: string; description: string; installed: boolean; size: string }> = {
  nmap: { version: '7.93+dfsg1-1', description: 'The Network Mapper', installed: true, size: '4,821 kB' },
  'nmap-common': { version: '7.93+dfsg1-1', description: 'Architecture independent files for nmap', installed: true, size: '3,456 kB' },
  metasploit: { version: '6.3.21-0parrot1', description: 'Metasploit Framework', installed: true, size: '183,456 kB' },
  wireshark: { version: '4.0.5-1', description: 'Network traffic analyzer', installed: true, size: '25,678 kB' },
  hydra: { version: '9.4-1', description: 'Fast and flexible online password cracking tool', installed: true, size: '1,234 kB' },
  john: { version: '1.9.0-jumbo-1+parrot1', description: 'Active password cracking tool', installed: true, size: '12,456 kB' },
  hashcat: { version: '6.2.6+ds1-1', description: 'World\'s fastest and most advanced password recovery utility', installed: true, size: '8,234 kB' },
  sqlmap: { version: '1.7.4-1', description: 'Automatic SQL injection and database takeover tool', installed: true, size: '4,321 kB' },
  nikto: { version: '1:2.1.6-2', description: 'web server security scanner', installed: true, size: '1,456 kB' },
  aircrack_ng: { version: '1:1.7-5', description: 'wireless WEP/WPA cracking utilities', installed: true, size: '2,345 kB' },
  curl: { version: '7.88.1-10+deb12u4', description: 'command line tool for transferring data with URL syntax', installed: true, size: '345 kB' },
  wget: { version: '1.21.3-1+b2', description: 'retrieves files from the web', installed: true, size: '989 kB' },
  git: { version: '1:2.39.2-1.1', description: 'fast, scalable, distributed revision control system', installed: true, size: '34,567 kB' },
  python3: { version: '3.11.2-1+b1', description: 'interactive high-level object-oriented language (Python3)', installed: true, size: '598 kB' },
  vim: { version: '2:9.0.1378-2', description: 'Vi IMproved - enhanced vi editor', installed: true, size: '3,456 kB' },
  nano: { version: '7.2-1', description: 'small, friendly text editor inspired by Pico', installed: true, size: '756 kB' },
  htop: { version: '3.2.2-1', description: 'interactive processes viewer', installed: true, size: '567 kB' },
  neofetch: { version: '7.1.0-4', description: 'Shows Linux System Information with Distribution Logo', installed: true, size: '123 kB' },
  figlet: { version: '2.2.5-3', description: 'Make large character ASCII banners out of ordinary text', installed: true, size: '234 kB' },
  cowsay: { version: '3.03+dfsg2-8', description: 'configurable talking cow', installed: true, size: '45 kB' },
  lolcat: { version: '100.0.1-3', description: 'Rainbow coloring effect for text console display', installed: true, size: '56 kB' },
  burpsuite: { version: '2023.10.1-0parrot1', description: 'Platform for web application security testing', installed: false, size: '987,654 kB' },
  zaproxy: { version: '2.13.0-0parrot1', description: 'OWASP Zed Attack Proxy', installed: false, size: '456,789 kB' },
  maltego: { version: '4.3.0-0parrot1', description: 'OSINT and graphical link analysis tool', installed: false, size: '234,567 kB' },
  volatility: { version: '2.6.1-0parrot3', description: 'Advanced memory forensics framework', installed: false, size: '12,345 kB' },
  autopsy: { version: '4.20.0-0parrot1', description: 'Digital forensics platform and graphical interface to TSK', installed: false, size: '987,234 kB' },
  firefox: { version: '120.0-1', description: 'Mozilla Firefox web browser', installed: true, size: '218,456 kB' },
  'apt-transport-https': { version: '2.6.1', description: 'transitional package for https support', installed: true, size: '4 kB' },
  openssh_server: { version: '1:9.2p1-2', description: 'secure shell (SSH) server, for secure access from remote machines', installed: true, size: '898 kB' },
  netcat: { version: '1.10-46', description: 'TCP/IP swiss army knife', installed: true, size: '89 kB' },
  tcpdump: { version: '4.99.4-3', description: 'command-line network traffic analyzer', installed: true, size: '456 kB' },
};

let installedPackages = new Set(
  Object.entries(PACKAGES_DB)
    .filter(([, pkg]) => pkg.installed)
    .map(([name]) => name)
);

let updateCache: string | null = null;

export function apt(ctx: CommandContext): string {
  const { args } = ctx;
  if (!args[0]) {
    return `apt 2.6.1 (amd64)
Usage: apt [options] command

CLI for the Debian package manager.

Most used commands:
  list - list packages based on package names
  search - search in package descriptions
  show - show package details
  install - install packages
  reinstall - reinstall packages
  remove - remove packages
  autoremove - Remove automatically all unused packages
  update - update list of available packages
  upgrade - upgrade the system by installing/upgrading packages
  full-upgrade - upgrade the system by removing/installing/upgrading packages
  edit-sources - edit the source information file
  satisfy - satisfy dependency strings

See apt(8) for more information about the available commands.
Configuration options and syntax is detailed in apt.conf(5).
Information about how to configure sources can be found in sources.list(5).
Package and version format is described in deb-version(7).
Security information can be found in apt-secure(8).
                                        This APT has Super Cow Powers.`;
  }

  const subCmd = args[0];

  if (subCmd === 'update') {
    updateCache = 'updated';
    return `Hit:1 https://deb.parrot.sh/parrot lory InRelease
Get:2 https://deb.parrot.sh/parrot lory-security InRelease [48.2 kB]
Get:3 https://deb.parrot.sh/parrot lory-updates InRelease [52.3 kB]
Get:4 https://deb.debian.org/debian testing InRelease [151 kB]
Get:5 https://deb.parrot.sh/parrot lory-security/main amd64 Packages [234 kB]
Get:6 https://deb.parrot.sh/parrot lory-security/main Translation-en [89.3 kB]
Get:7 https://deb.debian.org/debian testing/main amd64 Packages [8,945 kB]
Fetched 9,519 kB in 3s (3,173 kB/s)
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
124 packages can be upgraded. Run 'apt list --upgradable' to see them.`;
  }

  if (subCmd === 'upgrade') {
    if (!updateCache) {
      return `Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
Calculating upgrade... Done
0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.
Note: Run 'sudo apt update' first to refresh package list.`;
    }
    updateCache = null;
    return `Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
Calculating upgrade... Done
The following packages will be upgraded:
  curl firefox git libssl3 nmap python3 vim wget
8 upgraded, 0 newly installed, 0 to remove and 116 not upgraded.
Need to get 289 MB of archives.
After this operation, 4,096 B of additional disk space will be used.
Do you want to continue? [Y/n] Y
Get:1 https://deb.parrot.sh/parrot lory/main amd64 curl amd64 7.88.1-11 [345 kB]
Get:2 https://deb.parrot.sh/parrot lory/main amd64 git amd64 1:2.40.0-1 [5,123 kB]
...
Fetched 289 MB in 45s (6,422 kB/s)
(Reading database ... 142384 files and directories currently installed.)
Preparing to unpack .../curl_7.88.1-11_amd64.deb ...
Unpacking curl (7.88.1-11) over (7.88.1-10+deb12u4) ...
Setting up curl (7.88.1-11) ...
Processing triggers for man-db (2.11.2-2) ...
8 packages upgraded successfully.`;
  }

  if (subCmd === 'install') {
    const pkgName = args[1];
    if (!pkgName) return 'apt install: no package specified';

    const normalizedName = pkgName.replace(/-/g, '_');
    const pkg = PACKAGES_DB[normalizedName] || PACKAGES_DB[pkgName];

    if (pkg && installedPackages.has(pkgName)) {
      return `Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
${pkgName} is already the newest version (${pkg.version}).
0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.`;
    }

    const version = pkg?.version || '1.0.0-1';
    const size = pkg?.size || '1,234 kB';

    installedPackages.add(pkgName);

    return `Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
The following NEW packages will be installed:
  ${pkgName}
0 upgraded, 1 newly installed, 0 to remove and 0 not upgraded.
Need to get ${size} of archives.
After this operation, ${size} of additional disk space will be used.
Get:1 https://deb.parrot.sh/parrot lory/main amd64 ${pkgName} amd64 ${version} [${size}]
Fetched ${size} in 1s
Selecting previously unselected package ${pkgName}.
(Reading database ... 142384 files and directories currently installed.)
Preparing to unpack .../archives/${pkgName}_${version}_amd64.deb ...
Unpacking ${pkgName} (${version}) ...
Setting up ${pkgName} (${version}) ...
Processing triggers for man-db (2.11.2-2) ...`;
  }

  if (subCmd === 'remove') {
    const pkgName = args[1];
    if (!pkgName) return 'apt remove: no package specified';

    if (!installedPackages.has(pkgName)) {
      return `Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
Package '${pkgName}' is not installed, so not removed.
0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.`;
    }

    installedPackages.delete(pkgName);
    const pkg = PACKAGES_DB[pkgName];
    return `Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
The following packages will be REMOVED:
  ${pkgName}
0 upgraded, 0 newly installed, 1 to remove and 0 not upgraded.
After this operation, ${pkg?.size || '1,234 kB'} disk space will be freed.
Do you want to continue? [Y/n] Y
(Reading database ... 142384 files and directories currently installed.)
Removing ${pkgName} (${pkg?.version || '1.0.0-1'}) ...
Processing triggers for man-db (2.11.2-2) ...`;
  }

  if (subCmd === 'search') {
    const query = args[1];
    if (!query) return 'apt search: no search term specified';

    const results = Object.entries(PACKAGES_DB)
      .filter(([name, pkg]) =>
        name.includes(query) || pkg.description.toLowerCase().includes(query.toLowerCase())
      )
      .map(([name, pkg]) =>
        `${name}/${pkg.installed ? 'now' : 'parrot'} ${pkg.version} amd64
  ${pkg.description}`
      );

    if (results.length === 0) return `Sorting... Done
Full Text Search... Done
(no results found for '${query}')`;

    return `Sorting... Done
Full Text Search... Done
${results.join('\n\n')}`;
  }

  if (subCmd === 'list') {
    const upgradable = args.includes('--upgradable');
    const installed = args.includes('--installed');

    if (upgradable) {
      return `Listing... Done
curl/parrot 7.88.1-11 amd64 [upgradable from: 7.88.1-10+deb12u4]
git/parrot 1:2.40.0-1 amd64 [upgradable from: 1:2.39.2-1.1]
nmap/parrot 7.94+dfsg1-1 amd64 [upgradable from: 7.93+dfsg1-1]
vim/parrot 2:9.0.1500-1 amd64 [upgradable from: 2:9.0.1378-2]
python3/parrot 3.11.3-1 amd64 [upgradable from: 3.11.2-1+b1]`;
    }

    if (installed) {
      const pkgs = Object.entries(PACKAGES_DB)
        .filter(([name]) => installedPackages.has(name))
        .map(([name, pkg]) => `${name}/now ${pkg.version} amd64 [installed]`);
      return `Listing... Done\n${pkgs.join('\n')}`;
    }

    const allPkgs = Object.entries(PACKAGES_DB)
      .map(([name, pkg]) =>
        `${name}/parrot ${pkg.version} amd64${pkg.installed ? ' [installed]' : ''}`
      );
    return `Listing... Done\n${allPkgs.join('\n')}`;
  }

  if (subCmd === 'show') {
    const pkgName = args[1];
    if (!pkgName) return 'apt show: no package specified';
    const pkg = PACKAGES_DB[pkgName] || PACKAGES_DB[pkgName.replace(/-/g, '_')];
    if (!pkg) return `N: Can't select versions from package '${pkgName}' as it is purely virtual`;

    return `Package: ${pkgName}
Version: ${pkg.version}
Priority: optional
Section: net
Maintainer: Parrot Security <team@parrotsec.org>
Installed-Size: ${pkg.size}
Architecture: amd64
Description: ${pkg.description}
Homepage: https://parrotsec.org
Installed: ${installedPackages.has(pkgName) ? 'yes' : 'no'}`;
  }

  if (subCmd === 'autoremove') {
    return `Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
0 packages will be removed.
0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.`;
  }

  return `E: Invalid operation ${subCmd}`;
}

export function dpkg(ctx: CommandContext): string {
  const { args, flags } = ctx;

  if (flags.includes('l') || args.includes('-l')) {
    const header = `Desired=Unknown/Install/Remove/Purge/Hold
| Status=Not/Inst/Conf-files/Unpacked/halF-conf/Half-inst/trig-aWait/Trig-pend
|/ Err?=(none)/Reinst-required (Status,Err: uppercase=bad)
||/ Name                      Version                    Architecture Description
+++-=========================-==========================-============-======================================`;

    const pkgLines = Object.entries(PACKAGES_DB)
      .filter(([name]) => installedPackages.has(name))
      .map(([name, pkg]) => {
        const status = 'ii';
        const namePad = name.padEnd(25);
        const verPad = pkg.version.padEnd(26);
        const archPad = 'amd64       ';
        return `${status}  ${namePad} ${verPad} ${archPad} ${pkg.description.slice(0, 40)}`;
      });

    return [header, ...pkgLines].join('\n');
  }

  if (flags.includes('i') || args.includes('-i')) {
    const debFile = args.find(a => a.endsWith('.deb'));
    if (!debFile) return 'dpkg: error: need an action option\nType dpkg --help for help.';
    return `(Reading database ... 142384 files and directories currently installed.)
Preparing to unpack ${debFile} ...
Unpacking package from ${debFile} ...
Setting up package ...
Processing triggers for man-db (2.11.2-2) ...`;
  }

  if (flags.includes('s') || args.includes('-s')) {
    const pkgName = args.find(a => !a.startsWith('-'));
    if (!pkgName) return 'dpkg: error: need a package name argument';
    const pkg = PACKAGES_DB[pkgName];
    if (!pkg) return `dpkg-query: package '${pkgName}' is not installed and no information is available`;
    return `Package: ${pkgName}
Status: install ok installed
Priority: optional
Section: net
Installed-Size: ${pkg.size.replace(',', '')}
Architecture: amd64
Version: ${pkg.version}
Description: ${pkg.description}`;
  }

  return `Usage: dpkg [<option> ...] <command>

Commands:
  -l|--list [<pattern> ...]     List packages concisely.
  -s|--status <package> ...     Report status of specified package.
  -i|--install <.deb file>      Install the package.
  --help                        Show this help message.`;
}
