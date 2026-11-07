import React, { useState } from 'react';
import { ReadingItem } from '../types';
import { BookOpen, Plus, Trash2, Clock, Bookmark, Sparkles } from 'lucide-react';

interface ReadingSectionProps {
  readings: ReadingItem[];
  onAddReading: (item: Omit<ReadingItem, 'id' | 'timestamp'>) => void;
  onDeleteReading: (id: string) => void;
}

export const ReadingSection: React.FC<ReadingSectionProps> = ({
  readings,
  onAddReading,
  onDeleteReading,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [bookTitle, setBookTitle] = useState('');
  const [startPage, setStartPage] = useState<number | ''>('');
  const [endPage, setEndPage] = useState<number | ''>('');
  const [durationMinutes, setDurationMinutes] = useState<number | ''>(20);
  const [notes, setNotes] = useState('');

  const calculatedPages =
    typeof startPage === 'number' && typeof endPage === 'number' && endPage >= startPage
      ? endPage - startPage
      : typeof endPage === 'number' && startPage === ''
      ? endPage
      : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle.trim()) return;

    const finalStart = typeof startPage === 'number' ? startPage : 1;
    const finalEnd = typeof endPage === 'number' ? endPage : finalStart;
    const total = Math.max(1, finalEnd - finalStart || 1);

    onAddReading({
      bookTitle: bookTitle.trim(),
      startPage: finalStart,
      endPage: finalEnd,
      totalPages: total,
      durationMinutes: typeof durationMinutes === 'number' ? durationMinutes : 15,
      notes: notes.trim(),
    });

    setBookTitle('');
    setStartPage('');
    setEndPage('');
    setNotes('');
    setShowForm(false);
  };

  const totalPagesToday = readings.reduce((sum, r) => sum + r.totalPages, 0);
  const totalMinutesToday = readings.reduce((sum, r) => sum + r.durationMinutes, 0);

  return (
    <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/60 shadow-xl backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Membaca Buku
              {totalPagesToday > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold">
                  {totalPagesToday} Hal ({totalMinutesToday} Menit)
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              Pencatatan progres membaca buku, literatur & naskah
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Tambah Catatan</span>
        </button>
      </div>

      {/* Add Reading Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-indigo-500/30 space-y-3"
        >
          <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Input Aktivitas Membaca Buku
          </h4>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Judul Buku *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Atomic Habits, Fiqih Sunnah, Filosofi Teras..."
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Dari Hal
              </label>
              <input
                type="number"
                min="1"
                placeholder="Hal 1"
                value={startPage}
                onChange={(e) =>
                  setStartPage(e.target.value ? parseInt(e.target.value, 10) : '')
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Sampai Hal
              </label>
              <input
                type="number"
                min="1"
                placeholder="Hal 25"
                value={endPage}
                onChange={(e) =>
                  setEndPage(e.target.value ? parseInt(e.target.value, 10) : '')
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Durasi (Menit)
              </label>
              <input
                type="number"
                min="1"
                placeholder="20"
                value={durationMinutes}
                onChange={(e) =>
                  setDurationMinutes(
                    e.target.value ? parseInt(e.target.value, 10) : ''
                  )
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {calculatedPages > 0 && (
            <div className="text-xs text-indigo-400 font-semibold bg-indigo-950/40 p-2 rounded-lg border border-indigo-800/40">
              Total Halaman Dibaca: {calculatedPages} Halaman
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              Catatan Poin Penting / Kutipan (Opsional)
            </label>
            <textarea
              rows={2}
              placeholder="Ide utama atau pelajaran penting yang didapat..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs shadow-md shadow-indigo-500/20"
            >
              Simpan Membaca
            </button>
          </div>
        </form>
      )}

      {/* Reading List */}
      <div className="mt-4 space-y-2.5">
        {readings.length === 0 ? (
          <div className="p-6 text-center rounded-xl bg-slate-900/40 border border-slate-700/50">
            <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400 font-medium">
              Belum ada aktivitas membaca yang dicatat hari ini.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-2 text-xs text-indigo-400 font-semibold hover:underline"
            >
              + Tambah catatan bacaan pertama
            </button>
          </div>
        ) : (
          readings.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-700/60 flex items-start justify-between gap-3"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <Bookmark className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <h4 className="text-xs sm:text-sm font-bold text-slate-100 truncate">
                    {item.bookTitle}
                  </h4>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 font-bold border border-indigo-800/50">
                    Hal {item.startPage} - {item.endPage} ({item.totalPages} Halaman)
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {item.durationMinutes} Menit
                  </span>
                  <span className="text-slate-500">{item.timestamp}</span>
                </div>

                {item.notes && (
                  <p className="text-xs text-slate-300 bg-slate-800/80 p-2 rounded-lg border border-slate-700/50 mt-1 italic">
                    "{item.notes}"
                  </p>
                )}
              </div>

              <button
                onClick={() => onDeleteReading(item.id)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Hapus"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
