const express = require('express');
const multer = require('multer');
const { createHash } = require('crypto');
const path = require('path');
const app = express();
const fs = require('fs');

app.use('/down', express.static('files'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/static/index.html'));
});

app.get('/files.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/static/files.html'));
});

app.get('/list', (req, res) => {
    const files = fs.readdirSync('./files/');
    res.json({ files });
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = 'files/';
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const originalName = path.parse(file.originalname).name;
      const extension = path.extname(file.originalname);
      cb(null, `${(createHash('sha256').update(extension+originalName+Date.now()+extension+originalName).digest('hex'))}${extension}`);
    },
});  

const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
    console.log(req.file);
    res.json({ message: 'File uploaded successfully', file: req.file });
});

app.listen(3000)