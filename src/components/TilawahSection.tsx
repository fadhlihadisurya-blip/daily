import React from 'react';
import { TilawahLog } from '../types';
import { getJuzForPage } from '../data/quranData';
import { BookOpenCheck, Check, Sparkles, Award, ArrowRight, BookOpen, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TilawahSectionProps {
  tilawah?: TilawahLog;
  onUpdateTilawah: (updated: TilawahLog) => void;
}

export const TilawahSection: React.FC<TilawahSectionProps> = ({
  tilawah,
  onUpdateTilawah,
}) => {
  // Fallback defaults if tilawah is empty
  const currentStart = tilawah?.startPage || 1;
  const currentEnd = tilawah?.endPage || (currentStart <= 21 ? 21 : currentStart + 19);

  const juzInfo = getJuzForPage(currentStart);
  const totalReadPages = Math.max(0, currentEnd - currentStart + 1);
  const targetPages = juzInfo.targetPages;
  const isCompleted = totalReadPages >= targetPages;
  const completionPercentage = Math.min(100, Math.round((totalReadPages / targetPages) * 100));

  const handleStartPageChange = (val: number) => {
    const start = Math.max(1, Math.min(604, val));
    const newJuzInfo = getJuzForPage(start);
    // Suggest end page for 1 juz target
    const suggestedEnd = Math.min(604, start + newJuzInfo.targetPages - 1);
    const end = Math.max(start, currentEnd < start ? suggestedEnd : currentEnd);
    const total = Math.max(0, end - start + 1);

    const updated: TilawahLog = {
      startPage: start,
      endPage: end,
      totalPages: total,
      currentJuz: newJuzInfo.juz,
      targetPages: newJuzInfo.targetPages,
      completed: total >= newJuzInfo.targetPages,
      notes: tilawah?.notes || '',
    };

    onUpdateTilawah(updated);
  };

  const handleEndPageChange = (val: number) => {
    const end = Math.max(currentStart, Math.min(604, val));
    const total = Math.max(0, end - currentStart + 1);
    const isNowDone = total >= targetPages;

    const updated: TilawahLog = {
      startPage: currentStart,
      endPage: end,
      totalPages: total,
      currentJuz: juzInfo.juz,
      targetPages: targetPages,
      completed: isNowDone,
      notes: tilawah?.notes || '',
    };

    onUpdateTilawah(updated);

    if (isNowDone && (!tilawah || !tilawah.completed)) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  const handleSetOneJuzComplete = () => {
    const end = Math.min(604, juzInfo.endPage);
    const total = Math.max(0, end - currentStart + 1);

    onUpdateTilawah({
      startPage: currentStart,
      endPage: end,
      totalPages: total,
      currentJuz: juzInfo.juz,
      targetPages: targetPages,
      completed: true,
      notes: tilawah?.notes || '',
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleJumpToNextJuz = () => {
    const nextStart = Math.min(604, juzInfo.endPage + 1);
    handleStartPageChange(nextStart);
  };

  return (
    <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/60 shadow-xl backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <BookOpenCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Tilawah Al-Qur'an
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
                Juz {juzInfo.juz} ({targetPages} Hal)
              </span>
              {isCompleted && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center gap-1">
                  <Award className="w-3 h-3" /> Target 1 Juz Tuntas!
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              Pencatatan tilawah harian dengan target 1 Juz per hari (~20 Halaman)
            </p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="hidden sm:flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-200">
            Posisi saat ini: Juz {juzInfo.juz}
          </span>
        </div>
      </div>

      {/* Input Form & Auto Calculation */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Left Column: Page Inputs & Automatic Rules */}
        <div className="space-y-3 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
          <div className="flex items-center justify-between text-xs font-bold text-cyan-400">
            <span>Input Halaman Tilawah Hari Ini</span>
            <span className="text-[10px] text-slate-400 font-normal">
              *Halaman awal otomatis menyambung dari kemarin
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Halaman Awal
              </label>
              <input
                type="number"
                min="1"
                max="604"
                value={currentStart}
                onChange={(e) => handleStartPageChange(parseInt(e.target.value, 10) || 1)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-bold focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Halaman Akhir
              </label>
              <input
                type="number"
                min={currentStart}
                max="604"
                value={currentEnd}
                onChange={(e) => handleEndPageChange(parseInt(e.target.value, 10) || currentStart)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-bold focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Juz Boundary Info Pill */}
          <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 flex items-center justify-between">
            <div>
              Aturan Juz {juzInfo.juz}: <strong className="text-cyan-300">Hal {juzInfo.startPage} s/d {juzInfo.endPage}</strong>
              {juzInfo.juz === 1 && <span className="text-cyan-400 font-semibold ml-1">(21 Hal)</span>}
              {juzInfo.juz === 30 && <span className="text-cyan-400 font-semibold ml-1">(23 Hal)</span>}
              {juzInfo.juz > 1 && juzInfo.juz < 30 && <span className="text-slate-400 ml-1">(20 Hal)</span>}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Catatan Ayat / Pembatas Terakhir
            </label>
            <input
              type="text"
              placeholder="Contoh: Terakhir membaca di Surah Al-Baqarah ayat 141..."
              value={tilawah?.notes || ''}
              onChange={(e) =>
                onUpdateTilawah({
                  startPage: currentStart,
                  endPage: currentEnd,
                  totalPages: totalReadPages,
                  currentJuz: juzInfo.juz,
                  targetPages,
                  completed: isCompleted,
                  notes: e.target.value,
                })
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Right Column: Progress Ring & Target Completion */}
        <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-700/60 flex flex-col items-center justify-center text-center space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Halaman Dibaca Hari Ini
          </div>

          {/* Progress Bar & Counter */}
          <div className="w-full space-y-2">
            <div className="text-3xl font-black text-cyan-400 flex items-baseline justify-center gap-1">
              <span>{totalReadPages}</span>
              <span className="text-sm font-normal text-slate-400">
                / {targetPages} Halaman (Juz {juzInfo.juz})
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-3 p-0.5 overflow-hidden border border-slate-700">
              <div
                className="bg-gradient-to-r from-cyan-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 font-semibold">
              Capaian Target: {completionPercentage}%
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              onClick={handleSetOneJuzComplete}
              className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 active:scale-95 transition-all flex items-center gap-1"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Selesaikan 1 Juz (Hal {juzInfo.endPage})</span>
            </button>

            {currentEnd < 604 && (
              <button
                onClick={handleJumpToNextJuz}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <span>Lanjut Juz {juzInfo.juz + 1}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
