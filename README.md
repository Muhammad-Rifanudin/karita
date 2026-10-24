# KARITA — E-Katalog Roti Kering Artisan & Kue Kering Wijsman

Website E-Katalog 1 halaman (Single-Page E-Catalog) interaktif untuk penjualan aneka roti kering, bagelen butter, kue kering tradisi, cookies, dan hampers eksklusif. Dilengkapi keranjang belanja reaktif, filter kategori, live search, quick view modal, dan pemesanan otomatis terintegrasi ke **WhatsApp 08771188500**.

---

## 📁 Struktur File & Folder yang Terstruktur & Rapi

```
KARITA/
├── index.html              # Halaman utama e-katalog (Single Page, responsif & interaktif)
├── server.js               # Web server static Node.js (port 3001)
├── css/
│   ├── variables.css       # Design tokens (palet warna warm luxury bakery, tipografi, bayangan)
│   ├── style.css           # Styling utama (hero, cards, drawer keranjang, modal, animasi)
│   └── responsive.css      # Optimasi tampilan mobile, tablet, dan desktop
├── js/
│   ├── data.js             # Dataset produk, deskripsi otentik, komposisi, harga & stok
│   ├── cart.js             # Pengelola keranjang belanja (localStorage & state reaktif)
│   ├── whatsapp.js         # Generator pesan order & redirect ke WA 08771188500
│   └── app.js              # Interaksi UI (live search, filter kategori, modal, drawer, toast, FAQ)
└── assets/
    └── images/             # Foto food photography roti kering resolusi tinggi
        ├── hero-bakery.jpg
        ├── bagelen-butter.jpg
        ├── garlic-toast.jpg
        ├── nastar-gold.jpg
        ├── kastengel-cheese.jpg
        ├── putri-salju.jpg
        ├── choco-biscotti.jpg
        ├── palm-cheese.jpg
        ├── almond-crunch.jpg
        ├── hampers-box.jpg
        └── artisan-story.jpg
```

---

## ✨ Fitur-Fitur Utama

1. **Desain Modern, Berkelas & Otentik**:
   - Palet warna hangat khas artisan bakery (*warm espresso, golden honey butter, soft cream*).
   - Tipografi editorial elegan (*Playfair Display* berpadu dengan *Plus Jakarta Sans*).
   - Micro-animations, transisi halus, dan glassmorphism pada header dan card.

2. **1 Halaman Saja (Tanpa Navbar Eksternal)**:
   - Pengalaman belanja terfokus tanpa navigasi ke halaman lain.
   - Smooth in-page scrolling ke bagian Katalog, Keunggulan, Cara Pesan, Testimoni, dan FAQ.

3. **Katalog Produk Interaktif**:
   - **Filter Kategori Cepat**: Semua Koleksi, Bagelen & Toast Kering, Kue Kering Tradisi, Cookies & Biscotti, Paket Hampers & Gift.
   - **Live Search**: Pencarian instan berdasarkan nama roti kering, deskripsi, atau bahan (misal: *Wijsman*, *keju*, *almond*).
   - **Urutkan Produk**: Berdasarkan Rekomendasi, Best Seller, atau Harga.

4. **Quick View Modal (Detail Produk)**:
   - Foto resolusi tinggi, informasi berat bersih (*netto*), daya simpan (4–6 bulan), dan pills komposisi bahan alami.
   - Pengatur jumlah toples (+ / -) sebelum dimasukkan ke keranjang atau dipesan.

5. **Keranjang Belanja Reaktif (Flyout Slide Drawer)**:
   - Indikator badge toples yang otomatis ter-update secara *real-time*.
   - Ubah kuantitas atau hapus item langsung dari drawer.
   - Formulir data pembeli opsional (Nama, Alamat Pengiriman, Catatan Ucapan/Request).
   - Perhitungan otomatis subtotal dan informasi packing gratis.

6. **Integrasi Pemesanan WhatsApp (08771188500)**:
   - **Pesan Cepat 1 Produk**: Tombol *Pesan WA* di setiap kartu produk untuk order kilat.
   - **Checkout Keranjang Lengkap**: Tombol hijau di dalam drawer keranjang menyusun pesan otomatis yang rapi dan sopan langsung ke nomor WhatsApp resmi **08771188500**.
   - **Floating WhatsApp Button**: Tombol melayang di pojok kiri bawah untuk konsultasi langsung 24 jam.

---

## 🚀 Cara Menjalankan Website Secara Lokal

1. Buka terminal di folder project:
   ```powershell
   cd d:\Project\KARITA
   ```
2. Jalankan server lokal:
   ```powershell
   node server.js
   ```
3. Buka browser dan akses:
   ```
   http://localhost:3001
   ```
   *(Atau klik ganda file `index.html` untuk membuka langsung di browser)*.
