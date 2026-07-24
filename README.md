# Portofolio Minimalis - Vercel Minimal System

Portofolio web modern, bersih, dan berkinerja tinggi yang dirancang secara tepat mengikuti spesifikasi desainer dalam **`Design.md`** (System: *Vercel Minimal*).

---

## 🌟 Fitur Utama

1. **Desain Vercel Minimal (Strict Presets from Design.md)**:
   - Palette warna presisi: Primary `#171717`, Neutral `#FAFAFA`, Surface `#FFFFFF`, Border `#E5E7EB`, Muted `#F5F5F5`.
   - Typografi Geist Font dengan penyesuaian *letter-spacing* & *line-height* presisi.
   - Tombol Pill-Shaped (`rounded.lg` / 100px radius), Card Radius 8px, dan Chip Badge Pill-Shaped.
   - Penataan ruang yang luas (*spacious breathing room*).

2. **Fleksibilitas Edit & Kustomisasi Lengkap ("Mudah Diubah-ubah")**:
   - **Visual Live Editor (Drawer)**: Klik tombol **"Edit Portofolio"** di Navbar untuk membuka panel editor visual langsung tanpa perlu koding.
   - **Edit File JSON**: Semua data tersimpan rapi di [`src/data/defaultPortfolio.json`](file:///c:/portofilo/src/data/defaultPortfolio.json) yang dapat Anda edit langsung di editor kode favorit Anda.
   - **Ekspor & Impor JSON**: Unduh file konfigurasi `.json` dan unggah kembali kapan saja.
   - **Penyimpanan Lokal (localStorage)**: Perubahan yang Anda lakukan melalui layar web akan tersimpan secara otomatis di peramban Anda.
   - **Reset ke Default**: Tombol reset satu-klik untuk mengembalikan ke tampilan awal sesuai `Design.md`.

3. **Komponen Interaktif**:
   - **Proyek Unggulan**: Filter berdasarkan kategori ("Semua", "Featured", "AI/ML", "Fullstack", dll.) & Fitur Pencarian Real-time.
   - **Filter Stack & Keahlian**: Pengelompokan chip teknikal yang rapi.
   - **Timeline Pengalaman Kerja**: Rekam jejak karir minimalis.
   - **Formulir & Kontak Langsung**: Tombol Salin Email 1-klik dan Formulir Pesan interaktif dengan notifikasi sukses.
   - **Dark Mode Toggle**: Dukungan tema gelap/terang tanpa merusak estetika *high-contrast*.

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi telah disiapkan dan server pengembangan Vite sudah berjalan di komputer Anda.

### 1. Menjalankan Server Pengembangan (Dev Mode)
```bash
npm run dev
```
Akses di browser Anda: **`http://localhost:5173/`**

### 2. Membangun Bundle Produksi (Build Output)
```bash
npm run build
```
Hasil build akan tersimpan di folder `dist/` siap untuk di-deploy ke Vercel, Netlify, atau GitHub Pages.

---

## 📝 Cara Mengubah Data Portofolio

Ada **2 cara** untuk mengubah isi portofolio Anda:

### Cara 1: Menggunakan Live Editor di Website (Paling Mudah)
1. Buka website di peramban (`http://localhost:5173/`).
2. Klik tombol **"Edit Portofolio"** di pojok kanan atas (Navbar).
3. Ubah nama, teks hero, daftar proyek, pengalaman kerja, atau link media sosial pada tab yang tersedia.
4. Perubahan langsung terlihat secara real-time!

### Cara 2: Mengedit File JSON di Kode
Buka file [`src/data/defaultPortfolio.json`](file:///c:/portofilo/src/data/defaultPortfolio.json) dan ubah data teks sesuai keinginan Anda.

---

## 📁 Struktur Proyek

```
c:/portofilo/
├── Design.md                       # Spesifikasi Design System Vercel Minimal
├── index.html                      # HTML Entry point & Font Geist
├── package.json
├── src/
│   ├── main.jsx                    # React Mounting Point
│   ├── App.jsx                     # Komponen Utama
│   ├── index.css                   # Design Tokens & Styling dari Design.md
│   ├── data/
│   │   └── defaultPortfolio.json   # Configuration File Data Portofolio
│   ├── context/
│   │   └── PortfolioContext.jsx    # State Management & Storage Handler
│   └── components/
│       ├── Navbar.jsx              # Brand, Nav Links & Edit Button
│       ├── Hero.jsx                # High Contrast Headline & CTAs
│       ├── Projects.jsx            # Filter, Search & Cards Grid
│       ├── About.jsx               # Bio & Metric Cards
│       ├── Skills.jsx              # Categorized Tech Chips
│       ├── Experience.jsx          # Career Timeline
│       ├── Contact.jsx             # Copy Email & Interactive Form
│       ├── Footer.jsx              # Social Links & Scroll to Top
│       ├── EditDrawer.jsx          # Visual Live Customizer Panel
│       └── Icons.jsx               # Vector SVG Brand Icons
```
