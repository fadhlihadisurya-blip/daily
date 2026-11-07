import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Smile, Heart, Zap, Sparkles, Sun } from 'lucide-react';
import { getTodayDateStr } from '../data/initialData';
import { DailyLog } from '../types';

interface DateHeaderProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  currentLog: DailyLog;
  onUpdateMood: (mood: DailyLog['mood']) => void;
}

export const DateHeader: React.FC<DateHeaderProps> = ({
  selectedDate,
  setSelectedDate,
  currentLog,
  onUpdateMood,
}) => {
  const todayStr = getTodayDateStr();

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  // Format date nicely in Indonesian locale
  const formatDateLabel = (dateStr: string) => {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(d);
    } catch (e) {
      return dateStr;
    }
  };

  const isToday = selectedDate === todayStr;

  // Calculate completion breakdown
  const prayersDone = Object.values(currentLog.prayers).filter(Boolean).length;
  const prayerRatio = prayersDone / 11;

  const murajaahDone = currentLog.murajaah.completedPages >= currentLog.murajaah.targetPages;
  const murajaahRatio = Math.min(1, currentLog.murajaah.completedPages / (currentLog.murajaah.targetPages || 1));

  const readingTotal = currentLog.readings.reduce((sum, r) => sum + r.totalPages, 0);
  const readingRatio = Math.min(1, readingTotal / 10);

  const pushups = currentLog.exercises.find((e) => e.type === 'push_up')?.totalReps || 0;
  const exerciseRatio = Math.min(1, pushups / 30);

  const overallProgress = Math.round(
    ((prayerRatio * 0.4 + murajaahRatio * 0.2 + readingRatio * 0.2 + exerciseRatio * 0.2) * 100)
  );

  const moods: { id: DailyLog['mood']; label: string; icon: string }[] = [
    { id: 'motivated', label: 'Semangat', icon: '🔥' },
    { id: 'peaceful', label: 'Tenang', icon: '🕊️' },
    { id: 'happy', label: 'Bahagia', icon: '😊' },
    { id: 'neutral', label: 'Biasa', icon: '😐' },
    { id: 'tired', label: 'Lelah', icon: '😴' },
  ];

  return (
    <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/60 shadow-xl mb-6 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Date Controls */}
        <div className="flex items-center justify-between sm:justify-start gap-2">
          <button
            onClick={handlePrevDay}
            className="p-2 rounded-xl bg-slate-700/70 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-600/50"
            title="Hari Sebelumnya"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="relative flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-700">
            <CalendarIcon className="w-4 h-4 text-emerald-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
              className="bg-transparent text-slate-100 text-xs sm:text-sm font-bold focus:outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={handleNextDay}
            className="p-2 rounded-xl bg-slate-700/70 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-600/50"
            title="Hari Berikutnya"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {!isToday && (
            <button
              onClick={() => setSelectedDate(todayStr)}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-colors"
            >
              Hari Ini
            </button>
          )}
        </div>

        {/* Date Display Label */}
        <div className="text-center md:text-left">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-100">
            {formatDateLabel(selectedDate)}
          </h2>
          <p className="text-xs text-slate-400">
            {isToday ? '🎯 Ringkasan Jurnal Harian Anda' : '📜 Riwayat Jurnal Terlampau'}
          </p>
        </div>

        {/* Daily Mood Selector */}
        <div className="flex items-center justify-center md:justify-end gap-1 sm:gap-1.5 bg-slate-900/60 p-1.5 rounded-xl border border-slate-700/50">
          <span className="text-[11px] font-medium text-slate-400 px-2 hidden lg:inline">
            Suasana Hati:
          </span>
          {moods.map((m) => (
            <button
              key={m.id}
              onClick={() => onUpdateMood(m.id)}
              className={`px-2 py-1 sm:px-2.5 sm:py-1 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1 ${
                currentLog.mood === m.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
              title={m.label}
            >
              <span>{m.icon}</span>
              <span className="hidden sm:inline">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar & Summary Stats */}
      <div className="mt-5 pt-4 border-t border-slate-700/50 grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
        {/* Overall Completion Ring & Percentage */}
        <div className="md:col-span-2 flex items-center space-x-4 bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/60">
          <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
            <svg className="w-14 h-14 transform -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="22"
                stroke="currentColor"
                strokeWidth="4"
                className="text-slate-700"
                fill="transparent"
              />
              <circle
                cx="28"
                cy="28"
                r="22"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={138}
                strokeDashoffset={138 - (138 * overallProgress) / 100}
                strokeLinecap="round"
                className="text-emerald-400 transition-all duration-700 ease-out"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-xs font-black text-emerald-400">
              {overallProgress}%
            </span>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-200">
              Capaian Target Harian
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {overallProgress >= 80
                ? '🌟 Luar biasa! Hampir semua tuntas.'
                : overallProgress >= 50
                ? '👍 Bagus! Pertahankan semangat.'
                : '💪 Mari lengkapi target hari ini!'}
            </p>
          </div>
        </div>

        {/* Quick Summary Pill Breakdown */}
        <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-700/50 text-center">
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Shalat Sunnah
            </div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">
              {prayersDone} / 11
            </div>
          </div>
          <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-700/50 text-center">
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Membaca Buku
            </div>
            <div className="text-sm font-bold text-indigo-400 mt-0.5">
              {readingTotal} Hal
            </div>
          </div>
          <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-700/50 text-center">
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Murajaah Qur'an
            </div>
            <div className="text-sm font-bold text-amber-400 mt-0.5">
              {currentLog.murajaah.completedPages} Hal
            </div>
          </div>
          <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-700/50 text-center">
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Push-Up & Pull-Up
            </div>
            <div className="text-sm font-bold text-rose-400 mt-0.5">
              {pushups} / {currentLog.exercises.find((e) => e.type === 'pull_up')?.totalReps || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
