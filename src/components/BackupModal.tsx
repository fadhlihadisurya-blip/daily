import React, { useRef } from 'react';
import { DailyLog, ReminderConfig } from '../types';
import { Download, Upload, RotateCcw, X, FileJson, CheckCircle2 } from 'lucide-react';
import { exportDataAsJSON } from '../utils/storage';
import { generateSamplePastLogs } from '../data/initialData';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  allLogs: Record<string, DailyLog>;
  reminders: ReminderConfig[];
  onImportLogs: (logs: Record<string, DailyLog>) => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  allLogs,
  reminders,
  onImportLogs,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    exportDataAsJSON(allLogs, reminders);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.logs) {
          onImportLogs(json.logs);
          alert('✅ Data berhasil diimpor!');
          onClose();
        } else {
          alert('Format file JSON tidak sesuai.');
        }
      } catch (err) {
        alert('Gagal membaca file JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handlePreloadDemo = () => {
    if (confirm('Preload data sampel histori 14 hari terakhir untuk mengisi grafik?')) {
      const demo = generateSamplePastLogs();
      onImportLogs(demo);
      alert('✅ Data sampel berhasil dimuat!');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200">
              <FileJson className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Pengaturan Data & Backup
              </h3>
              <p className="text-xs text-slate-400">
                Ekspor data ke file JSON atau impor data antar HP/Komputer
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

        {/* Options */}
        <div className="space-y-3 pt-2">
          {/* Export JSON */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-100">
                Ekspor Cadangan Data (JSON)
              </h4>
              <p className="text-[11px] text-slate-400">
                Unduh file cadangan seluruh jurnal aktivitas & pengingat
              </p>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Unduh JSON</span>
            </button>
          </div>

          {/* Import JSON */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-100">
                Impor Data Cadangan (JSON)
              </h4>
              <p className="text-[11px] text-slate-400">
                Pulihkan data jurnal dari file JSON yang telah diunduh
              </p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs shadow-md shadow-indigo-500/20 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Impor File</span>
            </button>
          </div>

          {/* Preload Demo */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-100">
                Muat Data Sampel Histori
              </h4>
              <p className="text-[11px] text-slate-400">
                Isi histori 14 hari terakhir untuk melihat tampilan grafik lengkap
              </p>
            </div>
            <button
              onClick={handlePreloadDemo}
              className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-xs border border-slate-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Muat Sampel</span>
            </button>
          </div>
        </div>

        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
