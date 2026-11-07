# Cendekia Lingua — Design Document

Tanggal: 7 November 2026
Status: approved (7 November 2026)
Deliverable: website company profile statis (HTML/CSS/JS) + halaman wireframe & style guide + ekspor PNG untuk Figma.

---

## 1. Intent & why

Cendekia Lingua adalah lembaga kursus bahasa Inggris, Jepang, dan Mandarin fiktif di Yogyakarta. Target audiensnya pelajar SMA, mahasiswa, dan pekerja muda. Selama ini calon siswa hanya tahu dari mulut ke mulut dan media sosial, jadi mereka kesulitan menjawab tiga pertanyaan dasar: program mana yang cocok, kapan jadwalnya, dan berapa biayanya.

Tujuan utama website: **mengumpulkan leads pendaftaran kelas percobaan gratis**. Tujuan kedua: membuat lembaga terlihat kredibel dan mudah dipahami dalam sekali scan.

Project ini juga dipakai sebagai studi kasus portfolio desain web. Karena itu kualitas visual, hierarki konten, responsivitas, aksesibilitas, dan dokumentasi prosesnya sama pentingnya dengan fungsinya.

**Definisi sukses**
- Dalam < 1 menit, pengunjung bisa menemukan program yang sesuai usia/tujuan, jadwal, dan kisaran biaya.
- CTA kelas gratis terlihat jelas di desktop dan mobile.
- Form pendaftaran bisa diselesaikan tanpa bingung; success state menjelaskan langkah berikutnya.
- Hasilnya terasa seperti website lembaga kursus nyata, bukan template tutorial.

---

## 2. Goals, non-goals, anti-goals

**Goals**
- Menjelaskan profil lembaga, program, pengajar, testimoni, dan cara daftar dengan hierarki yang jelas.
- Menampilkan tiga bahasa (Inggris, Jepang, Mandarin) tanpa memakai stereotip/flag negara.
- Membuat biaya dan jadwal transparan supaya calon siswa tidak perlu bertanya satu-satu.
- Menyediakan form leads yang singkat, mobile-first, dengan validasi dan success state.
- Membangun identitas biru tua + kuning hangat yang profesional tapi ramah remaja.
- Menghasilkan wireframe, mockup, style guide, dan ekspor PNG yang siap diimpor ke Figma.

**Non-goals**
- Backend, database, CRM, payment gateway, atau pengiriman leads sungguhan.
- Portal siswa, login, LMS, blog, atau CMS.
- Website multi-bahasa (isi situs tetap Bahasa Indonesia; Inggris/Jepang/Mandarin adalah program).
- Halaman terpisah untuk profil, pengajar, dan testimoni; ketiganya jadi section di homepage.
- Stock photo berbayar atau ilustrasi custom yang berat.

**Anti-goals**
- Gradient ungu-biru ala SaaS, glassmorphism, atau layout template yang generik.
- Terlalu banyak badge/diskon palsu dan urgency yang tidak realistis.
- Form panjang, pertanyaan ganda, atau CTA yang tersembunyi.
- Animasi yang mengganggu, autoplay, atau teks yang tidak terbaca di mobile.
- Menyembunyikan harga dengan alasan "hubungi kami".

---

## 3. Constraints

- **Medium:** HTML + CSS + vanilla JS, tanpa build step dan tanpa dependency runtime.
- **Tools:** Figma (untuk import hasil ekspor), Google Fonts, Coolors (palet sudah ditetapkan di doc ini).
- **Output Figma:** PNG per screen, bukan layer editable. Figma dipakai sebagai wadah presentasi; versi interaktif tetap website live.
- **Logo:** klien disebut sudah punya logo, tapi file tidak tersedia. Aku membuat wordmark + mark sementara berbasis inisial "CL". Mudah diganti kalau logo asli diberikan.
- **Data:** semua nama, alamat, nomor telepon, jadwal, harga, dan testimoni fiktif. Harus ditandai demo di README dan footer.
- **Nomor WhatsApp:** fiktif. Klik WhatsApp memunculkan dialog demo, bukan handoff ke aplikasi WhatsApp (pola yang sudah dipakai di project Klinik Sehat Lestari).
- **Waktu:** scope 5 hari kerja. Tidak ada fitur di luar daftar deliverable.
- **Browser target:** Chrome/Edge/Firefox/Safari modern. Tidak perlu IE.

---

## 4. Audiens & hierarki konten

**Persona utama**
1. **Siswa SMA (15–18)** — butuh program sepulang sekolah, biaya terjangkau, suasana tidak menakutkan. Orang tua ikut melihat harga dan kredibilitas.
2. **Mahasiswa (18–23)** — butuh speaking, persiapan IELTS/TOEFL, atau bahasa untuk pertukaran pelajar; jadwal fleksibel.
3. **Pekerja muda (22–30)** — butuh bahasa untuk karier, kelas malam/online, hasil cepat, dan bukti alumni.

**Jobs to be done**
- "Aku mau belajar bahasa X, tapi nggak tahu harus mulai dari level mana."
- "Apakah jadwalnya cocok dengan sekolah/kerja?"
- "Berapa biayanya, dan apakah ada kelas percobaan?"
- "Gurunya siapa, dan apakah alumninya benar-benar bisa?"

**Urutan homepage (desktop)**
1. Header + CTA kelas gratis.
2. Hero: proposisi nilai, bukti singkat, 2 CTA, visual tiga bahasa.
3. Stats strip: alumni, rating, pengajar, bahasa.
4. Program sesuai tujuan: segmented control SMA / Mahasiswa / Pekerja.
5. Kenapa Cendekia: 4 alasan konkret.
6. Jadwal & biaya transparan: tabel keenam program + tautan ke halaman program.
7. Pengajar: 3 kartu.
8. Testimoni: 3 kutipan + hasil.
9. Cara daftar: 3 langkah.
10. FAQ: 5 pertanyaan.
11. Kontak & lokasi.
12. Footer + disclaimer demo.

**Urutan mobile:** sama, tapi hero lebih pendek, segmented control bisa di-scroll horizontal, tabel biaya jadi kartu bertumpuk, dan CTA "Coba kelas gratis" menempel di bawah layar setelah hero.

---

## 5. Peta halaman

| File | Isi | Prioritas |
| --- | --- | --- |
| `index.html` | Homepage lengkap (section 1–12) | Wajib |
| `program.html` | Semua program, filter bahasa, detail level/jadwal/harga | Wajib |
| `daftar.html` | Form pendaftaran kelas percobaan + success state | Wajib |
| `wireframe.html` | Wireframe low-fidelity homepage desktop + mobile, dengan anotasi | Wajib |
| `style-guide.html` | Warna, tipografi, tombol, form, kartu, badge, spacing, do/don't | Wajib |

Halaman pendukung lain tidak dibuat. Profil lembaga, pengajar, dan testimoni menjadi section homepage supaya scope tetap 5 hari dan alur leads tidak pecah.

---

## 6. Arah visual

**Konsep:** "ruang belajar yang terang". Profesional, rapi, tapi tidak kaku. Biru tua memberi rasa percaya; kuning hangat memberi energi dan menandai aksi. Permukaan krem seperti kertas buku catatan, dengan aksen garis dan label kecil.

**Palet**
| Token | Hex | Pemakaian |
| --- | --- | --- |
| `--navy-900` | `#0B2239` | Header, footer, teks utama di latar terang, tombol sekunder |
| `--navy-700` | `#123A5C` | Hover, ilustrasi, border kuat |
| `--yellow-400` | `#F6C445` | CTA utama, highlight, badge |
| `--yellow-100` | `#FFF1C9` | Latar kartu program, highlight lembut |
| `--cream` | `#FAF6EC` | Latar halaman |
| `--white` | `#FFFFFF` | Kartu, form |
| `--ink` | `#16202B` | Body text |
| `--muted` | `#5C6B7A` | Teks sekunder |
| `--line` | `#D8D2C4` | Border dan pemisah |
| `--success` | `#1F7A5C` | Success state |

Kontras dicek minimal AA (4.5:1 untuk body, 3:1 untuk teks besar/UI). Kuning tidak dipakai sebagai teks di atas putih.

**Tipografi**
- Display/heading: **Bricolage Grotesque** 600–700. Karakternya ramah dan sedikit editorial, cocok untuk lembaga pendidikan yang tidak ingin terlihat korporat.
- Body/UI: **Plus Jakarta Sans** 400–700. Bersih, mudah dibaca, buatan Indonesia.
- Label kecil: Plus Jakarta Sans 600, uppercase, letter-spacing `.12em`, 11px. Tidak menambah font ketiga.
- Skala desktop: h1 `clamp(44px, 6vw, 76px)`, h2 `clamp(30px, 4vw, 44px)`, h3 22–24px, body 16–17px, small 13–14px.
- Skala mobile: h1 `clamp(36px, 10vw, 52px)`, h2 28–34px, body 16px.

**Bentuk & komponen**
- Radius kartu 18px, tombol pill (999px), input 12px.
- Border 1.5px navy pada kartu utama; shadow lembut `0 10px 30px rgba(11,34,57,.08)`.
- Tombol utama: kuning, teks navy, border navy 2px, offset shadow 3px; hover naik 2px dan shadow mengecil.
- Tombol sekunder: transparan, border navy, teks navy.
- Badge bahasa: pil kecil dengan titik warna + nama bahasa, bukan flag.
- Motif: tiga kartu bahasa bertumpuk dengan aksen karakter "A", "あ", "你"; garis highlighter kuning di belakang frasa kunci.
- Ikon: inline SVG garis 1.8px, satu set sederhana (jam, lokasi, WhatsApp, cek, panah).

**Yang dihindari**
- Flag negara untuk bahasa.
- Foto stok orang belajar yang generik.
- Gradient, blob, glassmorphism.
- Emoji sebagai ikon utama.
- Warna kuning untuk teks di latar putih.

---

## 7. Spesifikasi halaman

### 7.1 Homepage

**Header**
- Logo kiri, nav tengah (Program, Pengajar, Testimoni, Cara Daftar, FAQ), CTA "Kelas gratis" kanan.
- Mobile: logo + tombol menu; drawer berisi nav + CTA. Escape menutup, fokus kembali ke tombol.

**Hero**
- Eyebrow: "Kursus bahasa di Yogyakarta".
- H1: "Berani bicara, siap melangkah." dengan highlight kuning pada "berani bicara".
- Subcopy: satu paragraf yang menyebut Inggris, Jepang, Mandarin, untuk pelajar/mahasiswa/pekerja.
- CTA utama: "Coba kelas gratis" → `daftar.html`. CTA sekunder: "Lihat program" → `program.html`.
- Bukti: "4,9/5 dari 180 ulasan" + "1.200+ alumni".
- Visual: tiga kartu bahasa miring + chip "Kelas percobaan 60 menit • gratis".

**Stats strip**
- 1.200+ alumni, 4,9/5 rating, 12 pengajar, 3 bahasa. Angka statis (bukan counter animasi).

**Program sesuai tujuan**
- Segmented control: SMA | Mahasiswa | Pekerja. Default: SMA.
- Tiap tab menampilkan 2 kartu rekomendasi, dengan pemetaan tetap dan tanpa duplikasi:
  - SMA: English for Teens + Japanese N5.
  - Mahasiswa: English for Campus + Japanese N4 (lanjutan N5).
  - Pekerja: English for Work + Mandarin HSK 1–2 (percakapan kerja).
- Tiap kartu: bahasa, level, durasi, jadwal konkret, harga mulai, CTA. Data lengkap ada di matriks §8.
- Tab ini hanya rekomendasi, bukan satu-satunya jalan masuk. Tautan "Lihat semua program" membuka keenam program di `program.html`.
- Konten tab statis di HTML (bukan fetch), ditampilkan/disembunyikan dengan JS. Tanpa JS, keenam kartu tampil berurutan.

**Kenapa Cendekia**
- 4 kartu: maksimal 8 siswa per kelas; pengajar berpengalaman + native speaker; jadwal sore/Sabtu/online; kelas percobaan gratis tanpa komitmen.

**Jadwal & biaya**
- Tabel desktop 6 baris × 4 kolom: program, level, jadwal, biaya. Semua program muncul supaya tidak ada harga/jadwal yang disembunyikan.
- Mobile: tiap baris menjadi kartu bertumpuk; label kolom tetap terbaca.
- Catatan: "Harga demo, belum termasuk biaya buku. Jadwal bisa berubah; slot dikonfirmasi admin saat pendaftaran."

**Pengajar**
- 3 kartu: inisial besar, nama, bahasa, kredensial, satu kalimat personal. Tanpa foto asli; avatar inisial dengan latar kuning/navy.

**Testimoni**
- 1 kutipan besar + 2 kartu kecil. Nama, program, hasil konkret (mis. "N5 lulus", "berani presentasi di kantor").
- Label "Testimoni demo" kecil di bawah.

**Cara daftar**
- 3 langkah: isi form → dihubungi admin ≤ 1 hari kerja → ikut kelas percobaan.
- CTA "Mulai dari sini".

**FAQ**
- 5 pertanyaan: benar-benar gratis?, belum pernah belajar sama sekali?, online atau offline?, biaya dan pembayaran?, bisa pindah jadwal?
- Accordion; default semua tertutup. Bisa dibuka tanpa JS (pakai `<details>`).

**Kontak**
- Alamat fiktif: Jl. Kaliurang Km. 5 No. 18, Sleman, Yogyakarta.
- Jam: Senin–Jumat 10.00–20.00, Sabtu 09.00–15.00.
- WhatsApp + email demo.
- Peta: kartu ilustrasi statis (bukan embed), dengan catatan demo.

**Footer**
- Logo, ringkasan singkat, nav, kontak, sosial.
- Disclaimer: "Situs demo. Nama, harga, jadwal, dan testimoni fiktif."

**Sticky mobile CTA**
- Bar bawah: "Kelas percobaan gratis" + tombol "Daftar". Muncul setelah hero, aman dari safe-area iPhone.
- Body diberi padding-bottom agar tidak menutupi footer.

### 7.2 Halaman program

- Hero ringkas: "Program kursus" + penjelasan 1 paragraf.
- Filter chip: Semua | Inggris | Jepang | Mandarin. Filter via JS; tanpa JS semua tampil.
- 6 kartu program: English for Teens, English for Campus, English for Work, Japanese N5, Japanese N4, Mandarin HSK 1–2. Nama, target, level, durasi, jadwal, dan harga mengikuti matriks di §8 (satu sumber kebenaran).
- Tiap kartu: bahasa, target, level, durasi, jadwal konkret, harga, CTA "Ambil kelas percobaan" yang membawa `?program=<slug>` ke form (mis. `daftar.html?program=japanese-n5`).
- Section "Belum yakin levelmu?" → jelaskan placement test gratis + CTA.
- CTA band sebelum footer.

### 7.3 Halaman pendaftaran

- Layout desktop 2 kolom: form (kiri, 60%) + ringkasan manfaat (kanan, 40%, sticky).
- Mobile: form dulu, ringkasan di bawah; sticky CTA tidak ditampilkan di halaman ini.
- Field:
  - Nama lengkap (wajib, min 2).
  - Nomor WhatsApp (wajib, pola angka Indonesia 08/628).
  - Email (opsional, validasi format).
  - Kamu siapa: SMA / Mahasiswa / Pekerja (radio, wajib).
  - Bahasa: Inggris / Jepang / Mandarin (radio, wajib).
  - Level: Pemula / Pernah belajar / Menengah (select, wajib).
  - Jadwal favorit: Weekday sore (16.00–18.00) / Weekday malam (18.30–20.30) / Sabtu (09.00–15.30) / Online (select, wajib). Bucket ini dipetakan ke slot konkret di matriks §8; admin mengonfirmasi slot saat menghubungi.
  - Tujuan belajar (textarea, opsional, max 300).
  - Consent: "Saya setuju dihubungi via WhatsApp" (wajib).
- Validasi server-side tidak ada; validasi client-side dengan pesan inline, `aria-invalid`, dan fokus ke error pertama. Form memakai `novalidate` agar tampilan konsisten.
- Submit → panel sukses: ringkasan data, catatan "Mode demo, data tidak dikirim", tombol WhatsApp (dialog demo), dan tautan kembali.
- Kalau `?program=<slug>` ada di URL, form menampilkan nama program, memilih bahasa yang sesuai, dan memilih bucket jadwal yang cocok. Slug tidak dikenal → form kembali ke default tanpa error.

### 7.4 Wireframe

- Satu halaman presentasi berisi dua artboard: desktop 1440 dan mobile 390, gaya grayscale.
- Artboard tidak pernah reflow. Isinya digambar pada lebar literal 1440/390; halaman galeri yang menyesuaikan diri.
- ≥1360px: kedua artboard tampil berdampingan. Desktop diskalakan ±0.6 agar muat, mobile 1:1; beri keterangan "skala tampilan, bukan ukuran sebenarnya".
- <1360px: segmented switch "Desktop 1440 | Mobile 390", satu artboard per waktu. Mobile 1:1; desktop di dalam frame `overflow-x:auto` pada 1:1 supaya teks tetap terbaca. Body halaman tidak pernah scroll horizontal.
- Setiap section diberi label dan anotasi singkat (tujuan, elemen utama, CTA) di luar artboard, pada ukuran teks normal.
- Bukan gambar: HTML/CSS supaya bisa diperbarui dan diekspor.
- Mode ekspor `?artboard=desktop&export=1` atau `?artboard=mobile&export=1`: menyembunyikan chrome/switch, mematikan skala, dan merender satu artboard pada lebar aslinya untuk screenshot.

### 7.5 Style guide

- Logo: mark + wordmark, versi terang/gelap, clear space.
- Warna: swatch + hex + rasio kontras.
- Tipografi: specimen h1–small, aturan pemakaian.
- Tombol: primary, secondary, WhatsApp, disabled, focus.
- Form: default, focus, error, success.
- Komponen: badge bahasa, kartu program, kartu pengajar, testimoni, accordion.
- Spacing scale: 4/8/12/16/24/32/48/64.
- Radius, shadow, icon.
- Do/don't singkat.
- Catatan aksesibilitas.

---

## 8. Konten & data demo

Semua konten ditulis lengkap dalam Bahasa Indonesia. Tidak ada lorem ipsum.

**Identitas**
- Nama: Cendekia Lingua.
- Tagline: "Bahasa baru, percaya diri baru."
- Alamat: Jl. Kaliurang Km. 5 No. 18, Sleman, Yogyakarta (fiktif).
- WhatsApp: `6281200001234` (fiktif, dicegat dialog demo).
- Email: `halo@cendekialingua.demo`.
- Jam: Senin–Jumat 10.00–20.00; Sabtu 09.00–15.00.

**Matriks program (sumber kebenaran)**
| Program (slug) | Bahasa | Target | Level | Durasi | Jadwal | Biaya | Tab homepage |
| --- | --- | --- | --- | --- | --- | --- | --- |
| English for Teens (`english-teens`) | Inggris | SMA | Beginner–Intermediate | 12 sesi × 90 mnt | Selasa & Kamis 16.00–17.30 | Rp 850.000 | SMA |
| English for Campus (`english-campus`) | Inggris | Mahasiswa | Conversation | 12 sesi × 90 mnt | Senin & Rabu 18.30–20.00 | Rp 950.000 | Mahasiswa |
| English for Work (`english-work`) | Inggris | Pekerja | Business speaking | 10 sesi × 90 mnt | Selasa & Kamis 19.00–20.30 (online) | Rp 1.200.000 | Pekerja |
| Japanese N5 (`japanese-n5`) | Jepang | SMA–umum | Pemula (N5) | 16 sesi × 150 mnt | Sabtu 09.00–11.30 | Rp 1.100.000 | SMA |
| Japanese N4 (`japanese-n4`) | Jepang | Mahasiswa–umum | Lanjutan N4 (prasyarat N5) | 16 sesi × 150 mnt | Sabtu 13.00–15.30 | Rp 1.250.000 | Mahasiswa |
| Mandarin HSK 1–2 (`mandarin-hsk1-2`) | Mandarin | Pekerja–umum | Pemula (HSK 1–2) | 16 sesi × 90 mnt | Jumat 18.30–20.00 | Rp 1.100.000 | Pekerja |

- Tabel harga homepage memuat keenam baris di atas; tab homepage hanya menampilkan rekomendasi sesuai kolom terakhir. Jadi tidak ada program yang hilang dari halaman utama dan tidak ada duplikasi di tab.
- `?program=` memakai slug di kolom pertama. Pilihan bahasa dan bucket jadwal di form diturunkan dari baris yang sama.
- Slot di atas adalah jadwal tetap per modul. Kalau peserta butuh slot lain, admin menawarkan kelas online/pengganti tanpa menjanjikan slot baru di website.

**Pengajar**
- Ayu Prameswari — English; S.Pd., 8 tahun mengajar, fokus speaking untuk remaja.
- Kenji Nakamura — Japanese; penutur asli, JLPT N1, 6 tahun mengajar.
- Li Wei — Mandarin; HSK 6, 7 tahun mengajar, fokus percakapan kerja.

**Testimoni**
- Nadia, SMA kelas 11 — "Dulu takut salah grammar. Sekarang berani jadi moderator presentasi kelas."
- Rizky, mahasiswa — "N5 lulus dalam 5 bulan. Kelasnya kecil jadi selalu dapat giliran bicara."
- Sarah, pekerja — "English for Work bikin aku berani presentasi di depan klien."

**Harga**
- Rentang Rp 850.000–Rp 1.250.000 per modul. Tandai "harga demo".

---

## 9. Interaksi & aksesibilitas

- Mobile drawer, segmented control, filter program, FAQ, form validation, success panel, WhatsApp demo dialog.
- Skip link, landmark (`header/nav/main/footer`), heading berurutan, label form eksplisit.
- Fokus terlihat (outline kuning/navy), target sentuh ≥44px.
- `prefers-reduced-motion`: matikan transisi/animasi.
- Dialog: `role="dialog"`, `aria-modal`, fokus terperangkap, Escape menutup, fokus kembali ke pemicu, scroll body terkunci.
- Tanpa JS: nav tetap bisa diakses (tautan biasa di footer), FAQ pakai `<details>`, semua kartu program tampil, form tetap tampil tetapi submit tidak mengirim data (mode demo). Success state hanya dengan JS; sediakan catatan WhatsApp.
- Warna tidak menjadi satu-satunya penanda status.

---

## 10. Teknis

**Struktur file**
```
cendekia-lingua/
├── index.html
├── program.html
├── daftar.html
├── wireframe.html
├── style-guide.html
├── css/style.css
├── js/main.js
├── assets/
│   ├── logo.svg
│   └── og-image.jpg
├── docs/
│   ├── design-notes.md
│   ├── screenshots/
│   └── superpowers/specs/2026-11-07-cendekia-lingua-design.md
├── figma-import/
│   ├── 01-home-desktop-1440.png
│   ├── 02-home-mobile-390.png
│   ├── 02b-home-mobile-sticky-390.png
│   ├── 03-program-desktop-1440.png
│   ├── 04-program-mobile-390.png
│   ├── 05-daftar-mobile-390.png
│   ├── 06-wireframe-desktop-1440.png
│   ├── 07-wireframe-mobile-390.png
│   └── 08-style-guide-desktop-1440.png
├── README.md
└── robots.txt
```

- CSS custom properties untuk token; mobile-first; container 1180px; breakpoint 980/760/560.
- JS tanpa library: drawer, tabs, filter, dialog, form, sticky CTA, reveal.
- Font Google: Bricolage Grotesque + Plus Jakarta Sans, `display=swap`, preconnect.
- Semua gambar/ilustrasi inline SVG atau CSS; tidak ada foto eksternal.
- `robots.txt` mengizinkan semua (demo).
- Deployment Netlify site baru `cendekia-lingua`; verifikasi HTTPS, semua halaman 200, aset termuat.
- Ekspor PNG: **full-page**, bukan viewport; lebar CSS asli 1440/390; skala 1x; tanpa chrome browser. Overlay fixed (sticky CTA, drawer) disembunyikan saat capture full-page supaya tidak menutupi konten.
- `02b-home-mobile-sticky-390.png` adalah screenshot viewport 390 khusus untuk menunjukkan sticky CTA dalam keadaan aktif.
- Wireframe diekspor lewat mode `?artboard=desktop&export=1` / `?artboard=mobile&export=1` agar skalanya 1:1 dan tidak terpengaruh layout galeri.
- Style guide diekspor full-page pada 1440; daftar hanya diekspor versi mobile 390 sesuai brief.
- README: overview, problem, fitur, tech stack, halaman, cara menjalankan, data demo, keputusan desain, QA, screenshot, deploy, batasan, author.

---

## 11. Rencana 5 hari

| Hari | Fokus | Output |
| --- | --- | --- |
| 1 | Konten, wireframe desktop/mobile, token warna & tipografi | `wireframe.html`, draft style guide |
| 2 | Header, hero, stats, program by goal, CTA | Homepage bagian atas |
| 3 | Jadwal/biaya, pengajar, testimoni, FAQ, kontak, responsive | Homepage lengkap |
| 4 | Halaman program, form pendaftaran, interaksi | `program.html`, `daftar.html` |
| 5 | QA, aksesibilitas, ekspor PNG, deploy, README | Semua deliverable |

Implementasi sebenarnya bisa lebih cepat, tapi urutan ini menjaga scope dan memastikan tiap hari ada output yang bisa direview.

---

## 12. QA & acceptance criteria

- 5 halaman balas 200 saat live; tidak ada link internal rusak.
- Tidak ada horizontal overflow di 390, 768, dan 1440.
- Form: semua field wajib tervalidasi, pesan error jelas, success state muncul, data tidak dikirim.
- WhatsApp: semua tautan memunculkan dialog demo; tidak ada tab kosong.
- FAQ, drawer, tabs, filter berfungsi; Escape menutup drawer/dialog.
- 0 console error dan 0 request gagal.
- Lighthouse: Accessibility, Best Practices, SEO ≥ 95 (Performance dilaporkan apa adanya).
- Style guide cocok dengan implementasi (warna, font, tombol, radius).
- 9 PNG Figma-import tersedia (termasuk `02b` sticky CTA), semuanya full-page 1x kecuali `02b` yang viewport.
- Tabel harga homepage memuat keenam program; tab homepage tidak menduplikasi program; harga/jadwal sama dengan `program.html`.
- README dan design notes lengkap; status jujur (implemented/tested/not tested).
- Deploy Netlify terverifikasi.
- (Terpisah, setelah approval) tambahkan kartu project ke portfolio.

---

## 13. Keputusan yang aku ambil

1. Halaman terpisah hanya untuk program dan pendaftaran; profil, pengajar, dan testimoni jadi section homepage.
2. Logo sementara buatan sendiri karena file logo klien tidak tersedia.
3. Harga, jadwal, alamat, dan testimoni fiktif; ditandai demo.
4. Form tidak mengirim data; success state simulasi + dialog WhatsApp demo.
5. Ekspor Figma berupa PNG, bukan layer editable. Kalau nanti butuh editable, kita bahas jalur SVG.
6. Tidak memakai foto stok; visual dibangun dari tipografi, kartu, dan inline SVG.
7. Tidak menambah halaman blog, FAQ terpisah, atau halaman biaya terpisah.
8. Tab homepage adalah rekomendasi audiens, masing-masing 2 program tanpa duplikasi. Tabel harga memuat keenam program supaya homepage dan halaman program tidak saling bertentangan.
9. Jadwal ditulis sebagai slot konkret per program (hari + jam), bukan bucket mingguan. Form tetap memakai bucket preferensi yang dipetakan ke slot tersebut, dan admin mengonfirmasi slot saat menghubungi.
10. `wireframe.html` adalah galeri responsif, tetapi artboard-nya tidak pernah reflow. Di layar sempit ada switcher dan frame scroll untuk artboard desktop; ekspor memakai mode `export=1` pada skala 1:1.
11. PNG Figma berupa full-page 1x, bukan viewport, plus satu screenshot viewport mobile untuk sticky CTA.

---

## 14. Risiko & mitigasi

| Risiko | Mitigasi |
| --- | --- |
| Figma tidak editable | Jelaskan di README; PNG untuk presentasi, website live untuk interaksi |
| Data fiktif disangka nyata | Disclaimer footer + README + dialog WhatsApp |
| Font Google lambat/diblokir | `display=swap` + fallback system font |
| Sticky CTA menutupi konten | Padding-bottom di body + safe-area inset |
| Form dianggap mengirim data | Copy "Mode demo" di tombol submit dan success panel |
| Scope melebar | Tolak halaman/fitur di luar daftar; review tiap hari |
| Kontras kuning rendah | Kuning hanya untuk latar/tombol, bukan teks body |
