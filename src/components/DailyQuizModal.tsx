import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { INITIAL_QUESTIONS } from '../data/initialData';
import { arabicAudio } from '../lib/audio';
import {
  CalendarCheck,
  X,
  Flame,
  CheckCircle2,
  XCircle,
  Star,
  Trophy,
} from 'lucide-react';

interface DailyQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyQuizModal: React.FC<DailyQuizModalProps> = ({ isOpen, onClose }) => {
  const { profile, recordDailyQuiz } = useAuth();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // 5 daily curated questions
  const dailyQuestions = INITIAL_QUESTIONS.slice(0, 5);
  const currentQ = dailyQuestions[currentIndex];

  if (!isOpen) return null;

  const handleSelect = (option: string) => {
    if (isAnswered || isCompleted) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === currentQ.correctAnswer;
    if (isCorrect) {
      arabicAudio.playCorrectSound();
      setCorrectAnswersCount((prev) => prev + 1);
    } else {
      arabicAudio.playWrongSound();
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);

    if (currentIndex < dailyQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Completed daily quiz
      setIsCompleted(true);
      const earnedXP = 50 + correctAnswersCount * 10;
      recordDailyQuiz(earnedXP);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-stone-100 pb-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Tantangan Berhadiah Harian
            </span>
            <h3 className="text-lg font-black text-stone-900">
              Kuis Mufrodat Hari Ini
            </h3>
          </div>
        </div>

        {!isCompleted ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
              <span>
                Soal {currentIndex + 1} dari {dailyQuestions.length}
              </span>
              <div className="flex items-center gap-1 text-amber-600 font-bold">
                <Flame className="w-4 h-4 fill-amber-500" />
                <span>Streak: {profile?.streak || 1} Hari</span>
              </div>
            </div>

            {/* Question Box */}
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-2">
              <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider">
                {currentQ.category}
              </span>
              <div className="font-arabic text-4xl font-bold text-emerald-950">
                {currentQ.arabicText}
              </div>
              <div className="text-sm font-semibold text-stone-500">
                [{currentQ.transliteration}]
              </div>
              <p className="text-sm font-bold text-stone-800 pt-1">
                Apa terjemahan bahasa Indonesia yang tepat?
              </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((opt, i) => {
                const isSelected = selectedOption === opt;
                const isCorrect = opt === currentQ.correctAnswer;

                let style =
                  'bg-white border-stone-200 text-stone-800 hover:border-amber-500 hover:bg-amber-50/40';

                if (isAnswered) {
                  if (isCorrect) {
                    style = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                  } else if (isSelected) {
                    style = 'bg-red-100 border-red-500 text-red-950 font-bold';
                  } else {
                    style = 'bg-stone-50 border-stone-200 text-stone-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={i}
                    disabled={isAnswered}
                    onClick={() => handleSelect(opt)}
                    className={`p-3.5 rounded-xl border text-sm font-semibold text-left transition-all flex items-center justify-between cursor-pointer ${style}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            {isAnswered && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  {currentIndex === dailyQuestions.length - 1 ? 'Lihat Hasil Kuis' : 'Soal Berikutnya'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full mx-auto flex items-center justify-center">
              <Trophy className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black text-stone-900">
              Kuis Harian Tuntas!
            </h3>
            <p className="text-sm text-stone-600 max-w-sm mx-auto">
              Alhamdulillah! Anda menjawab benar {correctAnswersCount} dari {dailyQuestions.length} soal. Streak belajar Anda meningkat!
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold text-sm">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>+{50 + correctAnswersCount * 10} XP Ditambahkan ke Profil</span>
            </div>

            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Tutup & Lanjutkan Belajar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
