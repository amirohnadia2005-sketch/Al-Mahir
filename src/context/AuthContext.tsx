import React, { createContext, useContext, useEffect, useState, useTransition } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';
import confetti from 'canvas-confetti';
import { arabicAudio } from '../lib/audio';

const ADMIN_EMAIL = 'amiroh.nadia2005@gmail.com';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAsDemo: (role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  addXP: (amount: number, reason?: string) => Promise<void>;
  completeLesson: (lessonId: string, xpReward: number) => Promise<void>;
  recordDailyQuiz: (bonusXp: number) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [, startTransition] = useTransition();

  const isAdmin =
    profile?.role === 'admin' ||
    user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setUser(fbUser);
        await syncUserProfile(fbUser);
      } else {
        // Check if demo user saved in session
        const demoData = sessionStorage.getItem('al_mahir_demo_user');
        if (demoData) {
          try {
            const parsed = JSON.parse(demoData) as UserProfile;
            setProfile(parsed);
          } catch {
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync user profile to Firestore
  const syncUserProfile = async (fbUser: FirebaseUser) => {
    const userDocRef = doc(db, 'users', fbUser.uid);
    const today = new Date().toISOString().split('T')[0];

    try {
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        // Verify admin role if matches admin email
        const determinedRole: UserRole =
          fbUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
            ? 'admin'
            : data.role || 'user';

        const updatedProfile: UserProfile = {
          ...data,
          role: determinedRole,
          displayName: fbUser.displayName || data.displayName || 'Pelajar Al-Mahir',
          email: fbUser.email || data.email,
          photoURL: fbUser.photoURL || data.photoURL,
        };

        setProfile(updatedProfile);

        // Sync leaderboard entry
        await syncLeaderboard(updatedProfile);
      } else {
        // Create initial user document
        const isUserAdmin = fbUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
        const newProfile: UserProfile = {
          uid: fbUser.uid,
          displayName: fbUser.displayName || 'Pelajar Baru',
          email: fbUser.email || '',
          photoURL: fbUser.photoURL || undefined,
          role: isUserAdmin ? 'admin' : 'user',
          xp: 100, // starting bonus
          level: 1,
          streak: 1,
          lastActiveDate: today,
          completedLessons: [],
          badges: ['b1'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await setDoc(userDocRef, newProfile);
        setProfile(newProfile);
        await syncLeaderboard(newProfile);
      }
    } catch (err) {
      console.warn('Sync profile warning:', err);
      // Fallback local profile if offline or initializing
      const fallback: UserProfile = {
        uid: fbUser.uid,
        displayName: fbUser.displayName || 'Pelajar Al-Mahir',
        email: fbUser.email || '',
        photoURL: fbUser.photoURL || undefined,
        role: fbUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user',
        xp: 100,
        level: 1,
        streak: 1,
        lastActiveDate: today,
        completedLessons: [],
        badges: ['b1'],
      };
      setProfile(fallback);
    }
  };

  const syncLeaderboard = async (prof: UserProfile) => {
    try {
      const lbDocRef = doc(db, 'leaderboard', prof.uid);
      await setDoc(
        lbDocRef,
        {
          uid: prof.uid,
          displayName: prof.displayName,
          photoURL: prof.photoURL || '',
          xp: prof.xp,
          level: prof.level,
          streak: prof.streak,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch {
      // Leaderboard update non-blocking
    }
  };

  // Google Sign-In
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        setUser(res.user);
        await syncUserProfile(res.user);
      }
    } catch (err) {
      console.error('Google Sign-in failed:', err);
      alert('Gagal masuk dengan Google. Silakan coba kembali.');
    } finally {
      setLoading(false);
    }
  };

  // Demo Sign-in for immediate testing/guest review
  const signInAsDemo = async (role: UserRole = 'user') => {
    setLoading(true);
    const demoProfile: UserProfile = {
      uid: role === 'admin' ? 'demo-admin-id' : 'demo-santri-id',
      displayName: role === 'admin' ? 'Ustadz Admin (Demo)' : 'Ahmad Santri (Demo)',
      email: role === 'admin' ? ADMIN_EMAIL : 'santri.demo@almahir.edu',
      photoURL:
        role === 'admin'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role,
      xp: role === 'admin' ? 2450 : 380,
      level: role === 'admin' ? 12 : 3,
      streak: 5,
      lastActiveDate: new Date().toISOString().split('T')[0],
      completedLessons: ['lesson-1-1', 'lesson-1-2'],
      badges: ['b1', 'b2'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    sessionStorage.setItem('al_mahir_demo_user', JSON.stringify(demoProfile));
    setProfile(demoProfile);
    setLoading(false);
  };

  // Logout
  const logout = async () => {
    try {
      sessionStorage.removeItem('al_mahir_demo_user');
      if (auth.currentUser) {
        await fbSignOut(auth);
      }
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Add XP and handle level up
  const addXP = async (amount: number, _reason?: string) => {
    if (!profile) return;

    const oldLevel = profile.level;
    const newXP = profile.xp + amount;
    const newLevel = Math.floor(newXP / 100) + 1;

    // Check newly earned badges
    const newBadges = [...profile.badges];
    if (newXP >= 300 && !newBadges.includes('b3')) newBadges.push('b3');
    if (newXP >= 600 && !newBadges.includes('b4')) newBadges.push('b4');
    if (newXP >= 1200 && !newBadges.includes('b5')) newBadges.push('b5');

    const updated: UserProfile = {
      ...profile,
      xp: newXP,
      level: newLevel,
      badges: newBadges,
      updatedAt: new Date().toISOString(),
    };

    // Trigger celebration if leveled up
    if (newLevel > oldLevel) {
      arabicAudio.playLevelUpSound();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    startTransition(() => {
      setProfile(updated);
    });

    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          xp: newXP,
          level: newLevel,
          badges: newBadges,
          updatedAt: new Date().toISOString(),
        });
        await syncLeaderboard(updated);
      } catch (e) {
        console.warn('Update XP Firestore warning:', e);
      }
    } else {
      sessionStorage.setItem('al_mahir_demo_user', JSON.stringify(updated));
    }
  };

  // Complete a lesson
  const completeLesson = async (lessonId: string, xpReward: number) => {
    if (!profile) return;
    if (profile.completedLessons.includes(lessonId)) {
      // already completed, still give half XP for practice
      await addXP(Math.round(xpReward / 2));
      return;
    }

    const updatedLessons = [...profile.completedLessons, lessonId];
    const newXP = profile.xp + xpReward;
    const newLevel = Math.floor(newXP / 100) + 1;

    const updated: UserProfile = {
      ...profile,
      xp: newXP,
      level: newLevel,
      completedLessons: updatedLessons,
      updatedAt: new Date().toISOString(),
    };

    arabicAudio.playCorrectSound();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });

    startTransition(() => {
      setProfile(updated);
    });

    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          xp: newXP,
          level: newLevel,
          completedLessons: updatedLessons,
          updatedAt: new Date().toISOString(),
        });
        await syncLeaderboard(updated);
      } catch (e) {
        console.warn('Firestore update error:', e);
      }
    } else {
      sessionStorage.setItem('al_mahir_demo_user', JSON.stringify(updated));
    }
  };

  // Record daily quiz
  const recordDailyQuiz = async (bonusXp: number) => {
    if (!profile) return;
    const today = new Date().toISOString().split('T')[0];
    const isNewDay = profile.lastActiveDate !== today;

    const newStreak = isNewDay ? profile.streak + 1 : profile.streak;
    const newBadges = [...profile.badges];
    if (newStreak >= 3 && !newBadges.includes('b2')) newBadges.push('b2');

    const updated: UserProfile = {
      ...profile,
      xp: profile.xp + bonusXp,
      level: Math.floor((profile.xp + bonusXp) / 100) + 1,
      streak: newStreak,
      lastActiveDate: today,
      badges: newBadges,
      updatedAt: new Date().toISOString(),
    };

    arabicAudio.playCorrectSound();
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.6 },
    });

    setProfile(updated);

    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          xp: updated.xp,
          level: updated.level,
          streak: newStreak,
          lastActiveDate: today,
          badges: newBadges,
          updatedAt: new Date().toISOString(),
        });
        await syncLeaderboard(updated);
      } catch (e) {
        console.warn('Firestore daily quiz error:', e);
      }
    } else {
      sessionStorage.setItem('al_mahir_demo_user', JSON.stringify(updated));
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await syncUserProfile(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin,
        signInWithGoogle,
        signInAsDemo,
        logout,
        addXP,
        completeLesson,
        recordDailyQuiz,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
