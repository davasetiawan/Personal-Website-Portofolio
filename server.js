import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e6) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg|ico/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype.split('/')[1]);
    if (ext || mime) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file gambar yang diperbolehkan!'));
    }
  }
});

// Path to portfolio data file (di luar src/ agar Vite HMR tidak berkedip saat autosave)
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const dataFile = path.join(dataDir, 'portfolio.json');

// Jika file portfolio.json belum ada, salin dari defaultPortfolio.json
const defaultDataFile = path.join(__dirname, 'src', 'data', 'defaultPortfolio.json');
if (!fs.existsSync(dataFile) && fs.existsSync(defaultDataFile)) {
  fs.copyFileSync(defaultDataFile, dataFile);
}

// ==================== API ROUTES ====================

// GET /api/portfolio — Read portfolio data
app.get('/api/portfolio', (req, res) => {
  try {
    const raw = fs.readFileSync(dataFile, 'utf-8');
    res.json(JSON.parse(raw));
  } catch (err) {
    res.status(500).json({ error: 'Gagal membaca data portfolio', details: err.message });
  }
});

// PUT /api/portfolio — Save portfolio data
app.put('/api/portfolio', (req, res) => {
  try {
    const data = req.body;
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf-8');
    res.json({ success: true, message: 'Data berhasil disimpan!' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menyimpan data', details: err.message });
  }
});

// POST /api/upload — Upload image file
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Tidak ada file yang di-upload' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    url: fileUrl,
    filename: req.file.filename,
    size: req.file.size
  });
});

// DELETE /api/upload/:filename — Delete uploaded image
app.delete('/api/upload/:filename', (req, res) => {
  const filePath = path.join(uploadsDir, req.params.filename);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true, message: 'File berhasil dihapus' });
    } else {
      res.status(404).json({ error: 'File tidak ditemukan' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus file', details: err.message });
  }
});

// GET /api/uploads — List all uploaded files
app.get('/api/uploads', (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir).map(name => ({
      name,
      url: `/uploads/${name}`,
      size: fs.statSync(path.join(uploadsDir, name)).size
    }));
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: 'Gagal membaca daftar file' });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Portfolio API Server running at http://localhost:${PORT}`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
  console.log(`📄 Data file: ${dataFile}\n`);
});
