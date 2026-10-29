import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { arabicAudio } from '../lib/audio';
import {
  Sparkles,
  Send,
  Volume2,
  BookOpen,
  HelpCircle,
  Loader2,
  FileText,
  Lightbulb,
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

interface SentenceAnalysis {
  arabicSentence: string;
  harakat: string;
  transliteration: string;
  translation: string;
  breakdown: {
    word: string;
    type: string;
    meaning: string;
    explanation: string;
  }[];
  learningTip: string;
}

export const AITutorView: React.FC = () => {
  const { profile } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'analyzer'>('chat');

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      content: `أَهْلًا وَسَهْلًا بِكَ يَا صَدِيقِي! 
Selamat datang! Saya **Ustadz Al-Mahir**, asisten pintar bahasa Arab Anda yang ditenagai oleh **Gemini 3.8 Flash**.

Anda bisa menanyakan apa saja:
- Makna kosakata & akar kata (تَصْرِيفٌ)
- Kaidah tata bahasa (نَحْوٌ & صَرْفٌ)
- Latihan percakapan sehari-hari
- Contoh kalimat berharakat lengkap

Apa yang ingin Anda pelajari hari ini?`,
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Analyzer State
  const [inputSentence, setInputSentence] = useState<string>('ذَهَبَ أَحْمَدُ إِلَى المَدْرَسَةِ');
  const [analysisResult, setAnalysisResult] = useState<SentenceAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Send Chat Message to /api/tutor/chat
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userText = inputMessage.trim();
    const updatedMessages: ChatMessage[] = [...messages, { role: 'user', content: userText }];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          level: profile?.level && profile.level > 5 ? 'mutawassit' : 'mubtadi',
          chatHistory: updatedMessages,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      setMessages([...updatedMessages, { role: 'model', content: data.reply }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages([
        ...updatedMessages,
        {
          role: 'model',
          content:
            'Maaf, koneksi ke server Ustadz AI mengalami kendala. Pastikan server aktif dan GEMINI_API_KEY telah dikonfigurasi.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Analyze Sentence via /api/tutor/analyze-sentence
  const handleAnalyzeSentence = async () => {
    if (!inputSentence.trim() || isAnalyzing) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const res = await fetch('/api/tutor/analyze-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: inputSentence.trim() }),
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error('Sentence analysis error:', err);
      alert('Gagal menganalisis kalimat. Silakan periksa kembali kalimat atau coba lagi nanti.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Asisten Pembelajaran Cerdas (Gemini 3.8 Flash)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Ustadz Al-Mahir AI
          </h2>
        </div>

        {/* Sub-Tabs: Chat vs Analyzer */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl">
          <button
            onClick={() => setActiveSubTab('chat')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'chat'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Tanya Jawab Ustadz
          </button>
          <button
            onClick={() => setActiveSubTab('analyzer')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'analyzer'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Analisis Kalimat & I'rob
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: CHAT TUTOR */}
      {activeSubTab === 'chat' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm flex flex-col h-[600px] overflow-hidden">
          {/* Messages Stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-700 to-teal-500 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-sm mt-1">
                    أ
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-emerald-700 text-white rounded-br-sm'
                      : 'bg-stone-50 border border-stone-200/90 text-stone-800 rounded-bl-sm shadow-xs'
                  }`}
                >
                  <div>{msg.content}</div>

                  {/* Speech button if model message contains Arabic */}
                  {msg.role === 'model' && /[\u0600-\u06FF]/.test(msg.content) && (
                    <div className="mt-3 pt-2 border-t border-stone-200/60 flex justify-end">
                      <button
                        onClick={() => {
                          const arabicMatches = msg.content.match(/[\u0600-\u06FF\s،.؟]+/g);
                          if (arabicMatches) {
                            arabicAudio.speakArabic(arabicMatches.join(' '));
                          }
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Dengarkan Teks Arab</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-stone-400 text-xs font-semibold p-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span>Ustadz AI sedang menyusun penjelasan...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="px-6 py-2 bg-stone-50/80 border-t border-stone-100 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-stone-400 font-medium shrink-0">Contoh:</span>
            <button
              onClick={() => {
                setInputMessage('Bagaimana membedakan Isim, Fi\'il, dan Harf? Berikan contohnya.');
              }}
              className="px-2.5 py-1 bg-white border border-stone-200 rounded-lg text-stone-600 hover:text-emerald-700 hover:border-emerald-300 transition-colors whitespace-nowrap cursor-pointer"
            >
              Bedakan Isim & Fi'il
            </button>
            <button
              onClick={() => {
                setInputMessage('Ajarkan saya cara menanyakan arah jalan dalam bahasa Arab.');
              }}
              className="px-2.5 py-1 bg-white border border-stone-200 rounded-lg text-stone-600 hover:text-emerald-700 hover:border-emerald-300 transition-colors whitespace-nowrap cursor-pointer"
            >
              Percakapan Arah Jalan
            </button>
            <button
              onClick={() => {
                setInputMessage('Jelaskan makna pepatah مَنْ سَارَ عَلَى الدَّرْبِ وَصَلَ');
              }}
              className="px-2.5 py-1 bg-white border border-stone-200 rounded-lg text-stone-600 hover:text-emerald-700 hover:border-emerald-300 transition-colors whitespace-nowrap cursor-pointer"
            >
              Arti Pepatah Mahfuzhat
            </button>
          </div>

          {/* Chat Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-stone-200 bg-white flex items-center gap-3"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Tanyakan kosakata, nahwu, atau terjemahan..."
              className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="p-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* SUB-TAB 2: SENTENCE & I'ROB ANALYZER */}
      {activeSubTab === 'analyzer' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-lg font-bold text-stone-900">
                Penganalisis Struktur Kalimat Arab
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Ketik kalimat Arab (dengan atau tanpa harakat) untuk melihat pembedahan jenis kata (Isim, Fi'il, Harf), terjemahan, dan kaidah i'rob sederhana.
              </p>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                dir="rtl"
                value={inputSentence}
                onChange={(e) => setInputSentence(e.target.value)}
                placeholder="اُكْتُبْ هُنَا جُمْلَةً عَرَبِيَّةً..."
                className="w-full px-4 py-3 font-arabic text-2xl rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600 text-emerald-950 text-right leading-loose"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400">Contoh cepat:</span>
                  <button
                    onClick={() => setInputSentence('العِلْمُ نُورٌ فِي القَلْبِ')}
                    className="text-xs text-emerald-700 hover:underline cursor-pointer"
                  >
                    العِلْمُ نُورٌ
                  </button>
                  <span>·</span>
                  <button
                    onClick={() => setInputSentence('كَتَبَ الطَّالِبُ الدَّرْسَ بِالقَلَمِ')}
                    className="text-xs text-emerald-700 hover:underline cursor-pointer"
                  >
                    كَتَبَ الطَّالِبُ
                  </button>
                </div>

                <button
                  onClick={handleAnalyzeSentence}
                  disabled={isAnalyzing || !inputSentence.trim()}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menganalisis...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Bedah Kalimat</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Analysis Result Display */}
          {analysisResult && (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in">
              {/* Full Sentence Overview */}
              <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/70 rounded-2xl text-center space-y-2">
                <div className="font-arabic text-3xl sm:text-4xl font-bold text-emerald-950">
                  {analysisResult.harakat || analysisResult.arabicSentence}
                </div>
                <div className="text-xs font-semibold text-emerald-800">
                  [{analysisResult.transliteration}]
                </div>
                <div className="text-base font-bold text-stone-900 pt-1">
                  "{analysisResult.translation}"
                </div>

                <div className="pt-2">
                  <button
                    onClick={() =>
                      arabicAudio.speakArabic(analysisResult.harakat || analysisResult.arabicSentence)
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Lafalkan Kalimat</span>
                  </button>
                </div>
              </div>

              {/* Word-by-word Breakdown Table */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Pembedahan Kata Per Kata (Tahlil al-Kalimat)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {analysisResult.breakdown?.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-arabic text-2xl font-bold text-emerald-950">
                          {item.word}
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {item.type}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-stone-800">
                        Arti: {item.meaning}
                      </div>
                      <p className="text-[11px] text-stone-500 leading-relaxed">
                        {item.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Tip */}
              {analysisResult.learningTip && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900 font-medium">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">Kaidah Nahwu & Tips Belajar:</span>
                    <span>{analysisResult.learningTip}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
