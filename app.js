const express = require('express');
const bodyParser = require('body-parser');
const koneksi = require ('./config/db');
const app = express ();
const PORT = process.env.PORT || 3000;

//set body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//create data
app.post('/api/latihanrestapi', (req, res) => {
    //buat variabel penampung data dan querry sql
    const data = {...req.body};
    const querySql = 'INSERT INTO latihanrestapi SET ?';

    // jalankan query 
    koneksi.query(querySql, data, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({message: 'Gagal insert data!', error:err});
        }

        // jika request berhasil
        res.status(201).json ({ succes: true, message: 'Berhasil Insert Data!'});
    });
});

// read data / get data
app.get('/api/latihanrestapi', (req, res) => {
    // buat query sql
 const querySql = 'SELECT * FROM latihanrestapi';
  // jalankan query
  koneksi.query(querySql, (err, rows, field)  => {
    // error handling
    if (err) {
        return res.status(500).json({ message: 'Ada kesalahan', error: err });
    }

    // jika request berhasil
    res.status(200).json({ success: true, data: rows });
  });
});

 // update data
 app.put('/api/latihanrestapi/:id', (req, res) => {
    // buat variabel penampung data dan query sql
    const data = { ...req.body };
    const querySearch = 'SELECT * FROM latihanrestapi WHERE id = ?';
    const queryUpdate = 'UPDATE latihanrestapi SET ? WHERE id = ?';

     // jalankan query untuk melakukan pencarian data
     koneksi.query(querySearch, req.params.id, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }
        // jika id yang dimasukkan sesuai dengan data yang ada di db
        if (rows.length) {
            // jalankan query update
            koneksi.query(queryUpdate, [data, req.params.id], (err, rows, field) => {
                // error handling
                if (err) {
                    return res.status(500).json({ message: 'Ada kesalahan', error: err });
                }
                // jika update berhasil
                res.status(200).json({ success: true, message: 'Berhasil update data!' });
            });
        } else {
            return res.status(404).json({ message: 'Data tidak ditemukan!', success: false });
        }
    });
 });

    // delete data
    app.delete('/api/latihanrestapi/:id', (req, res) => {
        // buat query sql untuk mencari data dan hapus
        const querySearch = 'SELECT * FROM latihanrestapi WHERE id = ?';
        const queryDelete = 'DELETE FROM latihanrestapi WHERE id = ?';
        // jalankan query untuk melakukan pencarian data
        koneksi.query(querySearch, req.params.id, (err, rows, field) => {
        // error handling
        if (err) {
        return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }
    // jika id yang dimasukkan sesuai dengan data yang ada di db
    if (rows.length) {
        // jalankan query delete
        koneksi.query(queryDelete, req.params.id, (err, rows, field) => {
            // error handling
            if (err) {
                return res.status(500).json({ message: 'Ada kesalahan', error: err });
            }
            // jika delete berhasil
            res.status(200).json({ success: true, message: 'Berhasil hapus data!' });
        });
        } else {
        return res.status(404).json({ message: 'Data tidak ditemukan!', success: false });
        }
        });
    });  

  
app.use(limiter); 
app.use(accessLogger);
app.post("/api/login", (req, res) => { 
    const { username, password } = req.body; 
   
    // Validasi username dan password (ganti dengan logika autentikasi Anda) 
    if (username === "admin" && password === "password") { 
      const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" }); 
      validTokens.add(token); 
      return res.status(200).json({ token }); 
    } 
    return res.status(401).json({ message: "Username atau password salah" }); 
  });

  const authenticateToken = (req, res, next) => { 
    const token = req.headers["authorization"]?.split(" ")[1]; 
    if (!token || revokedTokens.has(token)) return res.sendStatus(403); 
   
    jwt.verify(token, secretKey, (err, user) => { 
      if (err) return res.sendStatus(403); 
      req.user = user; 
      next(); 
    }); 
  }; 

  app.get("/api/protected", authenticateToken, (req, res) => { 
    res.status(200).json({ message: "Data yang dilindungi", user: req.user }); 
  }); 
  
//revoke 
  app.post("/api/revoke", (req, res) => { 
    const { token } = req.body; 
    if (validTokens.has(token)) { 
    validTokens.delete(token); 
    revokedTokens.add(token); 
    return res.status(200).json({ message: "Token berhasil direvoke" }); 
    } 
    return res.status(400).json({ message: "Token tidak valid" }); 
    }); 

//buat servernya
app.listen(PORT, () => console.log('Server Running at port: $ {PORT}'));