/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar, ActiveTab } from './components/Navbar';
import { LoginView } from './components/LoginView';
import { CurriculumView } from './components/CurriculumView';
import { GameArenaView } from './components/GameArenaView';
import { LeaderboardView } from './components/LeaderboardView';
import { MediaHubView } from './components/MediaHubView';
import { AITutorView } from './components/AITutorView';
import { AdminDashboard } from './components/AdminDashboard';
import { DailyQuizModal } from './components/DailyQuizModal';
import { Loader2 } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('curriculum');
  const [isDailyQuizOpen, setIsDailyQuizOpen] = useState<boolean>(false);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-3xl text-emerald-950 shadow-lg animate-pulse">
          م
        </div>
        <div className="flex items-center gap-2 text-emerald-300 text-sm font-semibold">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Memuat Al-Mahir (الماهر)...</span>
        </div>
      </div>
    );
  }

  // Mandatory Login Gate
  if (!profile) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openDailyQuiz={() => setIsDailyQuizOpen(true)}
      />

      {/* Main Tab Content */}
      <main className="flex-1 pb-16">
        {activeTab === 'curriculum' && <CurriculumView />}
        {activeTab === 'arena' && <GameArenaView />}
        {activeTab === 'media' && <MediaHubView />}
        {activeTab === 'leaderboard' && <LeaderboardView />}
        {activeTab === 'tutor' && <AITutorView />}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Daily Quiz Modal */}
      <DailyQuizModal
        isOpen={isDailyQuizOpen}
        onClose={() => setIsDailyQuizOpen(false)}
      />

      {/* Subtle Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 text-center text-xs text-stone-400">
        <p>© 2026 Al-Mahir (الماهر) · Platform Pembelajaran Bahasa Arab Berbasis Gamifikasi.</p>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
