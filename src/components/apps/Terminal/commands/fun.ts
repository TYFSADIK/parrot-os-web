import { CommandContext } from './navigation';

const PARROT_ASCII = `
    ██████╗  █████╗ ██████╗ ██████╗  ██████╗ ████████╗
    ██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔═══██╗╚══██╔══╝
    ██████╔╝███████║██████╔╝██████╔╝██║   ██║   ██║
    ██╔═══╝ ██╔══██║██╔══██╗██╔══██╗██║   ██║   ██║
    ██║     ██║  ██║██║  ██║██║  ██║╚██████╔╝   ██║
    ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝    ╚═╝
`.trim();

const PARROT_LOGO_SMALL = `
       /\\
      /  \\
     / /\\ \\
    / /  \\ \\
   /_/    \\_\\
  /|  ()()  |\\
 / |   /\\   | \\
/__|__/  \\__|__\\
    |  ||  |
    |  ||  |
    \\  \\/  /
     \\    /
      \\  /
       \\/
`.trim();

const FORTUNES = [
  '"The quieter you become, the more you are able to hear." - Ram Dass',
  '"Knowledge is power." - Francis Bacon',
  '"Security is a process, not a product." - Bruce Schneier',
  '"The only truly secure system is one that is powered off, cast in a block of concrete and sealed in a lead room with armed guards - and even then I have my doubts." - Gene Spafford',
  '"There are two types of companies: those that have been hacked, and those who don\'t know they have been hacked." - John Chambers',
  '"Hackers are breaking the systems for profit. Before, it was about intellectual curiosity and pursuit of knowledge and thrill." - Kevin Mitnick',
  '"The Internet is the world\'s largest library. It\'s just that all the books are on the floor." - John Allen Paulos',
  '"Programming today is a race between software engineers striving to build bigger and better idiot-proof programs, and the Universe trying to produce bigger and better idiots. So far, the Universe is winning." - Rich Cook',
  '"Any sufficiently advanced technology is indistinguishable from magic." - Arthur C. Clarke',
  '"To protect privacy, we must be willing to be transparent." - Edward Snowden',
  '"Passwords are like underwear: don\'t let people see it, change it often, and you shouldn\'t share it with strangers." - Unknown',
  '"The strength of a security system is only as strong as its weakest link." - Unknown',
  '"In a world without walls, who needs Windows?" - Unknown',
  '"sudo make me a sandwich." - xkcd',
  '"There\'s no place like 127.0.0.1." - Unknown',
];

const COW_FACES: Record<string, string> = {
  default: `
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`,
  dead: `
        \\   ^__^
         \\  (xx)\\_______
            (__)\\       )\\/\\
             U  ||----w |
                ||     ||`,
  wink: `
        \\   ^__^
         \\  (o-)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`,
  tux: `
   \\
    \\
     .--.
    |o_o |
    |:_/ |
   //   \\ \\
  (|     | )
 /'\\_   _/\`\\
 \\___)=(___/`,
};

function wrapText(text: string, width: number = 40): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    if (current.length + word.length + 1 > width) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = current ? current + ' ' + word : word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function neofetch(ctx: CommandContext): string {
  const logo = `       /\\         `;
  const cols = [
    '       /  \\        ',
    '      / /\\ \\       ',
    '     / /  \\ \\      ',
    '    /_/    \\_\\     ',
    '   /|  ()()  |\\   ',
    '  / |   /\\   | \\  ',
    ' /__|__/  \\__|__\\ ',
    '     |  ||  |     ',
    '     |  ||  |     ',
    '     \\  \\/  /     ',
    '      \\    /      ',
    '       \\  /       ',
    '        \\/        ',
  ];

  const now = new Date();
  const uptimeHours = Math.floor((now.getTime() - new Date('2026-03-29T07:30:00').getTime()) / 3600000);
  const uptimeMins = Math.floor(((now.getTime() - new Date('2026-03-29T07:30:00').getTime()) % 3600000) / 60000);

  const info = [
    '\x1b[1;32mparrot\x1b[0m@\x1b[1;32mparrot-os\x1b[0m',
    '-------------------',
    '\x1b[1;32mOS\x1b[0m: Parrot OS 5.3 x86_64',
    '\x1b[1;32mHost\x1b[0m: VirtualBox 7.0.6',
    '\x1b[1;32mKernel\x1b[0m: 6.1.0-1parrot1-amd64',
    '\x1b[1;32mUptime\x1b[0m: ' + uptimeHours + ' hours, ' + uptimeMins + ' mins',
    '\x1b[1;32mPackages\x1b[0m: 2847 (dpkg)',
    '\x1b[1;32mShell\x1b[0m: bash 5.2.15',
    '\x1b[1;32mResolution\x1b[0m: 1920x1080',
    '\x1b[1;32mDE\x1b[0m: MATE 1.26.0',
    '\x1b[1;32mWM\x1b[0m: Metacity (Marco)',
    '\x1b[1;32mWM Theme\x1b[0m: Arc-Dark',
    '\x1b[1;32mTheme\x1b[0m: Arc-Dark [GTK2/3]',
    '\x1b[1;32mIcons\x1b[0m: Papirus-Dark [GTK2/3]',
    '\x1b[1;32mTerminal\x1b[0m: mate-terminal',
    '\x1b[1;32mCPU\x1b[0m: Intel Core i7-10750H (8) @ 2.60GHz',
    '\x1b[1;32mGPU\x1b[0m: NVIDIA GeForce GTX 1650',
    '\x1b[1;32mMemory\x1b[0m: 8456MiB / 16384MiB',
    '',
    '\x1b[30m███\x1b[31m███\x1b[32m███\x1b[33m███\x1b[34m███\x1b[35m███\x1b[36m███\x1b[37m███\x1b[0m',
    '\x1b[90m███\x1b[91m███\x1b[92m███\x1b[93m███\x1b[94m███\x1b[95m███\x1b[96m███\x1b[97m███\x1b[0m',
  ];

  const maxRows = Math.max(cols.length, info.length);
  const lines: string[] = [];

  for (let i = 0; i < maxRows; i++) {
    const logoCol = i < cols.length ? cols[i] : '                   ';
    const infoCol = i < info.length ? info[i] : '';
    lines.push(`\x1b[1;32m${logoCol}\x1b[0m ${infoCol}`);
  }

  return lines.join('\n');
}

export function cowsay(ctx: CommandContext): string {
  const { args } = ctx;
  const faceFlag = args.indexOf('-f');
  let face = 'default';
  let message: string;

  if (faceFlag !== -1 && args[faceFlag + 1]) {
    face = args[faceFlag + 1];
    message = args.filter((_, i) => i !== faceFlag && i !== faceFlag + 1 && !args[i].startsWith('-')).join(' ');
  } else {
    message = args.filter(a => !a.startsWith('-')).join(' ');
  }

  if (!message) message = 'Moo!';

  const lines = wrapText(message, 38);
  const maxLen = Math.max(...lines.map(l => l.length));
  const border = '-'.repeat(maxLen + 2);

  const bubble: string[] = [' ' + '_'.repeat(maxLen + 2)];
  if (lines.length === 1) {
    bubble.push(`< ${lines[0].padEnd(maxLen)} >`);
  } else {
    lines.forEach((line, i) => {
      const padded = line.padEnd(maxLen);
      if (i === 0) bubble.push(`/ ${padded} \\`);
      else if (i === lines.length - 1) bubble.push(`\\ ${padded} /`);
      else bubble.push(`| ${padded} |`);
    });
  }
  bubble.push(' ' + '-'.repeat(maxLen + 2));

  const cowFace = COW_FACES[face] || COW_FACES.default;
  return [...bubble, cowFace].join('\n');
}

export function fortune(ctx: CommandContext): string {
  return FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
}

export function sl(ctx: CommandContext): string {
  return `
         ====        ________                ___________
     _D _|  |_______/        \\__I_I_____===__|_________|
      |(_)---  |   H\\________/ |   |        =|___ ___|      _________________
      /     |  |   H  |  |     |   |         ||_| |_||     _|                \\_____A
     |      |  |   H  |__--------------------| [___] |   =|                        |
     | ________|___H__/__|_____/[][]~\\_______|       |   -|                        |
     |/ |   |-----------I_____I [][] []  D   |=======|____|________________________|_
   __/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__|__________________________|_
    |/-=|___|=    ||    ||    ||    |_____/~\\___/          |_D__D__D_|  |_D__D__D_|
     \\_/      \\_O=====O=====O=====O/      \\_/               \\_/   \\_/    \\_/   \\_/

(Oops! You ran sl instead of ls. Try: ls)`;
}

export function figlet(ctx: CommandContext): string {
  const { args } = ctx;
  const text = args.filter(a => !a.startsWith('-')).join(' ') || 'Parrot OS';

  // Simple ASCII art font simulation
  const charMap: Record<string, string[]> = {
    'A': ['  __ ', ' /  \\', '/ /\\ \\','/_/  \\_\\'],
    'B': [' __ ','|__)', '|__)',''],
    ' ': ['   ','   ','   ',''],
  };

  // Simple bigtext rendering using box chars
  const bigLetters: Record<string, string[]> = {
    'P': ['██████╗ ', '██╔══██╗', '██████╔╝', '██╔═══╝ ', '██║     ', '╚═╝     '],
    'A': [' █████╗ ', '██╔══██╗', '███████║', '██╔══██║', '██║  ██║', '╚═╝  ╚═╝'],
    'R': ['██████╗ ', '██╔══██╗', '██████╔╝', '██╔══██╗', '██║  ██║', '╚═╝  ╚═╝'],
    'O': ['╔═══╗   ', '██╔══██╗', '██║  ██║', '██║  ██║', '╚██████╔╝', ' ╚═════╝ '],
    'T': ['████████╗', '╚══██╔══╝', '   ██║   ', '   ██║   ', '   ██║   ', '   ╚═╝   '],
    'S': ['███████╗', '██╔════╝', '███████╗', '╚════██║', '███████║', '╚══════╝'],
    'I': ['██╗', '██║', '██║', '██║', '██║', '╚═╝'],
    'L': ['██╗     ', '██║     ', '██║     ', '██║     ', '███████╗', '╚══════╝'],
    'N': ['███╗   ██╗', '████╗  ██║', '██╔██╗ ██║', '██║╚██╗██║', '██║ ╚████║', '╚═╝  ╚═══╝'],
    'U': ['██╗  ██╗', '██║  ██║', '██║  ██║', '██║  ██║', '╚██████╔╝', ' ╚═════╝ '],
    'X': ['██╗  ██╗', '╚██╗██╔╝', ' ╚███╔╝ ', ' ██╔██╗ ', '██╔╝ ██╗', '╚═╝  ╚═╝'],
    ' ': ['   ', '   ', '   ', '   ', '   ', '   '],
  };

  const chars = text.toUpperCase().split('');
  const height = 6;
  const rows: string[] = Array(height).fill('');

  chars.forEach(c => {
    const letterLines = bigLetters[c] || bigLetters[' '] || Array(height).fill('  ');
    for (let i = 0; i < height; i++) {
      rows[i] += (letterLines[i] || '  ') + ' ';
    }
  });

  return rows.join('\n');
}

export function lolcat(ctx: CommandContext): string {
  const { args } = ctx;
  const text = args.filter(a => !a.startsWith('-')).join(' ') || 'Hello, Parrot OS!';

  const colors = ['\x1b[91m', '\x1b[93m', '\x1b[92m', '\x1b[96m', '\x1b[94m', '\x1b[95m'];
  let result = '';
  let colorIdx = 0;

  for (const char of text) {
    result += colors[colorIdx % colors.length] + char;
    colorIdx++;
  }

  return result + '\x1b[0m';
}

export function matrix(ctx: CommandContext): string {
  const chars = '日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345789Z:.-=+*#%@';
  const width = 70;
  const height = 15;
  const lines: string[] = [];

  for (let row = 0; row < height; row++) {
    let line = '\x1b[32m';
    for (let col = 0; col < width; col++) {
      const intensity = Math.random();
      if (intensity > 0.8) line += '\x1b[1;32m';
      else if (intensity > 0.4) line += '\x1b[32m';
      else line += '\x1b[2;32m';
      line += chars[Math.floor(Math.random() * chars.length)];
    }
    lines.push(line + '\x1b[0m');
  }

  return lines.join('\n') + '\n\x1b[0m(Press Ctrl+C to stop)';
}

export function banner(ctx: CommandContext): string {
  const { args } = ctx;
  const text = args.filter(a => !a.startsWith('-')).join(' ') || 'PARROT';
  return figlet({ ...ctx, args: [text] });
}

export function toilet(ctx: CommandContext): string {
  return figlet(ctx);
}
