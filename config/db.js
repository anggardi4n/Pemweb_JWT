const mysql = require('mysql');
// buat konfigurasi koneksi 
const koneksi = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'latihanrestapi'
});

// koneksi database
koneksi.connect((err) => {
    if (err) throw err;
        console.log('MySQL Connected..'); 
});

const limiter = rateLimit({ 
    windowMs: 15 * 60 * 1000, // 15 menit 
    max: 100 // batas 100 permintaan per IP 
  }); 

// Middleware untuk mencatat akses 
const accessLogger = (req, res, next) => { 
console.log(`Akses ke ${req.originalUrl} oleh ${req.ip}`); 
next(); 
}; 

module.exports = koneksi;