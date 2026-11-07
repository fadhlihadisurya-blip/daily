import React, { useState } from 'react';
import { MurajaahLog } from '../types';
import { SURAH_LIST, Surah, getSurahsForJuz } from '../data/quranData';
import { BookMarked, Check, Plus, Minus, Sparkles, Award, X, Search, Layers, CheckSquare, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MurajaahSectionProps {
  murajaah: MurajaahLog;
  onUpdateMurajaah: (updated: Partial<MurajaahLog>) => void;
}

export const MurajaahSection: React.FC<MurajaahSectionProps> = ({
  murajaah,
  onUpdateMurajaah,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Get current selected surah numbers array for Multi-Surah mode
  const currentSurahNums: number[] =
    murajaah.selectedSurahNumbers && murajaah.selectedSurahNumbers.length > 0
      ? murajaah.selectedSurahNumbers
      : murajaah.surahNumber
      ? [murajaah.surahNumber]
      : [67]; // Default Al-Mulk

  const completedSurahNums: number[] = murajaah.completedSurahNumbers || [];

  const selectedSurahs: Surah[] = currentSurahNums
    .map((num) => SURAH_LIST.find((s) => s.number === num))
    .filter((s): s is Surah => Boolean(s));

  // Get Surahs contained in the selected Juz (for Juz mode)
  const selectedJuzNum = murajaah.juzNumber || 30;
  const juzSurahs: Surah[] = getSurahsForJuz(selectedJuzNum);

  // Active surah list to render in checklist depending on mode
  const activeChecklistSurahs: Surah[] =
    murajaah.mode === 'surah' ? selectedSurahs : juzSurahs;

  const calculatedTotalPages = activeChecklistSurahs.reduce((sum, s) => sum + s.totalPages, 0);

  const handleModeChange = (mode: 'surah' | 'halaman' | 'juz') => {
    if (mode === 'halaman') {
      const surahs = getSurahsForJuz(selectedJuzNum);
      const totalPages = surahs.reduce((sum, s) => sum + s.totalPages, 0);
      onUpdateMurajaah({
        mode,
        juzNumber: selectedJuzNum,
        targetPages: totalPages,
      });
    } else {
      onUpdateMurajaah({ mode });
    }
  };

  const updateSurahSelection = (newNums: number[]) => {
    const validNums = Array.from(new Set(newNums));
    const newSelectedSurahs = validNums
      .map((num) => SURAH_LIST.find((s) => s.number === num))
      .filter((s): s is Surah => Boolean(s));

    const totalPages = newSelectedSurahs.reduce((sum, s) => sum + s.totalPages, 0);
    const surahNames = newSelectedSurahs.map((s) => s.transliteration).join(', ');

    const validCompleted = (murajaah.completedSurahNumbers || []).filter((n) =>
      validNums.includes(n)
    );
    const completedPagesSum = validCompleted
      .map((n) => SURAH_LIST.find((s) => s.number === n))
      .filter((s): s is Surah => Boolean(s))
      .reduce((sum, s) => sum + s.totalPages, 0);

    onUpdateMurajaah({
      selectedSurahNumbers: validNums,
      completedSurahNumbers: validCompleted,
      surahNumber: validNums[0] || 67,
      surahName: surahNames,
      targetPages: Math.max(1, totalPages),
      completedPages: completedPagesSum,
      completed: validCompleted.length > 0 && validCompleted.length === validNums.length,
    });
  };

  const handleAddSurah = (num: number) => {
    if (!currentSurahNums.includes(num)) {
      updateSurahSelection([...currentSurahNums, num]);
    }
  };

  const handleRemoveSurah = (num: number) => {
    if (currentSurahNums.length <= 1) {
      alert('Minimal harus ada 1 surah terpilih.');
      return;
    }
    const updated = currentSurahNums.filter((n) => n !== num);
    updateSurahSelection(updated);
  };

  const handleSelectFromDropdown = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const num = parseInt(e.target.value, 10);
    if (num) {
      handleAddSurah(num);
    }
  };

  // Quick preset handlers
  const handleSelectPresetSurahs = (nums: number[]) => {
    updateSurahSelection(nums);
  };

  // Toggle single surah completion checkbox in current active checklist
  const handleToggleSurahCompletion = (num: number) => {
    const isAlreadyDone = completedSurahNums.includes(num);
    let nextCompletedNums: number[];

    if (isAlreadyDone) {
      nextCompletedNums = completedSurahNums.filter((n) => n !== num);
    } else {
      nextCompletedNums = [...completedSurahNums, num];
    }

    const doneSurahs = nextCompletedNums
      .map((n) => SURAH_LIST.find((s) => s.number === n))
      .filter((s): s is Surah => Boolean(s));

    const newCompletedPages = doneSurahs.reduce((sum, s) => sum + s.totalPages, 0);
    const isAllCompleted =
      activeChecklistSurahs.length > 0 &&
      activeChecklistSurahs.every((s) => nextCompletedNums.includes(s.number));

    onUpdateMurajaah({
      completedSurahNumbers: nextCompletedNums,
      completedPages: newCompletedPages,
      targetPages: calculatedTotalPages,
      completed: isAllCompleted,
    });

    if (isAllCompleted && !murajaah.completed) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  // Mark all surahs in active checklist done or reset
  const handleMarkAllSurahsDone = (done: boolean) => {
    if (done) {
      const allNums = activeChecklistSurahs.map((s) => s.number);
      const sumPages = activeChecklistSurahs.reduce((sum, s) => sum + s.totalPages, 0);

      onUpdateMurajaah({
        completedSurahNumbers: allNums,
        completedPages: sumPages,
        targetPages: sumPages,
        completed: true,
      });

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
      });
    } else {
      onUpdateMurajaah({
        completedSurahNumbers: [],
        completedPages: 0,
        completed: false,
      });
    }
  };

  const activeCompletedCount = activeChecklistSurahs.filter((s) =>
    completedSurahNums.includes(s.number)
  ).length;

  return (
    <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/60 shadow-xl backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <BookMarked className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Murajaah Al-Qur'an
              {murajaah.completed && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center gap-1">
                  <Award className="w-3 h-3" /> Target Tuntas!
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              Pengulangan hafalan Surah (Checklist Surah) & Per-Juz
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => handleModeChange('surah')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              murajaah.mode === 'surah'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Multi-Surah
          </button>
          <button
            onClick={() => handleModeChange('halaman')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              murajaah.mode === 'halaman'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Per-Juz
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {/* Left Column: Mode Specific Controls */}
        <div className="space-y-3 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
          {murajaah.mode === 'surah' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-400">
                  Pilih Surah Di-Murajaah (Bisa Pilih &gt; 1 Surah)
                </label>
                <span className="text-[11px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  {selectedSurahs.length} Surah Terpilih
                </span>
              </div>

              {/* Surah Dropdown Selector */}
              <div className="relative">
                <select
                  onChange={handleSelectFromDropdown}
                  value=""
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-medium focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="" disabled>
                    + Klik untuk menambah Surah ke daftar murajaah...
                  </option>
                  {SURAH_LIST.map((s) => {
                    const isSelected = currentSurahNums.includes(s.number);
                    return (
                      <option
                        key={s.number}
                        value={s.number}
                        disabled={isSelected}
                      >
                        {isSelected ? '✓ ' : ''}{s.number}. {s.transliteration} ({s.name}) — {s.totalPages} Hal ({s.totalAyah} Ayat)
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Selected Surahs Badges List */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>Surah Yang Dipilih:</span>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-slate-950/70 rounded-xl border border-slate-800">
                  {selectedSurahs.map((surah) => (
                    <div
                      key={surah.number}
                      className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-semibold"
                    >
                      <span className="font-bold text-amber-400">{surah.number}.</span>
                      <span>{surah.transliteration}</span>
                      <span className="text-[10px] text-amber-400/80 bg-slate-900 px-1.5 py-0.2 rounded font-mono">
                        {surah.totalPages} Hal
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSurah(surah.number)}
                        className="p-0.5 hover:bg-amber-500/30 rounded text-amber-300 hover:text-rose-300 transition-colors"
                        title="Hapus Surah ini"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calculated Total Pages Summary Banner */}
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-amber-400">
                    Total Halaman Murajaah:
                  </div>
                  <div className="text-sm font-black text-slate-100 mt-0.5">
                    {calculatedTotalPages} Halaman Total
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Progres Tercentang</span>
                  <span className="text-xs font-bold text-amber-300">
                    {murajaah.completedPages} / {calculatedTotalPages} Hal
                  </span>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-semibold text-slate-400 block">
                  Pilihan Paket Surah Cepat:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSelectPresetSurahs([67, 56, 36, 55])}
                    className="px-2 py-1 rounded-md bg-slate-800 hover:bg-amber-500/20 text-amber-300 text-[11px] font-medium border border-slate-700"
                  >
                    ⚡ Al-Mulk + Waqi'ah + Yasin + Ar-Rahman (18 Hal)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPresetSurahs([18])}
                    className="px-2 py-1 rounded-md bg-slate-800 hover:bg-amber-500/20 text-amber-300 text-[11px] font-medium border border-slate-700"
                  >
                    📖 Al-Kahf (12 Hal)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPresetSurahs([67, 68, 69])}
                    className="px-2 py-1 rounded-md bg-slate-800 hover:bg-amber-500/20 text-amber-300 text-[11px] font-medium border border-slate-700"
                  >
                    ✨ Mulk + Qalam + Haqqah (6 Hal)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-amber-400 mb-1">
                  Pilih Nomor Juz (Juz 1 s/d 30)
                </label>
                <select
                  value={selectedJuzNum}
                  onChange={(e) => {
                    const juzNum = parseInt(e.target.value, 10);
                    const surahs = getSurahsForJuz(juzNum);
                    const totalPages = surahs.reduce((sum, s) => sum + s.totalPages, 0);

                    onUpdateMurajaah({
                      juzNumber: juzNum,
                      targetPages: totalPages,
                      completedSurahNumbers: [],
                      completedPages: 0,
                      completed: false,
                    });
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-bold focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
                    <option key={juz} value={juz}>
                      Juz {juz} ({getSurahsForJuz(juz).length} Surah)
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-center justify-between text-xs">
                <div>
                  <span className="text-amber-400 font-semibold block">
                    Surah Terkandung di Juz {selectedJuzNum}:
                  </span>
                  <span className="text-slate-200 font-bold mt-0.5 block leading-relaxed">
                    {juzSurahs.map((s) => s.transliteration).join(', ')}
                  </span>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <span className="text-[10px] text-slate-400 block font-normal">Total Hal</span>
                  <span className="text-xs font-black text-amber-300">{calculatedTotalPages} Hal</span>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Catatan Murajaah (Ayat yang perlu diulang / kelancaran)
            </label>
            <input
              type="text"
              placeholder="Misal: Ulangi ayat 15-20, lancar di surah Al-Mulk..."
              value={murajaah.notes || ''}
              onChange={(e) => onUpdateMurajaah({ notes: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Right Column: Per-Surah Checklist (Rendered for both Multi-Surah and Juz mode!) */}
        <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-700/60 space-y-3 w-full">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
            <div>
              <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-amber-400" />
                Checklist Target Murajaah {murajaah.mode === 'halaman' ? `Juz ${selectedJuzNum}` : 'Hari Ini'}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {activeCompletedCount} dari {activeChecklistSurahs.length} Surah Selesai ({murajaah.completedPages} / {calculatedTotalPages} Hal)
              </p>
            </div>

            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => handleMarkAllSurahsDone(true)}
                className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 transition-colors"
              >
                ✓ Semua
              </button>
              <button
                type="button"
                onClick={() => handleMarkAllSurahsDone(false)}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-[11px] font-semibold border border-slate-700 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Checklist items per Surah */}
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {activeChecklistSurahs.map((surah) => {
              const isChecked = completedSurahNums.includes(surah.number);
              return (
                <div
                  key={surah.number}
                  onClick={() => handleToggleSurahCompletion(surah.number)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-amber-950/30 border-amber-500/50 shadow-sm'
                      : 'bg-slate-800/80 border-slate-700/70 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                        isChecked
                          ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-md shadow-amber-500/30'
                          : 'border-slate-600 bg-slate-900 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>

                    <div className="text-left">
                      <span
                        className={`text-xs font-bold transition-colors ${
                          isChecked ? 'text-amber-300 line-through/50' : 'text-slate-100'
                        }`}
                      >
                        {surah.number}. {surah.transliteration}
                      </span>
                      <span className="text-[11px] text-amber-400/80 ml-2 font-arabic">
                        ({surah.name})
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-amber-400 border border-slate-700">
                    {surah.totalPages} Hal
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
