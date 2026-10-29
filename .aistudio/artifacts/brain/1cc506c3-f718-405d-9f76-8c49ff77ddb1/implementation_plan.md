# Al-Mahir (الماهر) - Pembelajaran Bahasa Arab Interaktif & Gamifikasi

Aplikasi pembelajaran bahasa Arab modern, ramah, dan ceria dengan gamifikasi interaktif terpadu. Dilengkapi sistem autentikasi Firebase (Google Sign-In), penyimpanan Firestore per user dan papan peringkat real-time, Express API serverless di `api/index.ts` siap deploy Vercel, asisten AI bahasa Arab berbasis Gemini 3.8 Flash di server-side, 4 mode permainan mufrodat unggulan, kurikulum sistematis (Mubtadi', Mutawassit, Mutaqaddim), media terpadu (gambar, audio pelafalan, video, lagu edukasi), serta Dashboard Admin untuk mengelola materi dan memantau progres pelajar.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> Berdasarkan jawaban klarifikasi yang telah Anda tentukan sebelumnya:
> 1. **Nama & Desain**: *Al-Mahir* dengan tema visual modern, ramah, ceria, dan gamifikasi interaktif.
> 2. **Mode Permainan Mufrodat**: Paket lengkap terintegrasi (Tebak Gambar, Sambung Kata, Audio Listening / Istima', dan Kuis Cepat / Speed Challenge).
> 3. **Dashboard Admin**: Pengelolaan kurikulum, bank soal mufrodat, materi multimedia (video/lagu/audio), serta pemantauan statistik dan progres pelajar.
> 4. **Konfigurasi Autentikasi & Database**: Google Sign-In via Firebase Auth, database Firestore untuk data profil pengguna, progres materi, kuis harian, XP/streak, dan papan peringkat.
> 5. **Arsitektur Deployment**: Express backend di `api/index.ts` (`export default app`, tanpa `app.listen`), `vercel.json` rewrite `/api/(.*)` ke `/api`, build output `dist` untuk frontend Vite + React.

---

## 1. Overview & Core Concept

- **Apa yang Dibangun**: Platform web gamifikasi edukatif untuk belajar bahasa Arab mulai dari nol hingga mahir. Menghadirkan pengalaman belajar yang adiktif seperti permainan, dengan tantangan harian, perolehan bintang & XP, lencana pencapaian (badges), serta papan peringkat real-time yang memicu semangat kompetitif positif.
- **Target Pengguna**:
  - Pelajar pemula, santri/mahasiswa, maupun umum yang ingin menguasai kosakata (mufrodat), kaidah dasar, dan percakapan bahasa Arab secara praktis dan menyenangkan.
  - Pengajar / Admin yang membutuhkan wadah manajemen kurikulum dan pemantauan capaian belajar siswa.
- **Nilai Utama**: Menghilangkan stigma bahwa belajar bahasa Arab itu kaku atau sulit melalui pendekatan multimodal (teks berharakat jelas, visual ilustratif, audio pelafalan asli, video pembelajaran, lagu nasyid edukatif) serta umpan balik instan bertenaga AI Tutor.

---

## 2. User Experience & Visual Design

### Alur Pengguna (User Flows)
1. **Layar Masuk & Gerbang Login (Wajib Login)**:
   - Tampilan pembuka yang atraktif memperkenalkan fitur Al-Mahir.
   - Autentikasi cepat dengan satu klik via **Google Sign-In** melalui Firebase Auth.
   - Pengecekan role otomatis: Akun Admin (dapat diatur berdasarkan email admin terdaftar) langsung membuka akses Dashboard Admin di bilah navigasi.
2. **Beranda & Peta Petualangan Kurikulum**:
   - Pilihan 3 Jenjang Belajar: **Mubtadi' (Pemula)**, **Mutawassit (Menengah)**, **Mutaqaddim (Mahir)**.
   - Setiap jenjang memiliki unit modul terstruktur (misal: Ta'aruf, Benda di Kelas, Anggota Keluarga, Di Pasar, Pekerjaan, Pepatah Mahfuzhat).
   - Tampilan kartu materi dengan status: *Terkunci*, *Tersedia*, atau *Selesai (Bintang 3)*.
3. **Pusat Permainan Mufrodat (Game Arena)**:
   - **Tebak Gambar (Visual Mufrodat)**: Menghubungkan visual objek dengan ejaan dan arti kata yang tepat.
   - **Sambung Kata & Susun Kalimat (Tartib al-Kalimat)**: Menyusun potongan kata Arab menjadi kalimat sempurna (Jumlah Mufidah).
   - **Audio Listening (Istima')**: Mendengarkan pelafalan mufrodat berharakat (kecepatan normal atau santai) dan memilih jawaban yang benar.
   - **Kuis Cepat (60-Second Blitz)**: Menjawab sebanyak mungkin arti mufrodat sebelum waktu habis untuk multiplier skor tertinggi.
4. **Kuis Harian & Tantangan Streak**:
   - Set 5 soal harian berganti setiap 24 jam untuk menjaga konsistensi streak harian.
5. **Papan Peringkat Real-time (Leaderboard)**:
   - Menampilkan peringkat pelajar berdasarkan total XP, streak harian, dan lencana yang diraih.
6. **Pustaka Multimedia (Video & Lagu Edukasi)**:
   - Koleksi video pembelajaran tata bahasa Arab dan lagu nasyid/edukasi anak & remaja (Huruf Hijaiyah, Asma'ul Husna, Angka, dll.) lengkap dengan lirik teks Arab & terjemahan.
7. **Ustadz AI (Gemini 3.8 Flash Tutor)**:
   - Fitur tanya jawab interaktif untuk menanyakan akar kata (Fi'il / Tashrif), contoh kalimat, atau penjelasan nahwu/sharaf secara instan dan ramah.
8. **Dashboard Admin**:
   - Manajemen modul kurikulum, penambahan soal mufrodat baru dengan gambar/audio, penambahan entri video/lagu, serta tabel pantauan aktivitas pelajar.

### Identitas Visual & Desain UI
- **Aesthetic Direction**: Modern, ceria, bernuansa akademis Islam modern yang bersih dan berenergi (Gamified Arabic EdTech).
- **Palet Warna**:
  - *Dominant Canvas (60%)*: Emerald Soft & Warm Cream (`#FAFAF9` / `#F0FDF4`).
  - *Structural Panels (30%)*: Deep Slate Green (`#064E3B`, `#0F766E`), kartu putih bergaris tipis hairline border (`#E2E8F0`).
  - *Accent & Gamification (10%)*: Emas/Amber hangat (`#F59E0B`, `#D97706`) untuk koin, bintang, dan piala; Coral ceria (`#EF4444`) untuk timer kuis cepat.
- **Tipografi**:
  - Huruf Latin: `Plus Jakarta Sans` untuk kenyamanan navigasi dan antarmuka.
  - Teks Arab: Font Arab Naskh/Amiri dengan ukuran proporsional (`text-2xl` hingga `text-4xl`) dan harakat yang sangat jelas dan mudah dibaca tanpa saling tumpang-tindih.
- **Disiplin Desain (Anti-Slop)**:
  - Tanpa dekorasi berlebihan atau pseudo-code tags (`//`).
  - Metadata bersih menggunakan pemisah tipografis (`·`), navigasi 3-zona rapi sesuai top-bar contract.
  - Kontrol tombol single-line yang ergonomis di desktop maupun layar sentuh mobile.

---

## 3. Key Product Decisions & Trade-Offs

- **Autentikasi Firebase (Google Sign-In Pop-up)**:
  - *Keputusan*: Menggunakan `signInWithPopup` Firebase Auth untuk keamanan maksimal di lingkungan iFrame dev & produksi Vercel.
  - *Alasan*: Pengalaman pengguna instan tanpa perlu repot mengetik password, terhindar dari isu redirect lintas origin.
- **Database Firestore untuk Data Pengguna & Papan Peringkat**:
  - *Keputusan*: Dokumen profil pengguna di simpan di koleksi `users/{userId}` dengan subkoleksi atau bidang progres, dan sinkronisasi real-time (`onSnapshot`) untuk leaderboard.
  - *Alasan*: Latensi rendah, sinkronisasi otomatis, aman dengan Firestore Security Rules.
- **Express Backend Serverless di `api/index.ts`**:
  - *Keputusan*: Menggunakan Express yang di-export sebagai default handler tanpa `app.listen()` pada lingkungan serverless/Vercel, namun tetap mendukung lokal runner di Vite dev proxy.
  - *Alasan*: Sesuai spesifikasi prompt pengguna dan standar Vercel Serverless Function untuk rute `/api/*`.
- **Integrasi Gemini 3.8 Flash di Server-Side**:
  - *Keputusan*: Panggilan `@google/genai` dilakukan murni di server-side (`api/index.ts`) menggunakan API key `process.env.GEMINI_API_KEY`.
  - *Alasan*: Menjamin API Key tidak pernah bocor ke browser client, respon cepat, dan hemat token untuk bimbingan bahasa Arab kontekstual.
- **Pelafalan Audio**:
  - *Keputusan*: Kombinasi Web Speech Synthesis beraksen `ar-SA` (Arab Saudi) native browser dengan fallback generator audio terstruktur dan klip multimedia audio.

---

## 4. Technical Architecture & Data Strategy

### System Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        AL-MAHIR CLIENT (REACT SPA)                     │
│                                                                        │
│  ┌───────────────┐  ┌────────────────┐  ┌─────────────┐  ┌───────────┐ │
│  │ Firebase Auth │  │ Game Arena     │  │ Curriculum  │  │ Admin     │ │
│  │ (Google Sign) │  │ (4 Mode Mufro) │  │ (3 Levels)  │  │ Dashboard │ │
│  └───────┬───────┘  └───────┬────────┘  └──────┬──────┘  └─────┬─────┘ │
│          │                  │                  │               │       │
└──────────┼──────────────────┼──────────────────┼───────────────┼───────┘
           │                  │                  │               │
           ▼                  ▼                  ▼               │
┌────────────────────────────────────────────────────────┐       │
│                FIRESTORE DATABASE                      │       │
│  - users/{uid} (profile, xp, streak, level, role)      │       │
│  - curriculum/{levelId} (modules, lessons)             │       │
│  - question_bank/{qid} (mufrodat, audio, image)        │       │
│  - media/{mediaId} (videos, songs, lyrics)             │       │
└────────────────────────────────────────────────────────┘       │
                                                                 │
                                                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│            SERVERLESS BACKEND (api/index.ts - Express App)             │
│                                                                        │
│  ┌───────────────────────┐             ┌────────────────────────────┐  │
│  │ /api/gemini/tutor     │             │ /api/admin/metrics         │  │
│  │ /api/gemini/explain   │             │ /api/health                │  │
│  └───────────┬───────────┘             └────────────────────────────┘  │
│              │                                                         │
│              ▼                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Google GenAI SDK (@google/genai) -> gemini-3.8-flash              │  │
│  │ (GEMINI_API_KEY Server Environment Variable)                     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Skema Data Firestore (`firebase-blueprint.json` & TypeScript)
1. **User Profile (`users/{userId}`)**:
   - `uid`, `displayName`, `email`, `photoURL`
   - `role`: `"admin"` | `"user"`
   - `xp`: number (Poin pengalaman)
   - `level`: number (Pangkat pembelajar, misal Level 1-20)
   - `streak`: number (Jumlah hari berturut-turut)
   - `lastActiveDate`: string (YYYY-MM-DD)
   - `completedLessons`: string[]
   - `badges`: string[] (ID lencana yang telah diraih)
2. **Curriculum Modules (`curriculum/{moduleId}`)**:
   - `title`: string (Arab & Indonesia)
   - `level`: `"beginner"` | `"intermediate"` | `"advanced"`
   - `order`: number
   - `description`: string
   - `lessons`: Array kata & tata bahasa
3. **Question Bank (`questions/{questionId}`)**:
   - `type`: `"guess_picture"` | `"word_connect"` | `"audio_listening"` | `"speed_quiz"`
   - `arabicText`: string (Teks berharakat)
   - `translation`: string
   - `transliteration`: string (Cara baca Latin)
   - `audioUrl`: string (opsional)
   - `imageUrl`: string (opsional)
   - `options`: string[]
   - `correctAnswer`: string
4. **Media Items (`media/{mediaId}`)**:
   - `title`: string
   - `type`: `"video"` | `"song"` | `"audio"`
   - `url`: string (YouTube embed URL atau audio track)
   - `category`: string (e.g. Hijaiyah, Nasyid, Nahwu)
   - `lyrics`: Array baris teks Arab & terjemahan

### File & Konfigurasi Kunci yang Disiapkan
- `/api/index.ts`: Express application handler, mengekspor `export default app` tanpa `app.listen()`.
- `/vercel.json`: Konfigurasi rewrites API untuk deployment serverless Vercel:
  ```json
  {
    "rewrites": [
      { "source": "/api/(.*)", "destination": "/api" },
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }
  ```
- `/firebase-blueprint.json`: Definisi struktur skema Firestore untuk Blueprint toolchain.
- `/firestore.rules`: Aturan keamanan mutlak (ABAC) yang mengisolasi data user, memvalidasi input, dan membatasi izin admin.
- `/src/lib/firebase.ts`: Inisialisasi Firebase Auth & Firestore dengan konfigurasi aman.
- `/src/context/AuthContext.tsx`: State pengguna global, deteksi login/logout, dan pengecekan role admin.
- Komponen Game Arena:
  - `TebakGambarGame.tsx`
  - `SambungKataGame.tsx`
  - `AudioListeningGame.tsx`
  - `SpeedQuizGame.tsx`
- Komponen Pembelajaran & Media:
  - `CurriculumView.tsx`
  - `DailyQuizModal.tsx`
  - `LeaderboardView.tsx`
  - `MediaHubView.tsx`
  - `AITutorChat.tsx`
  - `AdminDashboard.tsx`

---

## 5. Verification & Next Steps

Setelah rencana disetujui:
1. Menjalankan penyiapan Firebase provisioning via tool resmi `show_aistudio_ui` / `rpc_action`.
2. Menyusun file blueprint, security rules, dan backend serverless di `api/index.ts`.
3. Membangun seluruh antarmuka interaktif, game arena, media player, dan dashboard admin.
4. Menjalankan `compile_applet` untuk memastikan zero-error compilation dan siap deploy Vercel.
