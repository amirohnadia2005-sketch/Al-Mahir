import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { GameMode, QuestionItem } from '../types';
import { INITIAL_QUESTIONS } from '../data/initialData';
import { arabicAudio } from '../lib/audio';
import confetti from 'canvas-confetti';
import {
  Gamepad2,
  Image as ImageIcon,
  Puzzle,
  Headphones,
  Zap,
  Volume2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Star,
  Timer,
  Trophy,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const GameArenaView: React.FC = () => {
  const { addXP } = useAuth();
  const [activeMode, setActiveMode] = useState<GameMode>('guess_picture');

  // Game Arena States
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streakCombo, setStreakCombo] = useState<number>(0);
  const [gameFinished, setGameFinished] = useState<boolean>(false);

  // Sambung Kata Word Connect Specific State
  const [constructedWords, setConstructedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);

  // Speed Quiz Specific State
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Filter questions for active mode
  const currentQuestions = INITIAL_QUESTIONS.filter((q) => q.type === activeMode);
  const currentQ = currentQuestions[currentIndex] || currentQuestions[0];

  // Reset or Switch Mode
  const resetGame = (mode: GameMode = activeMode) => {
    setActiveMode(mode);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setStreakCombo(0);
    setGameFinished(false);
    setTimeLeft(60);
    setIsTimerRunning(mode === 'speed_quiz');

    // Setup word connect if mode is word_connect
    const qList = INITIAL_QUESTIONS.filter((q) => q.type === mode);
    if (mode === 'word_connect' && qList.length > 0) {
      const words = [...qList[0].options].sort(() => Math.random() - 0.5);
      setAvailableWords(words);
      setConstructedWords([]);
    }
  };

  useEffect(() => {
    resetGame(activeMode);
  }, [activeMode]);

  // Handle countdown for Speed Quiz
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeMode === 'speed_quiz' && isTimerRunning && timeLeft > 0 && !gameFinished) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setGameFinished(true);
            addXP(score, 'Speed Quiz Drill');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeMode, isTimerRunning, timeLeft, gameFinished, score]);

  // Handle Standard Multiple Choice (Tebak Gambar, Audio Listening, Speed Quiz)
  const handleSelectChoice = (choice: string) => {
    if (isAnswered || gameFinished) return;
    setSelectedOption(choice);
    setIsAnswered(true);

    const isCorrect = choice === currentQ.correctAnswer;

    if (isCorrect) {
      arabicAudio.playCorrectSound();
      const points = 20 * (1 + streakCombo * 0.5);
      setScore((prev) => prev + Math.round(points));
      setStreakCombo((prev) => prev + 1);
    } else {
      arabicAudio.playWrongSound();
      setStreakCombo(0);
    }

    // Auto next in Speed Quiz for rapid play
    if (activeMode === 'speed_quiz') {
      setTimeout(() => {
        handleNextQuestion();
      }, 700);
    }
  };

  // Handle Sambung Kata (Click word to place in sentence)
  const handleWordClick = (word: string, fromAvailable: boolean) => {
    if (isAnswered) return;

    if (fromAvailable) {
      const newAvail = [...availableWords];
      const idx = newAvail.indexOf(word);
      if (idx > -1) newAvail.splice(idx, 1);
      setAvailableWords(newAvail);
      setConstructedWords([...constructedWords, word]);
    } else {
      const newConst = [...constructedWords];
      const idx = newConst.indexOf(word);
      if (idx > -1) newConst.splice(idx, 1);
      setConstructedWords(newConst);
      setAvailableWords([...availableWords, word]);
    }
  };

  const verifyConstructedSentence = () => {
    const assembled = constructedWords.join(' ');
    setIsAnswered(true);

    if (assembled === currentQ.correctAnswer) {
      arabicAudio.playCorrectSound();
      setScore((prev) => prev + 30);
      setStreakCombo((prev) => prev + 1);
    } else {
      arabicAudio.playWrongSound();
      setStreakCombo(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < currentQuestions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setSelectedOption(null);
      setIsAnswered(false);

      if (activeMode === 'word_connect') {
        const nextQ = currentQuestions[nextIdx];
        setAvailableWords([...nextQ.options].sort(() => Math.random() - 0.5));
        setConstructedWords([]);
      } else if (activeMode === 'audio_listening') {
        // Auto play audio for next question
        setTimeout(() => {
          arabicAudio.speakArabic(currentQuestions[nextIdx].arabicText);
        }, 300);
      }
    } else {
      // Completed all questions in mode
      setGameFinished(true);
      arabicAudio.playLevelUpSound();
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
      });
      addXP(score, `Arena Game: ${activeMode}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Game Mode Selector Header Tabs */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
            <Gamepad2 className="w-4 h-4" />
            <span>Pusat Permainan Mufrodat Interaktif</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Arena Tantangan Bahasa Arab
          </h2>
        </div>

        {/* Live Score & Combo Pill */}
        <div className="flex items-center gap-3">
          {streakCombo > 1 && (
            <div className="flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-900 text-xs font-extrabold rounded-full border border-amber-300 animate-bounce">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>Combo {streakCombo}x!</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-black rounded-xl">
            <Star className="w-4 h-4 text-emerald-600 fill-emerald-600" />
            <span>{score} Skor</span>
          </div>
        </div>
      </div>

      {/* 4 Mode Buttons Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => resetGame('guess_picture')}
          className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
            activeMode === 'guess_picture'
              ? 'bg-emerald-900 text-white border-emerald-900 shadow-md scale-[1.02]'
              : 'bg-white text-stone-700 border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/30'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <ImageIcon className={`w-5 h-5 ${activeMode === 'guess_picture' ? 'text-amber-400' : 'text-emerald-700'}`} />
            <span className="text-[10px] font-bold opacity-80 uppercase tracking-wider">Mode 1</span>
          </div>
          <div className="mt-2">
            <div className="text-sm font-extrabold">Tebak Gambar</div>
            <div className="text-[11px] opacity-75">Visual Mufrodat</div>
          </div>
        </button>

        <button
          onClick={() => resetGame('word_connect')}
          className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
            activeMode === 'word_connect'
              ? 'bg-emerald-900 text-white border-emerald-900 shadow-md scale-[1.02]'
              : 'bg-white text-stone-700 border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/30'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <Puzzle className={`w-5 h-5 ${activeMode === 'word_connect' ? 'text-amber-400' : 'text-teal-700'}`} />
            <span className="text-[10px] font-bold opacity-80 uppercase tracking-wider">Mode 2</span>
          </div>
          <div className="mt-2">
            <div className="text-sm font-extrabold">Sambung Kata</div>
            <div className="text-[11px] opacity-75">Susun Kalimat Sempurna</div>
          </div>
        </button>

        <button
          onClick={() => resetGame('audio_listening')}
          className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
            activeMode === 'audio_listening'
              ? 'bg-emerald-900 text-white border-emerald-900 shadow-md scale-[1.02]'
              : 'bg-white text-stone-700 border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/30'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <Headphones className={`w-5 h-5 ${activeMode === 'audio_listening' ? 'text-amber-400' : 'text-purple-700'}`} />
            <span className="text-[10px] font-bold opacity-80 uppercase tracking-wider">Mode 3</span>
          </div>
          <div className="mt-2">
            <div className="text-sm font-extrabold">Audio Listening</div>
            <div className="text-[11px] opacity-75">Uji Pendengaran (Istima')</div>
          </div>
        </button>

        <button
          onClick={() => resetGame('speed_quiz')}
          className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
            activeMode === 'speed_quiz'
              ? 'bg-emerald-900 text-white border-emerald-900 shadow-md scale-[1.02]'
              : 'bg-white text-stone-700 border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/30'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <Zap className={`w-5 h-5 ${activeMode === 'speed_quiz' ? 'text-amber-400' : 'text-amber-600'}`} />
            <span className="text-[10px] font-bold opacity-80 uppercase tracking-wider">Mode 4</span>
          </div>
          <div className="mt-2">
            <div className="text-sm font-extrabold">Kuis Cepat</div>
            <div className="text-[11px] opacity-75">60 Detik Blitz</div>
          </div>
        </button>
      </div>

      {/* Main Game Stage */}
      {!gameFinished ? (
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-10 space-y-8">
          {/* Top Progress & Timer Indicator */}
          <div className="flex items-center justify-between text-xs font-bold text-stone-500">
            <span>
              Tantangan {currentIndex + 1} dari {currentQuestions.length}
            </span>

            {activeMode === 'speed_quiz' ? (
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-sm font-bold ${
                  timeLeft <= 10
                    ? 'bg-red-100 text-red-700 animate-pulse'
                    : 'bg-stone-100 text-stone-700'
                }`}
              >
                <Timer className="w-4 h-4" />
                <span>{timeLeft}s Tersisa</span>
              </div>
            ) : (
              <span className="text-emerald-700">+{20 * (1 + streakCombo * 0.5)} XP Per Jawaban Benar</span>
            )}
          </div>

          {/* MODE 1: TEBAK GAMBAR (Picture Guessing) */}
          {activeMode === 'guess_picture' && currentQ && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6 bg-stone-50 p-6 rounded-2xl border border-stone-100">
                {/* Visual Image container with fallback */}
                <div className="w-48 h-48 rounded-2xl overflow-hidden bg-stone-200 border border-stone-300 flex items-center justify-center shrink-0 shadow-inner">
                  {currentQ.imageUrl ? (
                    <img
                      src={currentQ.imageUrl}
                      alt={currentQ.translation}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="font-arabic text-6xl text-emerald-800 font-bold">
                      {currentQ.arabicText}
                    </div>
                  )}
                </div>

                {/* Question Prompt & Arabic display */}
                <div className="text-center sm:text-left space-y-2 flex-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Kategori: {currentQ.category}
                  </span>
                  <div className="font-arabic text-4xl sm:text-5xl font-bold text-emerald-950">
                    {currentQ.arabicText}
                  </div>
                  <p className="text-sm font-semibold text-stone-600">
                    [{currentQ.transliteration}]
                  </p>
                  <p className="text-xs text-stone-500">
                    Manakah arti bahasa Indonesia yang tepat untuk gambar dan kosakata di atas?
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => arabicAudio.speakArabic(currentQ.arabicText)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Dengarkan Suara</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  const isCorrect = option === currentQ.correctAnswer;

                  let style =
                    'bg-white border-stone-200 text-stone-800 hover:border-emerald-500 hover:bg-emerald-50/40';

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
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleSelectChoice(option)}
                      className={`p-4 rounded-xl border text-base font-semibold text-left transition-all flex items-center justify-between cursor-pointer ${style}`}
                    >
                      <span>{option}</span>
                      {isAnswered && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      )}
                      {isAnswered && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* MODE 2: SAMBUNG KATA (Word Connect / Sentence Assembly) */}
          {activeMode === 'word_connect' && currentQ && (
            <div className="space-y-6 text-center">
              <div className="p-4 bg-emerald-50/70 border border-emerald-200/70 rounded-2xl space-y-1">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Target Kalimat:
                </span>
                <p className="text-lg font-bold text-stone-900">
                  "{currentQ.translation}"
                </p>
                <p className="text-xs text-stone-500">
                  Klik kata-kata Arab di bawah ini sesuai urutan yang tepat untuk membentuk kalimat sempurna (Jumlah Mufidah).
                </p>
              </div>

              {/* Sentence Assembly Box */}
              <div className="min-h-[90px] p-4 bg-stone-50 border-2 border-dashed border-emerald-400 rounded-2xl flex items-center justify-center flex-wrap gap-3">
                {constructedWords.length === 0 ? (
                  <span className="text-xs text-stone-400 italic">
                    (Klik kata-kata di bawah untuk menyusun kalimat di sini)
                  </span>
                ) : (
                  constructedWords.map((word, i) => (
                    <button
                      key={i}
                      onClick={() => handleWordClick(word, false)}
                      className="font-arabic text-2xl font-bold px-4 py-2 bg-emerald-700 text-white rounded-xl shadow-sm hover:bg-emerald-800 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <span>{word}</span>
                      <span className="text-xs text-emerald-200">✕</span>
                    </button>
                  ))
                )}
              </div>

              {/* Available Words Pool */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-stone-400">Pilihan Kata:</span>
                <div className="flex items-center justify-center flex-wrap gap-3">
                  {availableWords.map((word, i) => (
                    <button
                      key={i}
                      onClick={() => handleWordClick(word, true)}
                      className="font-arabic text-2xl font-bold px-5 py-2.5 bg-white border border-stone-300 text-emerald-950 rounded-xl shadow-sm hover:border-emerald-600 hover:bg-emerald-50 active:scale-95 transition-all cursor-pointer"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>

              {/* Verify Assembly Button */}
              {!isAnswered && constructedWords.length > 0 && (
                <div className="pt-2">
                  <button
                    onClick={verifyConstructedSentence}
                    className="px-8 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                  >
                    Periksa Susunan Kalimat
                  </button>
                </div>
              )}
            </div>
          )}

          {/* MODE 3: AUDIO LISTENING (Istima') */}
          {activeMode === 'audio_listening' && currentQ && (
            <div className="space-y-8 text-center">
              <div className="py-6 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                  Uji Kepekaan Pendengaran Arab (Istima')
                </span>
                <h3 className="text-xl font-bold text-stone-900">
                  Dengarkan audio berikut dengan saksama:
                </h3>

                {/* Big Animated Speaker Button */}
                <div className="flex flex-col items-center gap-3">
                  <button
                    onClick={() => arabicAudio.speakArabic(currentQ.arabicText, 0.85)}
                    className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-700 to-emerald-600 text-white shadow-xl shadow-purple-600/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                  >
                    <Volume2 className="w-10 h-10" />
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => arabicAudio.speakArabic(currentQ.arabicText, 0.65)}
                      className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Putar Lambat (0.6x)
                    </button>
                    <button
                      onClick={() => arabicAudio.speakArabic(currentQ.arabicText, 1.0)}
                      className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Putar Normal (1.0x)
                    </button>
                  </div>
                </div>

                {isAnswered && (
                  <div className="font-arabic text-3xl font-bold text-emerald-900 animate-in fade-in">
                    {currentQ.arabicText} <span className="text-sm font-sans font-semibold text-stone-500">[{currentQ.transliteration}]</span>
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  const isCorrect = option === currentQ.correctAnswer;

                  let style =
                    'bg-white border-stone-200 text-stone-800 hover:border-purple-500 hover:bg-purple-50/40';

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
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleSelectChoice(option)}
                      className={`p-4 rounded-xl border text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${style}`}
                    >
                      <span>{option}</span>
                      {isAnswered && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* MODE 4: KUIS CEPAT (Speed Quiz Drill) */}
          {activeMode === 'speed_quiz' && currentQ && (
            <div className="space-y-6 text-center">
              <div className="py-4 space-y-2">
                <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest">
                  Tantangan Kilat Mufrodat
                </span>
                <div className="font-arabic text-5xl font-extrabold text-emerald-950 py-2">
                  {currentQ.arabicText}
                </div>
                <div className="text-sm font-bold text-stone-500">
                  [{currentQ.transliteration}]
                </div>
              </div>

              {/* Rapid Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                {currentQ.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectChoice(option)}
                    className="p-4 rounded-xl border border-stone-200 text-stone-900 font-bold hover:bg-emerald-50 hover:border-emerald-500 active:scale-98 transition-all cursor-pointer text-sm"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Next / Feedback Strip */}
          {isAnswered && activeMode !== 'speed_quiz' && (
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-emerald-900">
                  Jawaban tepat: {currentQ.correctAnswer}
                </span>
              </div>

              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer ml-auto"
              >
                <span>Tantangan Selanjutnya</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Game Over / Victory Summary */
        <div className="bg-white rounded-3xl border border-stone-200 shadow-md p-8 sm:p-12 text-center space-y-6">
          <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl mx-auto flex items-center justify-center">
            <Trophy className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-3xl font-black text-stone-900">Sesi Permainan Selesai!</h3>
            <p className="font-arabic text-2xl text-emerald-800 font-bold mt-1">
              أَحْسَنْتَ صُنْعًا
            </p>
            <p className="text-sm text-stone-600 mt-2 max-w-md mx-auto">
              Permainan luar biasa! Anda berhasil menguji pemahaman kosakata bahasa Arab secara interaktif.
            </p>
          </div>

          <div className="grid grid-cols-2 max-w-xs mx-auto gap-3 text-center">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <div className="text-xs text-stone-500 font-medium">Total Skor</div>
              <div className="text-2xl font-black text-emerald-700">{score}</div>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <div className="text-xs text-stone-500 font-medium">Hadiah XP</div>
              <div className="text-2xl font-black text-amber-600">+{score} XP</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={() => resetGame(activeMode)}
              className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Mainkan Lagi</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
