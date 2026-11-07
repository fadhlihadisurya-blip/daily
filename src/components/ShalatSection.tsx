import React, { useState } from 'react';
import { SUNNAH_PRAYERS } from '../data/quranData';
import { PrayerKey } from '../types';
import { Check, Moon, Clock, FileText, Sparkles, CheckCheck, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ShalatSectionProps {
  prayers: Record<PrayerKey, boolean>;
  prayerNotes?: Partial<Record<PrayerKey, string>>;
  onTogglePrayer: (key: PrayerKey, completed: boolean) => void;
  onUpdatePrayerNote: (key: PrayerKey, note: string) => void;
  onMarkAllPrayers: (completed: boolean) => void;
}

export const ShalatSection: React.FC<ShalatSectionProps> = ({
  prayers,
  prayerNotes = {},
  onTogglePrayer,
  onUpdatePrayerNote,
  onMarkAllPrayers,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('semua');
  const [editingNoteKey, setEditingNoteKey] = useState<PrayerKey | null>(null);

  const categories = [
    { id: 'semua', label: 'Semua (11)' },
    { id: 'malam', label: 'Malam / Tahajjud' },
    { id: 'subuh', label: 'Subuh' },
    { id: 'zuhur', label: 'Zuhur & Dhuha' },
    { id: 'ashar', label: 'Ashar' },
    { id: 'maghrib', label: 'Maghrib' },
    { id: 'isya', label: 'Isya' },
  ];

  const filteredPrayers = SUNNAH_PRAYERS.filter((p) => {
    if (activeCategory === 'semua') return true;
    if (activeCategory === 'zuhur') return p.category === 'zuhur';
    return p.category === activeCategory;
  });

  const completedCount = Object.values(prayers).filter(Boolean).length;
  const totalCount = SUNNAH_PRAYERS.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  const handleCheckboxChange = (key: PrayerKey, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    onTogglePrayer(key, nextStatus);

    // Trigger celebratory confetti if user completes all 11 sunnah prayers!
    if (nextStatus && completedCount + 1 === totalCount) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  return (
    <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/60 shadow-xl backdrop-blur-sm">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700/60">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Moon className="w-5 h-5 fill-emerald-400/20" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Shalat Sunnah Harian
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                {completedCount}/{totalCount} ({percentage}%)
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Checklist ibadah sunnah Rawatib, Tahajjud, Dhuha & Witir
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onMarkAllPrayers(true)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-700/60 hover:bg-emerald-500/20 hover:text-emerald-400 text-slate-300 text-xs font-semibold transition-all border border-slate-600/40"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Tandai Semua</span>
          </button>
          <button
            onClick={() => onMarkAllPrayers(false)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-700/60 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 text-xs font-semibold transition-all border border-slate-600/40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-3 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-700/50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Prayer List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
        {filteredPrayers.map((prayer) => {
          const isDone = Boolean(prayers[prayer.id]);
          const note = prayerNotes[prayer.id] || '';
          const isEditingNote = editingNoteKey === prayer.id;

          return (
            <div
              key={prayer.id}
              className={`p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-900/60 border-slate-700/60 hover:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Custom Checkbox Button */}
                <button
                  onClick={() => handleCheckboxChange(prayer.id, isDone)}
                  className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                    isDone
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/30 scale-105'
                      : 'border-slate-600 bg-slate-800 hover:border-emerald-500 text-transparent'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </button>

                {/* Prayer Label & Description */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      onClick={() => handleCheckboxChange(prayer.id, isDone)}
                      className={`text-sm font-bold cursor-pointer transition-colors ${
                        isDone ? 'text-emerald-300 line-through/50' : 'text-slate-100'
                      }`}
                    >
                      {prayer.label}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-emerald-400 border border-slate-700">
                      {prayer.rakats}
                    </span>
                  </div>

                  <div className="flex items-center text-[11px] text-slate-400 mt-1 space-x-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {prayer.timeLabel}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 italic">
                    {prayer.description}
                  </p>

                  {/* Note display / inline editor */}
                  {note && !isEditingNote && (
                    <div className="mt-2 text-[11px] text-emerald-300/90 bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-800/40 flex items-center justify-between">
                      <span className="truncate">📝 {note}</span>
                      <button
                        onClick={() => setEditingNoteKey(prayer.id)}
                        className="text-[10px] text-slate-400 hover:text-slate-200 ml-2"
                      >
                        Edit
                      </button>
                    </div>
                  )}

                  {isEditingNote ? (
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Tambah catatan shalat ini..."
                        defaultValue={note}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            onUpdatePrayerNote(prayer.id, (e.target as HTMLInputElement).value);
                            setEditingNoteKey(null);
                          }
                        }}
                        onBlur={(e) => {
                          onUpdatePrayerNote(prayer.id, e.target.value);
                          setEditingNoteKey(null);
                        }}
                        autoFocus
                        className="w-full bg-slate-900 px-2.5 py-1 rounded border border-emerald-500 text-xs text-slate-100 focus:outline-none"
                      />
                    </div>
                  ) : !note ? (
                    <button
                      onClick={() => setEditingNoteKey(prayer.id)}
                      className="mt-2 text-[10px] text-slate-500 hover:text-slate-300 flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3" />
                      <span>+ Catatan</span>
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
