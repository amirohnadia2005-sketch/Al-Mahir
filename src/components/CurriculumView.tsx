import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CurriculumLevel, CurriculumModule, Lesson, VocabularyItem } from '../types';
import { INITIAL_CURRICULUM } from '../data/initialData';
import { arabicAudio } from '../lib/audio';
import {
  Volume2,
  CheckCircle,
  Play,
  Lock,
  Star,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  X,
  HelpCircle,
  Award,
  Sparkles,
} from 'lucide-react';

export const CurriculumView: React.FC = () => {
  const { profile, completeLesson } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<CurriculumLevel | 'all'>('all');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeVocabIndex, setActiveVocabIndex] = useState<number>(0);
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizQuestionIndex, setQuizQuestionIndex] = useState<number>(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [lessonCompleted, setLessonCompleted] = useState<boolean>(false);

  const completedSet = new Set(profile?.completedLessons || []);

  const filteredModules = INITIAL_CURRICULUM.filter(
    (m) => selectedLevel === 'all' || m.level === selectedLevel
  );

  const totalLessons = INITIAL_CURRICULUM.reduce((acc, m) => acc + m.lessons.length, 0);
  const userCompletedCount = profile?.completedLessons?.length || 0;
  const progressPercent = Math.min(100, Math.round((userCompletedCount / totalLessons) * 100));

  const startLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setActiveVocabIndex(0);
    setIsQuizMode(false);
    setQuizQuestionIndex(0);
    setSelectedQuizOption(null);
    setQuizFeedback(null);
    setLessonCompleted(false);

    // Speak first vocab if available
    if (lesson.vocabularies.length > 0) {
      setTimeout(() => {
        arabicAudio.speakArabic(lesson.vocabularies[0].arabic);
      }, 300);
    }
  };

  const handleNextVocab = () => {
    if (!activeLesson) return;
    if (activeVocabIndex < activeLesson.vocabularies.length - 1) {
      const nextIndex = activeVocabIndex + 1;
      setActiveVocabIndex(nextIndex);
      arabicAudio.speakArabic(activeLesson.vocabularies[nextIndex].arabic);
    } else {
      // Transition to practice quiz
      setIsQuizMode(true);
      setQuizQuestionIndex(0);
      setSelectedQuizOption(null);
      setQuizFeedback(null);
    }
  };

  const handlePrevVocab = () => {
    if (!activeLesson) return;
    if (activeVocabIndex > 0) {
      const prevIndex = activeVocabIndex - 1;
      setActiveVocabIndex(prevIndex);
      arabicAudio.speakArabic(activeLesson.vocabularies[prevIndex].arabic);
    }
  };

  const handleQuizAnswer = (option: string) => {
    if (!activeLesson || selectedQuizOption !== null) return;
    setSelectedQuizOption(option);

    const currentQuiz = activeLesson.practiceQuiz[quizQuestionIndex];
    if (option === currentQuiz.answer) {
      setQuizFeedback('correct');
      arabicAudio.playCorrectSound();
    } else {
      setQuizFeedback('wrong');
      arabicAudio.playWrongSound();
    }
  };

  const handleNextQuiz = () => {
    if (!activeLesson) return;
    setSelectedQuizOption(null);
    setQuizFeedback(null);

    if (quizQuestionIndex < activeLesson.practiceQuiz.length - 1) {
      setQuizQuestionIndex(quizQuestionIndex + 1);
    } else {
      // Finished lesson!
      setLessonCompleted(true);
      completeLesson(activeLesson.id, activeLesson.xpReward);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Hero Curriculum Progress Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Peta Petualangan Belajar</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Kurikulum Terstruktur & Bertahap
          </h2>
          <p className="text-sm text-emerald-100 max-w-xl">
            Mulai dari pengenalan sapaan dasar hingga sastra & mahfuzhat tingkat mahir. Selesaikan tiap modul untuk membuka tingkatan selanjutnya.
          </p>
        </div>

        {/* Progress Circular/Bar Metric */}
        <div className="w-full md:w-64 bg-emerald-900/60 backdrop-blur-sm p-4 rounded-xl border border-emerald-600/40 shrink-0">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-emerald-200">Progres Kurikulum</span>
            <span className="text-amber-300 tabular-nums">{progressPercent}%</span>
          </div>
          <div className="w-full bg-emerald-950/80 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-emerald-200/80 mt-2">
            <span>{userCompletedCount} Selesai</span>
            <span>{totalLessons} Total Modul</span>
          </div>
        </div>
      </div>

      {/* Level Filter Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-stone-200 pb-4">
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl">
          <button
            onClick={() => setSelectedLevel('all')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              selectedLevel === 'all'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Semua Jenjang
          </button>
          <button
            onClick={() => setSelectedLevel('mubtadi')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              selectedLevel === 'mubtadi'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Mubtadi' (Pemula)
          </button>
          <button
            onClick={() => setSelectedLevel('mutawassit')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              selectedLevel === 'mutawassit'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Mutawassit (Menengah)
          </button>
          <button
            onClick={() => setSelectedLevel('mutaqaddim')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              selectedLevel === 'mutaqaddim'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Mutaqaddim (Mahir)
          </button>
        </div>

        <span className="text-xs text-stone-500 font-medium">
          Menampilkan {filteredModules.length} Unit Materi
        </span>
      </div>

      {/* Modules Roadmap Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => {
          const moduleCompletedLessons = module.lessons.filter((l) =>
            completedSet.has(l.id)
          ).length;
          const isAllCompleted = moduleCompletedLessons === module.lessons.length;

          return (
            <div
              key={module.id}
              className="bg-white rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
            >
              <div className="p-6 space-y-4">
                {/* Level Tag & Completion Star */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-wide uppercase px-2.5 py-1 rounded-md bg-stone-100 text-stone-700">
                    {module.levelTitle}
                  </span>
                  {isAllCompleted ? (
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>Selesai</span>
                    </div>
                  ) : (
                    <span className="text-xs text-stone-400 font-medium tabular-nums">
                      {moduleCompletedLessons}/{module.lessons.length} Modul
                    </span>
                  )}
                </div>

                {/* Arabic Title & Latin Title */}
                <div>
                  <h4 className="font-arabic text-2xl text-emerald-950 font-bold leading-normal">
                    {module.titleArabic}
                  </h4>
                  <h3 className="text-lg font-bold text-stone-900 mt-1">
                    {module.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    {module.description}
                  </p>
                </div>

                {/* Lessons List in Module */}
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  {module.lessons.map((lesson) => {
                    const isDone = completedSet.has(lesson.id);
                    return (
                      <div
                        key={lesson.id}
                        onClick={() => startLesson(lesson)}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                          isDone
                            ? 'bg-emerald-50/60 border-emerald-200 hover:bg-emerald-100/50'
                            : 'bg-stone-50 border-stone-200 hover:border-emerald-500 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              isDone
                                ? 'bg-emerald-600 text-white'
                                : 'bg-stone-200 text-stone-600'
                            }`}
                          >
                            {isDone ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-stone-800">
                              {lesson.title}
                            </div>
                            <div className="text-[11px] text-stone-500">
                              +{lesson.xpReward} XP · {lesson.vocabularies.length} Mufrodat
                            </div>
                          </div>
                        </div>

                        <span className="text-xs font-bold text-emerald-700 hover:underline shrink-0">
                          {isDone ? 'Ulangi' : 'Mulai'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Lesson Modal */}
      {activeLesson && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            {/* Close Modal Button */}
            <button
              onClick={() => setActiveLesson(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="text-left border-b border-stone-100 pb-4 mb-6 pr-10">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                {isQuizMode ? 'Kuis Evaluasi Pemahaman' : 'Sesi Pengenalan Kosakata'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-stone-900 mt-0.5">
                {activeLesson.title}
              </h3>
              <p className="font-arabic text-emerald-800 text-lg font-bold">
                {activeLesson.titleArabic}
              </p>
            </div>

            {/* Mode 1: Vocabulary Learning Flashcards */}
            {!isQuizMode && !lessonCompleted && (
              <div className="space-y-6">
                {/* Progress Indicators */}
                <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
                  <span>
                    Kosakata {activeVocabIndex + 1} dari {activeLesson.vocabularies.length}
                  </span>
                  <span className="text-emerald-700">+{activeLesson.xpReward} XP Reward</span>
                </div>

                <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-1.5 rounded-full transition-all"
                    style={{
                      width: `${
                        ((activeVocabIndex + 1) / activeLesson.vocabularies.length) * 100
                      }%`,
                    }}
                  />
                </div>

                {/* Vocabulary Showcase Card */}
                {(() => {
                  const currentVocab: VocabularyItem =
                    activeLesson.vocabularies[activeVocabIndex];
                  return (
                    <div className="bg-gradient-to-b from-emerald-50/70 to-stone-50 rounded-2xl p-8 border border-emerald-100 text-center space-y-4">
                      {/* Arabic Word Display */}
                      <div className="font-arabic text-4xl sm:text-5xl text-emerald-950 font-bold tracking-wide py-2">
                        {currentVocab.arabic}
                      </div>

                      {/* Transliteration & Meaning */}
                      <div className="space-y-1">
                        <div className="text-sm font-semibold text-emerald-800 tracking-wide">
                          [{currentVocab.transliteration}]
                        </div>
                        <div className="text-xl font-black text-stone-900">
                          {currentVocab.meaning}
                        </div>
                      </div>

                      {/* Audio Pronunciation Button */}
                      <div className="pt-2">
                        <button
                          onClick={() => arabicAudio.speakArabic(currentVocab.arabic, 0.8)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                        >
                          <Volume2 className="w-4 h-4" />
                          <span>Dengarkan Pelafalan</span>
                        </button>
                      </div>

                      {/* Example Sentence if available */}
                      {currentVocab.exampleArabic && (
                        <div className="mt-6 pt-4 border-t border-emerald-200/50 text-stone-700 space-y-1 text-sm bg-white/70 p-3 rounded-xl">
                          <span className="text-[11px] font-bold text-emerald-700 uppercase block tracking-wider">
                            Contoh Kalimat:
                          </span>
                          <div className="font-arabic text-xl font-bold text-emerald-900">
                            {currentVocab.exampleArabic}
                          </div>
                          <div className="text-xs text-stone-600 italic">
                            "{currentVocab.exampleTranslation}"
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={handlePrevVocab}
                    disabled={activeVocabIndex === 0}
                    className="px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-bold text-stone-700 hover:bg-stone-50 disabled:opacity-40 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Sebelumnya</span>
                  </button>

                  <button
                    onClick={handleNextVocab}
                    className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold shadow-md shadow-emerald-700/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>
                      {activeVocabIndex === activeLesson.vocabularies.length - 1
                        ? 'Mulai Kuis Uji Pemahaman'
                        : 'Lanjut'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Mode 2: Mini Evaluation Quiz */}
            {isQuizMode && !lessonCompleted && (
              <div className="space-y-6">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
                  <span>
                    Soal {quizQuestionIndex + 1} dari {activeLesson.practiceQuiz.length}
                  </span>
                  <span className="text-amber-600 font-bold">Uji Pemahaman</span>
                </div>

                {(() => {
                  const currentQuiz = activeLesson.practiceQuiz[quizQuestionIndex];
                  return (
                    <div className="space-y-4">
                      <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-2">
                        {currentQuiz.arabic && (
                          <div className="font-arabic text-3xl font-bold text-emerald-900">
                            {currentQuiz.arabic}
                          </div>
                        )}
                        <h4 className="text-base sm:text-lg font-bold text-stone-900">
                          {currentQuiz.question}
                        </h4>
                      </div>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {currentQuiz.options.map((opt, i) => {
                          const isSelected = selectedQuizOption === opt;
                          const isCorrect = opt === currentQuiz.answer;

                          let btnStyle =
                            'bg-white border-stone-200 text-stone-800 hover:border-emerald-500 hover:bg-emerald-50/50';

                          if (selectedQuizOption !== null) {
                            if (isCorrect) {
                              btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                            } else if (isSelected) {
                              btnStyle = 'bg-red-100 border-red-500 text-red-950 font-bold';
                            } else {
                              btnStyle = 'bg-stone-50 border-stone-200 text-stone-400 opacity-60';
                            }
                          }

                          return (
                            <button
                              key={i}
                              disabled={selectedQuizOption !== null}
                              onClick={() => handleQuizAnswer(opt)}
                              className={`p-4 rounded-xl border text-sm font-semibold transition-all text-left flex items-center justify-between cursor-pointer ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {selectedQuizOption !== null && isCorrect && (
                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Feedback Banner */}
                      {quizFeedback && (
                        <div
                          className={`p-4 rounded-xl flex items-center justify-between text-sm font-bold ${
                            quizFeedback === 'correct'
                              ? 'bg-emerald-100 text-emerald-900'
                              : 'bg-red-100 text-red-900'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {quizFeedback === 'correct' ? (
                              <Sparkles className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <HelpCircle className="w-5 h-5 text-red-600" />
                            )}
                            <span>
                              {quizFeedback === 'correct'
                                ? 'Mumtaz! Jawaban Anda Tepat!'
                                : `Kurang tepat. Jawaban yang benar: ${currentQuiz.answer}`}
                            </span>
                          </div>

                          <button
                            onClick={handleNextQuiz}
                            className="px-4 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer"
                          >
                            Lanjut
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Mode 3: Lesson Completed Summary */}
            {lessonCompleted && (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full mx-auto flex items-center justify-center">
                  <Award className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-black text-stone-900">
                  Modul Berhasil Dikuasai!
                </h3>
                <p className="font-arabic text-2xl text-emerald-800 font-bold">
                  بَارَكَ اللهُ فِيكَ
                </p>
                <p className="text-sm text-stone-600 max-w-sm mx-auto">
                  Anda telah menguasai kosakata dalam modul ini dan memperoleh hadiah poin pengalaman.
                </p>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-sm">
                  <Star className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                  <span>+{activeLesson.xpReward} XP Berhasil Ditambahkan</span>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => setActiveLesson(null)}
                    className="px-8 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-700/20 cursor-pointer"
                  >
                    Kembali ke Peta Kurikulum
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
