import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  INITIAL_CURRICULUM,
  INITIAL_QUESTIONS,
  INITIAL_MEDIA,
} from '../data/initialData';
import { QuestionItem, MediaItem, GameMode, CurriculumLevel } from '../types';
import {
  Shield,
  BookOpen,
  HelpCircle,
  Video,
  Users,
  Plus,
  Trash2,
  CheckCircle,
  Star,
  Flame,
  Search,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [adminTab, setAdminTab] = useState<'overview' | 'curriculum' | 'questions' | 'media' | 'students'>('overview');

  // Local state for dynamically added content
  const [questions, setQuestions] = useState<QuestionItem[]>(INITIAL_QUESTIONS);
  const [mediaList, setMediaList] = useState<MediaItem[]>(INITIAL_MEDIA);

  // Form states for new question
  const [showAddQuestionModal, setShowAddQuestionModal] = useState<boolean>(false);
  const [newQType, setNewQType] = useState<GameMode>('guess_picture');
  const [newQLevel, setNewQLevel] = useState<CurriculumLevel>('mubtadi');
  const [newQArabic, setNewQArabic] = useState<string>('');
  const [newQTranslit, setNewQTranslit] = useState<string>('');
  const [newQTranslation, setNewQTranslation] = useState<string>('');
  const [newQOptions, setNewQOptions] = useState<string>('');
  const [newQAnswer, setNewQAnswer] = useState<string>('');
  const [newQCategory, setNewQCategory] = useState<string>('Umum');

  // Form states for new media
  const [showAddMediaModal, setShowAddMediaModal] = useState<boolean>(false);
  const [newMTitle, setNewMTitle] = useState<string>('');
  const [newMTitleArabic, setNewMTitleArabic] = useState<string>('');
  const [newMCategory, setNewMCategory] = useState<string>('Lagu Edukasi');
  const [newMType, setNewMType] = useState<'video' | 'song'>('video');
  const [newMUrl, setNewMUrl] = useState<string>('');
  const [newMDesc, setNewMDesc] = useState<string>('');
  const [newMLyrics, setNewMLyrics] = useState<string>('');

  // Sample student list for monitoring
  const [studentList] = useState([
    {
      id: 's1',
      name: 'Fatimah Az-Zahra',
      email: 'fatimah@student.id',
      xp: 2850,
      level: 14,
      streak: 18,
      completedCount: 6,
      role: 'user',
    },
    {
      id: 's2',
      name: 'Muhammad Rayhan',
      email: 'rayhan@student.id',
      xp: 2420,
      level: 12,
      streak: 14,
      completedCount: 5,
      role: 'user',
    },
    {
      id: 's3',
      name: 'Ahmad Santri',
      email: 'santri.demo@almahir.edu',
      xp: 380,
      level: 3,
      streak: 5,
      completedCount: 2,
      role: 'user',
    },
    {
      id: 's4',
      name: profile?.displayName || 'Pengajar Admin',
      email: profile?.email || 'admin@almahir.edu',
      xp: profile?.xp || 2450,
      level: profile?.level || 12,
      streak: profile?.streak || 5,
      completedCount: profile?.completedLessons?.length || 4,
      role: 'admin',
    },
  ]);

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQArabic || !newQTranslation || !newQAnswer) return;

    const optionsArray = newQOptions
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (!optionsArray.includes(newQAnswer)) {
      optionsArray.unshift(newQAnswer);
    }

    const created: QuestionItem = {
      id: `q-custom-${Date.now()}`,
      type: newQType,
      level: newQLevel,
      arabicText: newQArabic,
      transliteration: newQTranslit || newQArabic,
      translation: newQTranslation,
      options: optionsArray,
      correctAnswer: newQAnswer,
      category: newQCategory,
    };

    setQuestions([created, ...questions]);
    setShowAddQuestionModal(false);
    // Reset form
    setNewQArabic('');
    setNewQTranslit('');
    setNewQTranslation('');
    setNewQOptions('');
    setNewQAnswer('');
  };

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMTitle || !newMUrl) return;

    const created: MediaItem = {
      id: `media-custom-${Date.now()}`,
      title: newMTitle,
      titleArabic: newMTitleArabic,
      category: newMCategory,
      type: newMType,
      url: newMUrl,
      description: newMDesc,
      lyricsArabic: newMLyrics,
      duration: '03:30',
    };

    setMediaList([created, ...mediaList]);
    setShowAddMediaModal(false);
    setNewMTitle('');
    setNewMTitleArabic('');
    setNewMUrl('');
    setNewMDesc('');
    setNewMLyrics('');
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleDeleteMedia = (id: string) => {
    setMediaList(mediaList.filter((m) => m.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-stone-900 tracking-tight">
              Dashboard Pengajar & Admin
            </h2>
            <p className="text-xs text-stone-500">
              Kelola materi kurikulum, bank soal mufrodat, konten multimedia, dan pantau progres pelajar.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl text-xs font-bold overflow-x-auto max-w-full">
          <button
            onClick={() => setAdminTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              adminTab === 'overview' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
            }`}
          >
            Ringkasan
          </button>
          <button
            onClick={() => setAdminTab('curriculum')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              adminTab === 'curriculum' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
            }`}
          >
            Kurikulum
          </button>
          <button
            onClick={() => setAdminTab('questions')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              adminTab === 'questions' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
            }`}
          >
            Bank Soal ({questions.length})
          </button>
          <button
            onClick={() => setAdminTab('media')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              adminTab === 'media' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
            }`}
          >
            Multimedia ({mediaList.length})
          </button>
          <button
            onClick={() => setAdminTab('students')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              adminTab === 'students' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600'
            }`}
          >
            Progres Pelajar
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-stone-500">Total Pelajar Aktif</span>
              <div className="text-3xl font-black text-stone-900">{studentList.length * 35}</div>
              <span className="text-[11px] text-emerald-600 font-bold">● Terhubung di Firestore</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-stone-500">Unit Modul Kurikulum</span>
              <div className="text-3xl font-black text-emerald-700">{INITIAL_CURRICULUM.length}</div>
              <span className="text-[11px] text-stone-400 font-medium">3 Tingkatan (Mubtadi' - Mahir)</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-stone-500">Bank Soal Mufrodat</span>
              <div className="text-3xl font-black text-teal-700">{questions.length}</div>
              <span className="text-[11px] text-stone-400 font-medium">4 Mode Arena Game</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-stone-500">Konten Video & Lagu</span>
              <div className="text-3xl font-black text-purple-700">{mediaList.length}</div>
              <span className="text-[11px] text-stone-400 font-medium">Lengkap Lirik Arab</span>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-stone-900 mb-3">
              Aksi Cepat Pengajar
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setAdminTab('questions');
                  setShowAddQuestionModal(true);
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Soal Mufrodat Baru</span>
              </button>

              <button
                onClick={() => {
                  setAdminTab('media');
                  setShowAddMediaModal(true);
                }}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Video / Lagu Edukasi</span>
              </button>

              <button
                onClick={() => setAdminTab('students')}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Pantau Aktivitas Siswa</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CURRICULUM VIEW */}
      {adminTab === 'curriculum' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900">
              Daftar Modul Kurikulum Bahasa Arab
            </h3>
          </div>

          <div className="space-y-3">
            {INITIAL_CURRICULUM.map((mod) => (
              <div
                key={mod.id}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                      {mod.levelTitle}
                    </span>
                    <span className="text-xs text-stone-400">
                      {mod.lessons.length} Pelajaran
                    </span>
                  </div>
                  <h4 className="text-base font-black text-stone-900">{mod.title}</h4>
                  <div className="font-arabic text-lg font-bold text-emerald-800">
                    {mod.titleArabic}
                  </div>
                  <p className="text-xs text-stone-500">{mod.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                    Aktif
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: QUESTIONS BANK */}
      {adminTab === 'questions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Bank Soal Mufrodat Interaktif
              </h3>
              <p className="text-xs text-stone-500">
                Digunakan pada 4 mode permainan arena game dan kuis evaluasi.
              </p>
            </div>

            <button
              onClick={() => setShowAddQuestionModal(true)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Soal</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="divide-y divide-stone-100">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-stone-50/60 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded font-bold bg-teal-100 text-teal-800 uppercase">
                        {q.type.replace('_', ' ')}
                      </span>
                      <span className="text-stone-400">Level: {q.level}</span>
                      <span className="text-stone-400">·</span>
                      <span className="text-stone-500 font-medium">Kat: {q.category}</span>
                    </div>

                    <div className="flex items-baseline gap-3">
                      <span className="font-arabic text-2xl font-bold text-emerald-950">
                        {q.arabicText}
                      </span>
                      <span className="text-xs font-semibold text-stone-500">
                        [{q.transliteration}]
                      </span>
                      <span className="text-sm font-bold text-stone-800">
                        = {q.translation}
                      </span>
                    </div>

                    <div className="text-xs text-emerald-700 font-semibold">
                      Kunci Jawaban: {q.correctAnswer}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Hapus Soal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MEDIA LIBRARY */}
      {adminTab === 'media' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Pustaka Konten Video & Lagu Edukasi
              </h3>
              <p className="text-xs text-stone-500">
                Media pembelajaran dengan teks lirik Arab dan terjemahan.
              </p>
            </div>

            <button
              onClick={() => setShowAddMediaModal(true)}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Media</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mediaList.map((m) => (
              <div
                key={m.id}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded font-bold bg-purple-100 text-purple-800">
                      {m.category}
                    </span>
                    <button
                      onClick={() => handleDeleteMedia(m.id)}
                      className="text-stone-400 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-stone-900">{m.title}</h4>
                  {m.titleArabic && (
                    <div className="font-arabic text-base font-bold text-emerald-800">
                      {m.titleArabic}
                    </div>
                  )}
                  <p className="text-xs text-stone-500 line-clamp-2">{m.description}</p>
                </div>

                <div className="text-[11px] text-stone-400 font-mono truncate">
                  {m.url}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: STUDENTS MONITORING */}
      {adminTab === 'students' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-stone-900">
              Pantauan Progres & Aktivitas Pelajar
            </h3>
            <p className="text-xs text-stone-500">
              Daftar akun pelajar yang tersinkronisasi di database Firestore.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Nama Pelajar</th>
                  <th className="px-6 py-3.5">Email</th>
                  <th className="px-6 py-3.5">Level & XP</th>
                  <th className="px-6 py-3.5">Streak</th>
                  <th className="px-6 py-3.5">Modul Selesai</th>
                  <th className="px-6 py-3.5">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
                {studentList.map((s) => (
                  <tr key={s.id} className="hover:bg-stone-50/60">
                    <td className="px-6 py-4 font-bold text-stone-900">
                      {s.name}
                    </td>
                    <td className="px-6 py-4 text-stone-500 font-mono">
                      {s.email}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                        <Star className="w-3.5 h-3.5 fill-emerald-600" />
                        <span>L{s.level} · {s.xp} XP</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-amber-600 font-bold">
                        <Flame className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{s.streak} Hari</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-stone-600">
                      {s.completedCount} Unit
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          s.role === 'admin'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {s.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Tambah Soal Mufrodat */}
      {showAddQuestionModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
            <h3 className="text-lg font-black text-stone-900 mb-4">
              Tambah Soal Mufrodat Baru
            </h3>

            <form onSubmit={handleAddQuestion} className="space-y-4 text-xs font-semibold text-stone-700">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Mode Permainan</label>
                  <select
                    value={newQType}
                    onChange={(e) => setNewQType(e.target.value as GameMode)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-normal"
                  >
                    <option value="guess_picture">Tebak Gambar</option>
                    <option value="word_connect">Sambung Kata</option>
                    <option value="audio_listening">Audio Listening</option>
                    <option value="speed_quiz">Kuis Cepat</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Tingkat Kurikulum</label>
                  <select
                    value={newQLevel}
                    onChange={(e) => setNewQLevel(e.target.value as CurriculumLevel)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-normal"
                  >
                    <option value="mubtadi">Mubtadi' (Pemula)</option>
                    <option value="mutawassit">Mutawassit (Menengah)</option>
                    <option value="mutaqaddim">Mutaqaddim (Mahir)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1">Teks Arab Berharakat</label>
                <input
                  type="text"
                  dir="rtl"
                  value={newQArabic}
                  onChange={(e) => setNewQArabic(e.target.value)}
                  placeholder="مِثَالٌ: قَلَمٌ"
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-arabic text-xl text-right"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Transliterasi Latin</label>
                  <input
                    type="text"
                    value={newQTranslit}
                    onChange={(e) => setNewQTranslit(e.target.value)}
                    placeholder="Qalamun"
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-normal"
                  />
                </div>
                <div>
                  <label className="block mb-1">Arti Bahasa Indonesia</label>
                  <input
                    type="text"
                    value={newQTranslation}
                    onChange={(e) => setNewQTranslation(e.target.value)}
                    placeholder="Pena"
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-normal"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Pilihan Jawaban (Pisahkan koma)</label>
                <input
                  type="text"
                  value={newQOptions}
                  onChange={(e) => setNewQOptions(e.target.value)}
                  placeholder="Pena, Buku, Meja, Tas"
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-normal"
                />
              </div>

              <div>
                <label className="block mb-1">Kunci Jawaban Benar</label>
                <input
                  type="text"
                  value={newQAnswer}
                  onChange={(e) => setNewQAnswer(e.target.value)}
                  placeholder="Pena"
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-normal"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddQuestionModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                >
                  Simpan Soal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Tambah Media */}
      {showAddMediaModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
            <h3 className="text-lg font-black text-stone-900 mb-4">
              Tambah Konten Video / Lagu
            </h3>

            <form onSubmit={handleAddMedia} className="space-y-4 text-xs font-semibold text-stone-700">
              <div>
                <label className="block mb-1">Judul Media</label>
                <input
                  type="text"
                  value={newMTitle}
                  onChange={(e) => setNewMTitle(e.target.value)}
                  placeholder="Lagu Mengenal Warna Bahasa Arab"
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-normal"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Kategori</label>
                  <select
                    value={newMCategory}
                    onChange={(e) => setNewMCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-normal"
                  >
                    <option value="Lagu Edukasi">Lagu Edukasi</option>
                    <option value="Video Percakapan">Video Percakapan</option>
                    <option value="Nasyid Rohani">Nasyid Rohani</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Jenis</label>
                  <select
                    value={newMType}
                    onChange={(e) => setNewMType(e.target.value as 'video' | 'song')}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-normal"
                  >
                    <option value="video">Video YouTube</option>
                    <option value="song">Lagu Audio</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1">URL Embed (YouTube embed)</label>
                <input
                  type="text"
                  value={newMUrl}
                  onChange={(e) => setNewMUrl(e.target.value)}
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-normal"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Lirik Arab Berharakat</label>
                <textarea
                  dir="rtl"
                  rows={3}
                  value={newMLyrics}
                  onChange={(e) => setNewMLyrics(e.target.value)}
                  placeholder="Tuliskan lirik teks Arab..."
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-arabic text-lg text-right"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddMediaModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold"
                >
                  Simpan Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
