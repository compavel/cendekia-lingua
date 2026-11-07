# Catatan Desain — Cendekia Lingua

Dokumen ini menjelaskan alasan di balik keputusan visual dan teknis. Bukan panduan memakai website, melainkan bahan untuk menjelaskan project saat interview dan catatan kalau nanti dilanjutkan.

## 1. Brief dan batasan

- Klien fiktif: Cendekia Lingua, kursus bahasa Inggris, Jepang, dan Mandarin di Yogyakarta.
- Target pengguna: pelajar SMA, mahasiswa, dan pekerja muda.
- Tujuan utama: leads kelas percobaan gratis.
- Output: wireframe homepage desktop/mobile, mockup homepage desktop, halaman program + form pendaftaran mobile, style guide singkat, dan PNG untuk Figma.
- Teknologi: HTML, CSS, dan JavaScript statis. Tanpa backend, database, atau pengiriman form.
- Data: nama, harga, jadwal, alamat, testimoni, dan nomor WhatsApp fiktif.
- Deadline brief: 5 hari kerja.

Batasan yang paling memengaruhi desain adalah tidak adanya backend. Karena itu form tidak boleh berpura-pura mengirim data, dan satu-satunya jalur kontak yang realistis adalah WhatsApp. Nomor WhatsApp juga fiktif, jadi tombolnya membuka dialog demo, bukan handoff ke aplikasi WhatsApp.

## 2. Pekerjaan pengguna

Pertanyaan yang biasanya muncul sebelum mendaftar kursus:

| Pertanyaan | Dijawab di mana |
| --- | --- |
| Program apa yang cocok untukku? | Tab audiens di homepage, katalog program |
| Berapa biayanya? | Kartu program, tabel harga, halaman program |
| Kapan jadwalnya? | Kartu program dan tabel harga, slot konkret |
| Siapa pengajarnya? | Section pengajar |
| Apakah cocok untuk levelku? | Label level, placement test |
| Bagaimana cara mendaftar? | Tiga langkah, form, FAQ |
| Bisa coba dulu? | CTA “Coba kelas gratis” di hampir setiap section |

Implikasi desain:

- Jawaban utama harus terlihat di atas lipatan: program, harga mulai, dan CTA.
- Pengunjung tidak boleh dipaksa membaca enam program sekaligus. Tab audiens menyaring dua program yang relevan.
- Harga dan jadwal harus konsisten di homepage dan halaman program. Informasi yang berbeda antar halaman langsung merusak kepercayaan.
- Form harus singkat, tapi cukup untuk admin menghubungi dan menawarkan slot.

## 3. Hierarki konten

Urutan homepage mengikuti alur keputusan, bukan urutan company profile:

1. **Hero** — janji “Berani bicara, siap melangkah” + dua CTA.
2. **Statistik** — bukti sosial singkat: alumni, rating, pengajar, bahasa.
3. **Tab audiens + program** — jalur tercepat menuju program yang relevan.
4. **Tabel harga** — transparansi biaya untuk keenam program.
5. **Alasan** — empat pembeda: kelas kecil, pengajar, jadwal, kelas percobaan.
6. **Pengajar** — kredensial singkat, bukan biografi panjang.
7. **Testimoni** — kutipan spesifik dengan atribusi jelas.
8. **Tiga langkah** — mengurangi friksi sebelum form.
9. **FAQ** — menjawab keberatan yang tersisa.
10. **Kontak** — alamat, jam, WhatsApp, dan ilustrasi peta.
11. **Footer** — navigasi sekunder, disclaimer demo, sosial.

Section “program” dan “harga” sengaja berdekatan. Setelah pengunjung menemukan program, pertanyaan berikutnya pasti biaya. Testimoni diletakkan setelah pengajar karena klaim pengajar perlu bukti dari murid.

## 4. Sistem visual

### Warna

| Token | Hex | Pemakaian | Kontras |
| --- | --- | --- | --- |
| `--navy-900` | `#0B2239` | Heading, footer, teks utama | 16.13:1 di putih; 14.94:1 di cream |
| `--navy-700` | `#123A5C` | Link dan aksen navy | 11.76:1 di putih |
| `--yellow-400` | `#F6C445` | CTA utama, highlight | 9.91:1 dengan navy |
| `--yellow-100` | `#FFF1C9` | Hover, panel lembut | 14.34:1 dengan navy |
| `--cream` | `#FAF6EC` | Latar utama | 14.94:1 dengan navy |
| `--white` | `#FFFFFF` | Kartu dan input | 16.13:1 dengan navy |
| `--ink` | `#16202B` | Body text | 15.25:1 di cream |
| `--muted` | `#5C6B7A` | Teks sekunder dan border field form | 5.07:1 di cream |
| `--line` | `#D8D2C4` | Border dekoratif saja | 1.51:1 - tidak untuk teks atau batas field |
| `--success` | `#1F7A5C` | WhatsApp dan status sukses | 5.25:1 dengan putih |

Prinsipnya:

- Navy dipakai untuk struktur dan teks, bukan untuk semua permukaan.
- Kuning hanya untuk aksi utama dan highlight. Kalau semua tombol kuning, tidak ada yang menonjol.
- Krem memberi kesan hangat dan membedakan dari template putih-biru yang generik.
- Rasio kontras dihitung dengan rumus WCAG, bukan dikarang. Angka yang sama muncul di `style-guide.html`, dan test menghitung ulang setiap pasangan warna.
- Kuning tidak pernah dipakai sebagai teks di atas putih. Rasionya hanya 1.63:1.

### Tipografi

- **Bricolage Grotesque** untuk heading. Bentuknya ekspresif dan sedikit tidak rapi, cocok untuk audiens remaja tanpa terasa kekanak-kanakan.
- **Plus Jakarta Sans** untuk body. Nyaman di ukuran kecil dan tetap terbaca di layar HP.
- Heading memakai `clamp()`, jadi ukurannya menyesuaikan viewport tanpa banyak breakpoint manual.
- Body text dijaga sekitar 60–65 karakter per baris.
- Maksimal tiga bobot per layar: 400, 600, dan 700.

### Layout dan komponen

- Container maksimal 1180 px, gutter mengecil di layar sempit.
- Hero dua kolom: teks di kiri, tiga kartu bahasa di kanan. Di bawah 980 px menjadi satu kolom.
- Section bergantian cream dan putih; footer navy.
- Kartu program memakai hierarki tetap: badge bahasa + harga, judul, target/level, durasi/jadwal, lalu satu CTA.
- Tombol punya empat keadaan: primary, secondary, WhatsApp, disabled, dan focus.
- Target sentuh minimal 44 px untuk tombol, tab, chip filter, dan link navigasi mobile.
- Breakpoint utama: 980 px (nav desktop ke drawer), 760 px (sticky CTA dan tabel menjadi kartu), 560 px (gutter lebih kecil).

## 5. Empat keputusan yang disetujui

### 5.1 Tab audiens dan tabel harga enam baris

Tab homepage memetakan audiens ke dua program:

| Tab | Program |
| --- | --- |
| SMA | English for Teens, Japanese N5 |
| Mahasiswa | English for Campus, Japanese N4 |
| Pekerja | English for Work, Mandarin HSK 1–2 |

Tabel harga tetap menampilkan keenam program. Alasannya: kalau tabel hanya menampilkan program yang sedang aktif di tab, pengunjung yang pindah tab bisa mengira program lain tidak tersedia. Tabel juga menjadi halaman ringkasan yang konsisten dengan `program.html`.

### 5.2 Jadwal sebagai slot konkret

Brief hanya meminta jadwal, bukan struktur data jadwal. Pilihan pertama adalah bucket seperti “weekday sore” dan “Sabtu”. Itu terlalu kabur: pengunjung masih harus bertanya jam berapa.

Keputusan akhir: setiap program menulis hari dan jam konkret.

| Program | Jadwal |
| --- | --- |
| English for Teens | Selasa & Kamis 16.00–17.30 |
| English for Campus | Senin & Rabu 18.30–20.00 |
| English for Work | Selasa & Kamis 19.00–20.30 (online) |
| Japanese N5 | Sabtu 09.00–11.30 |
| Japanese N4 | Sabtu 13.00–15.30 |
| Mandarin HSK 1–2 | Jumat 18.30–20.00 |

Form tetap memakai bucket preferensi karena calon pendaftar belum tentu bisa memastikan slot. Saat admin menghubungi, slot konkret dikonfirmasi. Ini kompromi antara kejelasan di halaman dan fleksibilitas di form.

### 5.3 Wireframe sebagai galeri HTML

Wireframe tidak dibuat sebagai gambar. `wireframe.html` berisi dua artboard HTML literal: 1440 px dan 390 px. Artboard tidak boleh reflow karena tujuannya menunjukkan layout pada ukuran tertentu.

Perilaku galeri:

- Di bawah 1360 px: hanya satu artboard terlihat, dengan switcher.
- Di 1360 px ke atas: kedua artboard terlihat; desktop diperkecil dengan `zoom: 0.6`, mobile tetap 1:1.
- Di layar sempit, artboard desktop bisa di-scroll di dalam frame, bukan membuat body overflow.
- `?artboard=desktop|mobile&export=1` menyembunyikan chrome, switcher, anotasi, dan skala; hanya satu artboard 1:1 yang tersisa.

Keputusan ini memudahkan revisi: ubah HTML, screenshot ulang, tanpa menggambar ulang di Figma.

### 5.4 PNG full-page, bukan viewport

Mockup Figma memerlukan keseluruhan halaman, termasuk header, footer, dan section yang jauh di bawah lipatan. Karena itu delapan dari sembilan PNG adalah full-page 1x.

Pengecualian: `02b-home-mobile-sticky-390.png` adalah screenshot viewport 390 × 844 yang menunjukkan sticky CTA dalam keadaan aktif. Sticky bar tidak masuk full-page karena akan menutupi konten dan bukan bagian dari layout statis.

Konsekuensi: file mobile sangat tinggi (homepage 390 × 9483). Itu wajar untuk full-page. Di Figma, frame bisa diperkecil saat presentasi tanpa kehilangan detail.

## 6. Interaksi dan aksesibilitas

Yang diterapkan:

- Landmark `header`, `nav`, `main`, `footer`; satu `h1` per halaman; heading tidak melompat.
- Skip link “Langsung ke konten” yang muncul saat fokus.
- Fokus keyboard memakai outline navy 3 px dengan offset 3 px, bukan `outline: none`. Di footer dan CTA band yang berlatar navy, warna outline diganti kuning.
- Border field form memakai `--muted` (5.07:1 di cream), bukan `--line`, supaya batas kontrol tetap terlihat.
- Drawer mobile: `aria-expanded`, fokus masuk ke link pertama, Escape menutup, fokus kembali ke tombol menu, dan fokus terperangkap di dalam drawer saat Tab. Link anchor memindahkan fokus ke section tujuan.
- Tab audiens: `role="tablist"`, `aria-selected`, `aria-controls`, panah kiri/kanan, Home, dan End.
- Wireframe memakai dua toggle button dengan `aria-pressed`, bukan `role="tab"` setengah jadi.
- Filter program: `aria-pressed` pada setiap chip.
- Dialog WhatsApp: `<dialog>` native, fokus masuk, Escape menutup, fokus kembali ke pemicu, body tidak scroll. Handler `cancel` dibuat eksplisit supaya perilaku tidak bergantung pada event `close` native.
- Form: label eksplisit, error `aria-invalid` + `aria-describedby`, fokus pindah ke field pertama yang salah.
- Status tidak hanya dibedakan dengan warna; badge bahasa selalu punya label teks.
- `prefers-reduced-motion: reduce` mematikan animasi reveal dan transisi.
- Tanpa JavaScript: tab dan filter tidak menyembunyikan konten, FAQ tetap berfungsi, form tidak bisa submit.

Hasil Lighthouse lokal:

| Halaman | Performance | Accessibility | Best Practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| Homepage | 96 | 100 | 100 | 100 |
| `daftar.html` | 100 | 100 | 100 | 100 |

Satu temuan kontras ditemukan saat Lighthouse pertama: teks “CL” di logo footer mewarisi warna cream di atas kuning. Mark sekarang diberi `color: var(--navy-900)` eksplisit.

## 7. QA

Diuji dengan Chrome headless dan Chrome visible (Playwright), viewport 390, 768, dan 1440 px.

- 41 markup/content contract test pass. Perilaku interaktif di bawah ini diverifikasi manual di browser, bukan oleh test tersebut.
- 0 console error dan 0 request lokal gagal.
- Tidak ada horizontal overflow.
- Semua link internal dan anchor valid.
- Drawer, tab, filter, FAQ, dialog, sticky CTA, dan form berfungsi.
- Form invalid memfokuskan `name`; submit valid menampilkan success panel dan menghasilkan 0 request jaringan.
- Sticky CTA aktif setelah hero, memberi padding bawah 88 px, dan tidak menutupi footer.
- Dialog: close button, backdrop, dan Escape semuanya melepas `body` lock serta mengembalikan fokus.
- Focus ring terverifikasi lewat Tab nyata: outline solid 3 px `rgb(11, 34, 57)`, dan kuning di atas CTA band navy.
- Link anchor dari drawer memindahkan fokus ke section tujuan.
- Wireframe: toggle `aria-pressed` berubah, deep link `?artboard=mobile` hanya menampilkan mobile di desktop.

Yang belum diuji: screen reader sungguhan (NVDA/VoiceOver), Safari, Firefox, dan perangkat fisik. Performa produksi juga belum diukur setelah deploy.

## 8. Langkah impor Figma

1. Buka Figma dan buat file baru.
2. Drag sembilan PNG dari `figma-import/` ke canvas.
3. Satu frame per halaman. Beri nama sesuai halaman dan ukuran.
4. Untuk wireframe, tempatkan `06` dan `07` berdampingan.
5. Untuk homepage mobile, tempatkan `02` sebagai full-page dan `02b` sebagai callout sticky CTA.
6. Tambahkan catatan presentasi di samping frame: tujuan halaman, target audiens, dan CTA utama.

PNG tidak editable. Kalau klien meminta revisi teks atau warna, yang diubah adalah HTML/CSS lalu screenshot ulang. Ini trade-off yang disepakati: kecepatan dan konsistensi dengan website live lebih penting daripada layer Figma yang bisa diedit.

## 9. Trade-off dan keterbatasan

- **Tanpa backend.** Form hanya simulasi. Untuk produksi, perlu endpoint, validasi server, anti-spam, dan penyimpanan leads.
- **Konten ganda.** Harga dan jadwal muncul di homepage dan `program.html`. Saat ini dijaga manual; ke depan sebaiknya satu JSON atau CMS.
- **Filter tanpa URL state.** Filter program tidak bisa dibagikan lewat tautan.
- **PNG berat.** Full-page mobile berukuran besar karena halaman memang panjang. Untuk presentasi Figma ini masih wajar, tapi bukan format untuk web.
- **Logo placeholder.** Mark “CL” harus diganti kalau file logo asli tersedia.
- **WhatsApp fiktif.** Dialog demo mencegah pengunjung mengira nomor tersebut aktif.
- **Belum ada analytics.** Tidak ada data nyata tentang section mana yang mendorong pendaftaran.
- **Pengujian terbatas di Chrome.** Belum ada bukti di Safari/Firefox atau screen reader.

## 10. Kalau ada lebih banyak waktu

Prioritas berikutnya, berurutan:

1. **Backend leads ringan.** Form mengirim ke endpoint dengan validasi server, rate limit, dan notifikasi email/WhatsApp. Ini mengubah mockup menjadi alur yang benar-benar bisa dipakai.
2. **Satu sumber data program.** Pindahkan enam program ke JSON, lalu render kartu, tabel, dan filter dari data yang sama.
3. **Uji aksesibilitas nyata.** NVDA/VoiceOver, keyboard-only, dan pengujian dengan pengguna.
4. **Optimasi font.** Self-host subset Bricolage Grotesque dan Plus Jakarta Sans untuk menghilangkan request ke Google Fonts.
5. **Analytics konversi.** Ukur CTA mana yang paling sering diklik dan di section mana pengunjung berhenti.
6. **Halaman placement test yang interaktif.** Saat ini placement test hanya CTA; versi interaktif bisa menjadi lead magnet yang lebih kuat.

## 11. Bahan interview

**Kenapa tidak memakai React atau framework lain?**
Kebutuhannya statis: lima halaman, satu drawer, satu set tab, filter klien, dan form simulasi. React akan menambah build step dan runtime tanpa manfaat yang sebanding. Vanilla JS cukup, lebih mudah di-deploy, dan lebih cepat dibuka.

**Kenapa harga dan jadwal ditulis di HTML, bukan JSON?**
Karena belum ada backend dan jumlah programnya kecil. JSON akan menambah lapisan rendering tanpa sumber kebenaran tunggal yang nyata. Risiko duplikasi dicatat sebagai keterbatasan, dan solusi berikutnya adalah satu JSON yang dirender ke homepage dan halaman program.

**Bagaimana memastikan form tidak menipu pengunjung?**
Form memakai `novalidate` dan tombol `type="button"`, jadi tanpa JavaScript tidak ada yang terkirim. Validasi berjalan di klien. Setelah valid, success panel menyatakan bahwa ini mode demo dan data tidak dikirim. Tidak ada request jaringan.

**Bagaimana aksesibilitas dijaga?**
Satu `h1` per halaman, heading berurutan, landmark, skip link, fokus 3 px, target sentuh 44 px, `aria-*` pada tab/drawer/dialog/filter, dan reduced motion. Lighthouse Accessibility 100 di homepage dan halaman pendaftaran. Yang belum: pengujian screen reader dan browser lain.

**Apa keputusan desain yang paling penting?**
Memetakan audiens ke program lewat tab, lalu tetap menampilkan enam program di tabel harga. Ini mengurangi beban memilih tanpa menyembunyikan informasi. Keputusan kedua adalah menulis jadwal sebagai slot konkret, karena “weekday sore” hanya memindahkan pertanyaan ke admin.

**Apa yang belum selesai?**
Deploy Netlify, backend leads, satu sumber data program, pengujian screen reader/browser lain, dan analytics. Semuanya dicatat di README supaya project tidak terlihat lebih matang dari kenyataannya.
