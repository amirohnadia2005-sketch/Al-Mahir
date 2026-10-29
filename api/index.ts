import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(express.json());

// Initialize Google GenAI on server-side with User-Agent telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Al-Mahir Arabic Learning API',
    timestamp: new Date().toISOString(),
  });
});

// Ustadz AI - Interactive Arabic Tutor Chat
app.post('/api/tutor/chat', async (req: Request, res: Response) => {
  try {
    const { message, level = 'mubtadi', chatHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Pesan pertanyaan tidak boleh kosong' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({
        error: 'GEMINI_API_KEY belum dikonfigurasi di server environment.',
      });
      return;
    }

    const systemInstruction = `Anda adalah "Ustadz Al-Mahir", seorang guru bahasa Arab yang sangat ramah, hangat, sabar, dan menyemangati pelajar dari Indonesia.
Level pelajar saat ini: ${level} (Mubtadi' = Pemula, Mutawassit = Menengah, Mutaqaddim = Mahir).
Panduan menjawab:
1. Selalu tuliskan kata/kalimat Arab DENGAN HARAKAT LENGKAP agar mudah dibaca pelajar (contoh: كِتَابٌ [kitābun] = buku).
2. Sertakan cara baca latin (transliterasi) dan arti dalam Bahasa Indonesia.
3. Jelaskan konsep tata bahasa (Nahwu & Sharaf) dengan sederhana, analogi menarik, dan mudah dipahami.
4. Berikan 1-2 contoh kalimat pendek yang aplikatif dalam kehidupan sehari-hari.
5. Akhiri dengan kalimat penyemangat dalam bahasa Arab dan artinya (contoh: مَنْ جَدَّ وَجَدَ - Siapa yang bersungguh-sungguh, dia akan berhasil!).
6. Format jawaban dengan markdown rapi, poin-poin yang jelas, dan hindari penjelasan berbelit-belit.`;

    const contents = [
      ...chatHistory.slice(-6).map((c: { role: string; content: string }) => ({
        role: c.role === 'user' ? 'user' : 'model',
        parts: [{ text: c.content }],
      })),
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'Maaf, Ustadz sedang merenungkan jawaban. Silakan coba tanyakan kembali.';
    res.json({ reply });
  } catch (error) {
    console.error('Error in /api/tutor/chat:', error);
    res.status(500).json({
      error: 'Terjadi kendala saat menghubungi Ustadz AI.',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// Analisis Kalimat & I'rob Ringkas
app.post('/api/tutor/analyze-sentence', async (req: Request, res: Response) => {
  try {
    const { sentence } = req.body;

    if (!sentence || typeof sentence !== 'string') {
      res.status(400).json({ error: 'Kalimat bahasa Arab wajib disertakan' });
      return;
    }

    const prompt = `Analisis kalimat bahasa Arab berikut untuk pelajar: "${sentence}".
Berikan dalam format JSON dengan struktur:
{
  "arabicSentence": "${sentence}",
  "harakat": "kalimat dengan harakat lengkap",
  "transliteration": "cara baca latin",
  "translation": "arti bahasa Indonesia",
  "breakdown": [
    {
      "word": "kata",
      "type": "Isim / Fi'il / Harf",
      "meaning": "arti",
      "explanation": "penjelasan peran kata sederhana"
    }
  ],
  "learningTip": "tips menghafal atau tata bahasa terkait"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    res.json(JSON.parse(text));
  } catch (error) {
    console.error('Error in /api/tutor/analyze-sentence:', error);
    res.status(500).json({
      error: 'Gagal menganalisis kalimat',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// Generator Kuis Mufrodat Dinamis
app.post('/api/tutor/generate-quiz', async (req: Request, res: Response) => {
  try {
    const { topic = 'kehidupan sehari-hari', level = 'mubtadi', count = 5 } = req.body;

    const prompt = `Buat ${count} soal latihan mufrodat bahasa Arab bertema "${topic}" untuk level ${level}.
Formatkan HANYA dalam JSON valid:
{
  "topic": "${topic}",
  "questions": [
    {
      "id": "q1",
      "type": "multiple_choice",
      "question": "pertanyaan dalam bahasa Indonesia atau Arab",
      "arabicWord": "kata arab berharakat",
      "transliteration": "latin",
      "options": ["pilihan A", "pilihan B", "pilihan C", "pilihan D"],
      "answer": "jawaban yang tepat",
      "explanation": "penjelasan singkat mengapa jawaban ini benar"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    res.json(JSON.parse(text));
  } catch (error) {
    console.error('Error in /api/tutor/generate-quiz:', error);
    res.status(500).json({
      error: 'Gagal membuat kuis dinamis',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// EXPORT DEFAULT APP (tanpa app.listen, sesuai spesifikasi Vercel & prompt pengguna)
export default app;
