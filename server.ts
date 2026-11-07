import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Initialize Gemini Client server-side with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// API route for AI Daily Advice / Reflection Mutaba'ah
app.post('/api/gemini/evaluate', async (req, res) => {
  try {
    if (!ai) {
      return res.status(400).json({
        error:
          'GEMINI_API_KEY belum dikonfigurasi di Settings > Secrets. Mohon isi API Key terlebih dahulu.',
      });
    }

    const { selectedDate, log, stats } = req.body;

    const prompt = `Anda adalah seorang Mentor Mutaba'ah & Routine Coach Islami yang positif, ramah, bijak, dan inspiratif.
Pengguna memperlihatkan pencatatan aktivitas harian mereka pada tanggal ${selectedDate || 'hari ini'}:

[DATA AKTIVITAS HARIAN]
- Bangun Tidur: ${log?.wakeUpText || 'Belum diisi'}
- Shalat Sunnah Dikerjakan: ${log?.completedPrayersCount || 0} dari ${log?.totalPrayersCount || 11} sunnah (Daftar: ${log?.completedPrayersList?.join(', ') || 'Belum ada'})
- Tilawah Al-Qur'an: ${log?.tilawahPages || 0} Halaman (Juz ${log?.tilawahJuz || 1}, Hal ${log?.tilawahStart || 1} - ${log?.tilawahEnd || 20})
- Murajaah Al-Qur'an: ${log?.murajaahText || 'Belum ada'} (${log?.murajaahStatus || 'Belum diselesaikan'})
- Membaca Buku: ${log?.readingTotalPages || 0} halaman (${log?.readingBooksList?.join(', ') || 'Belum ada buku'})
- Olahraga: Push-up ${log?.pushupTotal || 0} reps, Pull-up ${log?.pullupTotal || 0} reps
- Catatan Harian: "${log?.dailyNote || 'Tidak ada catatan'}"

[STATISTIK MINGGUAN]
- Konsistensi Shalat Sunnah: ${stats?.prayerConsistencyRate || 0}%
- Total Halaman Buku Mingguan: ${stats?.weeklyBookPages || 0} hal
- Total Repetisi Push-up Mingguan: ${stats?.weeklyPushups || 0} reps

Tolong berikan evaluasi & motivasi singkat (maksimal 3 paragraf pendek) dalam bahasa Indonesia:
1. 🌟 **Apresiasi**: Puji pencapaian terbaik yang berhasil dilakukan hari ini secara hangat.
2. 📖 **Nasihat & Hikmah**: Berikan 1 mutiara kebaikan / pengingat islami & produktivitas yang relevan dengan amalan mereka.
3. 🎯 **Langkah Kecil Besok**: Berikan saran 1-2 target realistis & ringan agar semakin istiqomah esok hari.

Gunakan format Markdown sederhana dengan emoji yang menarik dan membakar semangat.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({ advice: response.text });
  } catch (err: any) {
    console.error('Gemini Evaluation API Error:', err);
    res.status(500).json({
      error:
        err.message ||
        'Gagal mendapatkan evaluasi AI. Silakan coba beberapa saat lagi.',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
