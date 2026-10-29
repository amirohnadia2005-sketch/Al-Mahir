import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { LeaderboardEntry } from '../types';
import { Trophy, Medal, Flame, Star, Crown, Sparkles, Users } from 'lucide-react';

const SEEDED_LEADERBOARD: LeaderboardEntry[] = [
  {
    uid: 'seed-1',
    displayName: 'Fatimah Az-Zahra',
    photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    xp: 2850,
    level: 14,
    streak: 18,
  },
  {
    uid: 'seed-2',
    displayName: 'Muhammad Rayhan',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    xp: 2420,
    level: 12,
    streak: 14,
  },
  {
    uid: 'seed-3',
    displayName: 'Aisyah Humaira',
    photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    xp: 1980,
    level: 10,
    streak: 9,
  },
  {
    uid: 'seed-4',
    displayName: 'Zaid bin Tsabit',
    photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    xp: 1650,
    level: 8,
    streak: 7,
  },
  {
    uid: 'seed-5',
    displayName: 'Maryam Al-Qibtiyyah',
    photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80',
    xp: 1420,
    level: 7,
    streak: 5,
  },
];

export const LeaderboardView: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(SEEDED_LEADERBOARD);
  const [period, setPeriod] = useState<'all' | 'weekly'>('all');

  // Real-time Firestore sync for leaderboard
  useEffect(() => {
    try {
      const q = query(collection(db, 'leaderboard'), orderBy('xp', 'desc'), limit(20));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const liveData: LeaderboardEntry[] = [];
            snapshot.forEach((docSnap) => {
              liveData.push(docSnap.data() as LeaderboardEntry);
            });

            // Combine with seed to keep list vibrant
            const combinedMap = new Map<string, LeaderboardEntry>();
            liveData.forEach((e) => combinedMap.set(e.uid, e));
            SEEDED_LEADERBOARD.forEach((s) => {
              if (!combinedMap.has(s.uid)) combinedMap.set(s.uid, s);
            });

            const sorted = Array.from(combinedMap.values()).sort((a, b) => b.xp - a.xp);
            setEntries(sorted);
          }
        },
        (error) => {
          console.warn('Leaderboard real-time listener warning:', error);
          // Keep seeded data
        }
      );

      return () => unsubscribe();
    } catch (e) {
      console.warn('Firestore leaderboard query error:', e);
    }
  }, []);

  const topThree = entries.slice(0, 3);
  const remaining = entries.slice(3);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
          <Trophy className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>Papan Peringkat Pelajar Real-Time</span>
        </div>
        <h2 className="text-3xl font-black text-stone-900 tracking-tight">
          Kompetisi Prestasi Al-Mahir
        </h2>
        <p className="text-sm text-stone-500 max-w-lg mx-auto">
          Tingkatkan XP dengan menyelesaikan modul kurikulum, memenangkan arena mufrodat, dan menjaga streak belajar harian.
        </p>
      </div>

      {/* Podium Top 3 */}
      {topThree.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-4 items-end max-w-2xl mx-auto">
          {/* Rank 2 (Silver) */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-2">
              <img
                src={topThree[1].photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'}
                alt={topThree[1].displayName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-slate-300 shadow-md"
              />
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-slate-400 text-white font-extrabold text-xs rounded-full flex items-center justify-center border-2 border-white shadow">
                2
              </span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-stone-900 truncate max-w-[100px] sm:max-w-[130px]">
              {topThree[1].displayName}
            </div>
            <div className="text-xs font-black text-emerald-700 mt-0.5">
              {topThree[1].xp} XP
            </div>
            <div className="w-full bg-slate-100 rounded-t-2xl p-3 mt-3 border-t-2 border-slate-300 shadow-inner">
              <span className="text-[11px] font-bold text-slate-600">Perak</span>
            </div>
          </div>

          {/* Rank 1 (Gold) */}
          <div className="flex flex-col items-center text-center">
            <Crown className="w-7 h-7 text-amber-500 fill-amber-400 mb-1 animate-pulse" />
            <div className="relative mb-2">
              <img
                src={topThree[0].photoURL || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80'}
                alt={topThree[0].displayName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-amber-400 shadow-xl"
              />
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-7 h-7 bg-amber-500 text-white font-extrabold text-sm rounded-full flex items-center justify-center border-2 border-white shadow-md">
                1
              </span>
            </div>
            <div className="text-sm sm:text-base font-black text-stone-900 truncate max-w-[120px] sm:max-w-[160px]">
              {topThree[0].displayName}
            </div>
            <div className="text-sm font-black text-amber-600 mt-0.5 flex items-center justify-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{topThree[0].xp} XP</span>
            </div>
            <div className="w-full bg-amber-50 rounded-t-2xl p-4 mt-3 border-t-4 border-amber-400 shadow-inner">
              <span className="text-xs font-black text-amber-800 uppercase tracking-wider">Juara 1</span>
            </div>
          </div>

          {/* Rank 3 (Bronze) */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-2">
              <img
                src={topThree[2].photoURL || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80'}
                alt={topThree[2].displayName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-amber-700/60 shadow-md"
              />
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-amber-700 text-white font-extrabold text-xs rounded-full flex items-center justify-center border-2 border-white shadow">
                3
              </span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-stone-900 truncate max-w-[100px] sm:max-w-[130px]">
              {topThree[2].displayName}
            </div>
            <div className="text-xs font-black text-emerald-700 mt-0.5">
              {topThree[2].xp} XP
            </div>
            <div className="w-full bg-stone-100 rounded-t-2xl p-3 mt-3 border-t-2 border-amber-700/60 shadow-inner">
              <span className="text-[11px] font-bold text-amber-900">Perunggu</span>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table List */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-stone-500" />
            <span className="text-sm font-bold text-stone-800">Daftar Peringkat Lengkap</span>
          </div>
          <span className="text-xs text-stone-400 font-medium">Real-time update</span>
        </div>

        <div className="divide-y divide-stone-100">
          {entries.map((entry, index) => (
            <div
              key={entry.uid}
              className="px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-stone-50/80 transition-colors"
            >
              {/* Rank & User Info */}
              <div className="flex items-center gap-4">
                <span
                  className={`w-6 text-center font-extrabold text-sm ${
                    index === 0
                      ? 'text-amber-500'
                      : index === 1
                      ? 'text-slate-400'
                      : index === 2
                      ? 'text-amber-700'
                      : 'text-stone-400'
                  }`}
                >
                  {index + 1}
                </span>

                <div className="relative">
                  <img
                    src={entry.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80'}
                    alt={entry.displayName}
                    className="w-10 h-10 rounded-full object-cover border border-stone-200"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-stone-800 text-white text-[9px] font-bold px-1 rounded-full border border-white">
                    L{entry.level}
                  </span>
                </div>

                <div>
                  <div className="text-sm font-bold text-stone-900">
                    {entry.displayName}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <span className="flex items-center gap-1 text-amber-600 font-semibold">
                      <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {entry.streak} Hari Streak
                    </span>
                  </div>
                </div>
              </div>

              {/* XP */}
              <div className="flex items-center gap-1.5 font-black text-emerald-800 text-sm">
                <Star className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                <span>{entry.xp} XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
