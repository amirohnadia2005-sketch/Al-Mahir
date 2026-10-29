export type UserRole = 'user' | 'admin';
export type CurriculumLevel = 'mubtadi' | 'mutawassit' | 'mutaqaddim';
export type GameMode = 'guess_picture' | 'word_connect' | 'audio_listening' | 'speed_quiz';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: UserRole;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  completedLessons: string[];
  badges: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  photoURL?: string;
  xp: number;
  level: number;
  streak: number;
  updatedAt?: string;
}

export interface VocabularyItem {
  id: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  exampleArabic?: string;
  exampleTranslation?: string;
  audioText?: string;
  imageUrl?: string;
}

export interface Lesson {
  id: string;
  title: string;
  titleArabic: string;
  description: string;
  xpReward: number;
  vocabularies: VocabularyItem[];
  practiceQuiz: {
    question: string;
    arabic?: string;
    options: string[];
    answer: string;
  }[];
}

export interface CurriculumModule {
  id: string;
  level: CurriculumLevel;
  levelTitle: string;
  title: string;
  titleArabic: string;
  order: number;
  description: string;
  iconName: string;
  lessons: Lesson[];
}

export interface QuestionItem {
  id: string;
  type: GameMode;
  level: CurriculumLevel;
  arabicText: string;
  transliteration: string;
  translation: string;
  options: string[];
  correctAnswer: string;
  imageUrl?: string;
  audioText?: string;
  category: string;
}

export interface MediaItem {
  id: string;
  title: string;
  titleArabic?: string;
  category: string; // e.g. "Lagu Edukasi", "Kisah Pendek", "Tata Bahasa", "Nasyid"
  type: 'video' | 'song' | 'audio';
  url: string; // YouTube embed or audio stream
  description: string;
  lyricsArabic?: string;
  lyricsTranslation?: string;
  duration?: string;
}

export interface Badge {
  id: string;
  name: string;
  arabicName: string;
  description: string;
  icon: string;
  requiredXp?: number;
  requiredStreak?: number;
}
