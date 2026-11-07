import React, { useState } from 'react';
import { formatDateDDMMYYYY } from '../utils/dateUtils';
import { DailyLog } from '../types';
import { Sparkles, X, RefreshCw, Moon, CheckCircle2, AlertCircle } from 'lucide-react';
import { SUNNAH_PRAYERS } from '../data/quranData';

interface AiAdviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  currentLog: DailyLog;
  allLogs: Record<string, DailyLog>;
}

export const AiAdviceModal: React.FC<AiAdviceModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  currentLog,
  allLogs,
}) => {
  const [loading, setLoading] = useState(false);
  const [adviceText, setAdviceText] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFetchAdvice = async () => {
    setLoading(true);
    setErrorMsg(null);
    setAdviceText(null);

    // Prepare clean summary object for Gemini prompt
    const completedPrayersList = SUNNAH_PRAYERS
      .filter((p) => currentLog.prayers[p.id])
      .map((p) => p.label);

    const readingBooksList = currentLog.readings.map(
      (r) => `${r.bookTitle} (${r.totalPages} hal)`
    );

    const pushups = currentLog.exercises.find((e) => e.type === 'push_up')?.totalReps || 0;
    const pullups = currentLog.exercises.find((e) => e.type === 'pull_up')?.totalReps || 0;

    const wakeUpTextMap: Record<string, string> = {
      bangun_sendiri: 'Bangun sendiri sebelum jam 4',
      dibangunkan: 'Dibangunkan sebelum jam 4',
      terlambat: 'Terlambat bangun (Sesudah jam 4)',
    };

    const summaryLog = {
      wakeUpText: currentLog.wakeUpState ? wakeUpTextMap[currentLog.wakeUpState] : 'Belum diisi',
      completedPrayersCount: completedPrayersList.length,
      totalPrayersCount: SUNNAH_PRAYERS.length,
      completedPrayersList,
      tilawahPages: currentLog.tilawah?.totalPages || 0,
      tilawahStart: currentLog.tilawah?.startPage || 1,
      tilawahEnd: currentLog.tilawah?.endPage || 20,
      tilawahJuz: currentLog.tilawah?.currentJuz || 1,
      readingTotalPages: currentLog.readings.reduce((sum, r) => sum + r.totalPages, 0),
      readingBooksList,
      murajaahText: currentLog.murajaah.surahName || `Juz ${currentLog.murajaah.juzNumber || 30}`,
      murajaahPages: currentLog.murajaah.completedPages,
      murajaahStatus: currentLog.murajaah.completed ? 'Selesai Tuntas' : 'Belum Selesai',
      pushupTotal: pushups,
      pullupTotal: pullups,
      dailyNote: currentLog.dailyNote || '',
    };

    // Calculate past week stats
    const past7Days = Object.values(allLogs).slice(0, 7);
    const weeklyBookPages = past7Days.reduce(
      (acc, l) => acc + l.readings.reduce((s, r) => s + r.totalPages, 0),
      0
    );
    const weeklyPushups = past7Days.reduce(
      (acc, l) => acc + (l.exercises.find((e) => e.type === 'push_up')?.totalReps || 0),
      0
    );

    try {
      const response = await fetch('/api/gemini/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedDate,
          log: summaryLog,
          stats: {
            weeklyBookPages,
            weeklyPushups,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan saat memproses evaluasi.');
      }

      setAdviceText(data.advice);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Gagal tersambung ke layanan AI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-600 text-slate-950 shadow-lg shadow-teal-500/20">
              <Sparkles className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                AI Routine & Mutaba'ah Advisor
              </h3>
              <p className="text-xs text-slate-400">
                Evaluasi cerdas & motivasi islami berdasarkan aktivitas Anda hari ini
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {!adviceText && !loading && !errorMsg && (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <Moon className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200">
                Siap Evaluasi Aktivitas Tanggal {formatDateDDMMYYYY(selectedDate)}?
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Gemini AI akan menganalisis capaian shalat sunnah, murajaah, bacaan buku, dan olahraga Anda, lalu memberikan masukan inspiratif.
              </p>
            </div>

            <button
              onClick={handleFetchAdvice}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 mx-auto"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>Mulai Evaluasi AI Sekarang</span>
            </button>
          </div>
        )}

        {loading && (
          <div className="p-10 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-teal-400 animate-spin mx-auto" />
            <h4 className="text-sm font-bold text-slate-200">
              Sedang Mengevaluasi Jurnal Aktivitas Anda...
            </h4>
            <p className="text-xs text-slate-400">
              Menghitung capaian & menyusun hikmah motivasi islami
            </p>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs space-y-2">
            <div className="flex items-center space-x-2 font-bold">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>Gagal Memuat Evaluasi</span>
            </div>
            <p className="text-slate-300">{errorMsg}</p>
            <button
              onClick={handleFetchAdvice}
              className="mt-2 px-3 py-1.5 rounded-lg bg-rose-500 text-slate-950 font-bold text-xs"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {adviceText && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 text-xs sm:text-sm text-slate-200 leading-relaxed space-y-3 whitespace-pre-wrap">
              {adviceText}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleFetchAdvice}
                className="flex items-center space-x-1.5 text-xs text-teal-400 font-semibold hover:underline"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Generasi Ulang Evaluasi</span>
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
