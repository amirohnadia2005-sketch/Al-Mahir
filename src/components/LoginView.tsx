import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Gamepad2,
  Sparkles,
  Trophy,
  Flame,
  BookOpen,
  Headphones,
  CheckCircle2,
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { signInWithGoogle, signInAsDemo, loading } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-stone-900 text-stone-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Top Banner / Brand */}
      <header className="px-6 py-6 max-w-6xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-300 flex items-center justify-center text-emerald-950 font-black text-2xl shadow-lg shadow-emerald-500/20">
            م
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Al-Mahir <span className="font-arabic text-emerald-400 text-2xl">الماهر</span>
            </span>
            <p className="text-xs text-emerald-200/80 font-medium">
              Gamified Arabic Learning Platform
            </p>
          </div>
        </div>
      </header>

      {/* Main Hero & Auth Split */}
      <main className="max-w-6xl mx-auto px-6 py-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto">
        {/* Left Column: Value Proposition & Feature Highlights */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/60 border border-emerald-500/30 text-emerald-200 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Belajar Bahasa Arab Jadi Menyenangkan & Adiktif</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.15] tracking-tight">
            Kuasai Bahasa Arab dengan{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300">
              Permainan Seru
            </span>
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal max-w-xl">
            Dari pemula hingga mahir dengan kurikulum sistematis, 4 mode permainan mufrodat, audio pelafalan asli, video nasyid, kuis harian, dan bimbingan Ustadz AI 24/7.
          </p>

          {/* Key Feature Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-700/40 backdrop-blur-sm flex items-start gap-3">
              <div className="p-2 rounded-lg bg-teal-500/20 text-teal-300 shrink-0">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">4 Mode Arena Game</h4>
                <p className="text-xs text-emerald-200/70 mt-0.5">
                  Tebak gambar, sambung kata, audio listening, & kuis cepat.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-700/40 backdrop-blur-sm flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Papan Peringkat Real-time</h4>
                <p className="text-xs text-emerald-200/70 mt-0.5">
                  Kumpulkan XP, pertahankan streak harian, raih lencana.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-700/40 backdrop-blur-sm flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Audio & Multimedia</h4>
                <p className="text-xs text-emerald-200/70 mt-0.5">
                  Pelafalan fusha, video animasi, & nasyid berharakat lengkap.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-700/40 backdrop-blur-sm flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300 shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Kurikulum Bertingkat</h4>
                <p className="text-xs text-emerald-200/70 mt-0.5">
                  Tingkat Mubtadi' (Pemula), Mutawassit, hingga Mutaqaddim.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Authentication Card */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-8 sm:p-10 text-stone-900 shadow-2xl shadow-emerald-950/50 border border-emerald-100 flex flex-col justify-center text-center">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl mx-auto flex items-center justify-center text-emerald-800 mb-4">
              <Sparkles className="w-7 h-7" />
            </div>

            <h3 className="text-2xl font-black text-stone-900 tracking-tight">
              Mulai Petualangan Belajar
            </h3>
            <p className="text-sm text-stone-500 mt-1 mb-8">
              Masuk untuk menyimpan progres, koin XP, streak harian, dan bersaing di papan peringkat.
            </p>

            {/* Google Sign-In Button */}
            <button
              onClick={signInWithGoogle}
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-bold text-base shadow-lg shadow-emerald-700/25 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-5 h-5 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{loading ? 'Menghubungkan...' : 'Masuk dengan Akun Google'}</span>
            </button>

            {/* Quick Demo Options for testing */}
            <div className="mt-8 pt-6 border-t border-stone-200/80">
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-3">
                Atau Coba Mode Uji Coba Cepat
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => signInAsDemo('user')}
                  className="px-3 py-2.5 rounded-lg border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 hover:border-emerald-500 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Akun Pelajar</span>
                </button>
                <button
                  onClick={() => signInAsDemo('admin')}
                  className="px-3 py-2.5 rounded-lg border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 hover:border-emerald-500 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                  <span>Akun Admin</span>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-stone-400 mt-6">
              Dilindungi oleh Firebase Authentication & Google Cloud.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-emerald-800/40 text-center text-xs text-emerald-300/60 max-w-6xl mx-auto w-full px-6">
        <p>© 2026 Al-Mahir (الماهر) - Pembelajaran Bahasa Arab Interaktif & Terakreditasi.</p>
      </footer>
    </div>
  );
};
