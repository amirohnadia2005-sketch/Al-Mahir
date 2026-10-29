import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Gamepad2,
  CalendarCheck,
  Video,
  Trophy,
  Sparkles,
  Shield,
  LogOut,
  Flame,
  Star,
} from 'lucide-react';

export type ActiveTab =
  | 'curriculum'
  | 'arena'
  | 'daily'
  | 'media'
  | 'leaderboard'
  | 'tutor'
  | 'admin';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  openDailyQuiz: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openDailyQuiz,
}) => {
  const { profile, isAdmin, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand title, one line */}
        <div
          onClick={() => setActiveTab('curriculum')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-500 flex items-center justify-center text-white shadow-sm font-bold text-xl group-hover:scale-105 transition-transform">
            م
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-emerald-950 flex items-center gap-1.5 whitespace-nowrap">
              Al-Mahir <span className="font-arabic text-emerald-700 text-lg font-bold">الماهر</span>
            </span>
            <span className="text-[11px] text-stone-500 font-medium tracking-wide">
              Belajar Bahasa Arab Interaktif
            </span>
          </div>
        </div>

        {/* Zone 2: Primary navigation links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-semibold text-stone-600">
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'curriculum'
                ? 'bg-emerald-50 text-emerald-800'
                : 'hover:text-emerald-700 hover:bg-stone-50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Kurikulum</span>
          </button>

          <button
            onClick={() => setActiveTab('arena')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'arena'
                ? 'bg-emerald-50 text-emerald-800'
                : 'hover:text-emerald-700 hover:bg-stone-50'
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-teal-600" />
            <span>Arena Game</span>
          </button>

          <button
            onClick={openDailyQuiz}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap hover:text-amber-700 hover:bg-amber-50 text-stone-600"
          >
            <CalendarCheck className="w-4 h-4 text-amber-500" />
            <span>Kuis Harian</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'media'
                ? 'bg-emerald-50 text-emerald-800'
                : 'hover:text-emerald-700 hover:bg-stone-50'
            }`}
          >
            <Video className="w-4 h-4 text-purple-600" />
            <span>Lagu & Video</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'leaderboard'
                ? 'bg-emerald-50 text-emerald-800'
                : 'hover:text-emerald-700 hover:bg-stone-50'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Peringkat</span>
          </button>

          <button
            onClick={() => setActiveTab('tutor')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'tutor'
                ? 'bg-emerald-50 text-emerald-800'
                : 'hover:text-emerald-700 hover:bg-stone-50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Ustadz AI</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                activeTab === 'admin'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Gamification Stats & User profile / Logout */}
        <div className="flex items-center gap-3 shrink-0">
          {profile && (
            <>
              {/* Streak Counter */}
              <div
                title="Hari beruntun aktif belajar"
                className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200/70 rounded-full text-xs font-bold text-amber-800 tabular-nums"
              >
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{profile.streak} Hari</span>
              </div>

              {/* XP Counter */}
              <div
                title="Total Poin Pengalaman (XP)"
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200/70 rounded-full text-xs font-bold text-emerald-800 tabular-nums"
              >
                <Star className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                <span>{profile.xp} XP</span>
              </div>

              {/* User Avatar & Level Badge */}
              <div className="flex items-center gap-2 pl-1 border-l border-stone-200">
                <div className="relative">
                  {profile.photoURL ? (
                    <img
                      src={profile.photoURL}
                      alt={profile.displayName}
                      className="w-8 h-8 rounded-full object-cover border border-emerald-300"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                      {profile.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white text-[9px] font-extrabold px-1 py-0.2 rounded-full border border-white tabular-nums">
                    L{profile.level}
                  </span>
                </div>

                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-stone-800 max-w-[110px] truncate leading-tight">
                    {profile.displayName}
                  </span>
                  <span className="text-[10px] text-stone-500 capitalize">
                    {profile.role === 'admin' ? 'Pengajar Admin' : 'Pelajar'}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  title="Keluar dari akun"
                  className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-stone-100 px-2 py-2 overflow-x-auto text-xs bg-stone-50/90">
        <button
          onClick={() => setActiveTab('curriculum')}
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded ${
            activeTab === 'curriculum' ? 'text-emerald-700 font-bold' : 'text-stone-500'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Kurikulum</span>
        </button>
        <button
          onClick={() => setActiveTab('arena')}
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded ${
            activeTab === 'arena' ? 'text-emerald-700 font-bold' : 'text-stone-500'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Arena</span>
        </button>
        <button
          onClick={openDailyQuiz}
          className="flex flex-col items-center gap-1 px-2 py-1 rounded text-amber-600 font-medium"
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Kuis</span>
        </button>
        <button
          onClick={() => setActiveTab('media')}
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded ${
            activeTab === 'media' ? 'text-emerald-700 font-bold' : 'text-stone-500'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Media</span>
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded ${
            activeTab === 'leaderboard' ? 'text-emerald-700 font-bold' : 'text-stone-500'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Peringkat</span>
        </button>
        <button
          onClick={() => setActiveTab('tutor')}
          className={`flex flex-col items-center gap-1 px-2 py-1 rounded ${
            activeTab === 'tutor' ? 'text-emerald-700 font-bold' : 'text-stone-500'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Ustadz AI</span>
        </button>
        {isAdmin && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center gap-1 px-2 py-1 rounded ${
              activeTab === 'admin' ? 'text-emerald-900 font-bold' : 'text-stone-700'
            }`}
          >
            <Shield className="w-4 h-4 text-amber-500" />
            <span>Admin</span>
          </button>
        )}
      </div>
    </header>
  );
};
