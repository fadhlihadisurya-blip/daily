import React, { useState } from 'react';
import { DailyLog } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  Calendar,
  Award,
  CheckCircle2,
  BookOpen,
  BookMarked,
  Dumbbell,
  Sparkles,
  AlarmClock,
  BellRing,
  AlertTriangle,
} from 'lucide-react';

interface AnalyticsViewProps {
  allLogs: Record<string, DailyLog>;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ allLogs }) => {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');

  const daysCount = period === 'weekly' ? 7 : 30;

  // Generate chart data array sorted chronologically
  const chartData = Array.from({ length: daysCount })
    .map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (daysCount - 1 - i));
      const dateStr = d.toISOString().split('T')[0];
      const log = allLogs[dateStr];

      const shortLabel = d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
      });

      const prayersDone = log
        ? Object.values(log.prayers).filter(Boolean).length
        : 0;

      const readingPages = log
        ? log.readings.reduce((sum, r) => sum + r.totalPages, 0)
        : 0;

      const murajaahPages = log?.murajaah?.completedPages || 0;
      const tilawahPages = log?.tilawah?.totalPages || 0;

      const pushups =
        log?.exercises?.find((e) => e.type === 'push_up')?.totalReps || 0;

      const pullups =
        log?.exercises?.find((e) => e.type === 'pull_up')?.totalReps || 0;

      const rawPrayers = log ? log.prayers : null;
      const tahajjud = rawPrayers?.tahajjud ? 1 : 0;
      const dhuha = rawPrayers?.dhuha ? 1 : 0;
      const witir = rawPrayers?.witir ? 1 : 0;
      const rawatib = rawPrayers
        ? [
            'qobliyah_subuh',
            'qobliyah_zuhur',
            'badiyyah_zuhur',
            'qobliyah_ashar',
            'qobliyah_maghrib',
            'badiyyah_maghrib',
            'qobliyah_isya',
            'badiyyah_isya',
          ].filter((k) => rawPrayers[k as keyof typeof rawPrayers]).length
        : 0;

      return {
        dateStr,
        label: shortLabel,
        prayers: prayersDone,
        tahajjud,
        dhuha,
        rawatib,
        witir,
        reading: readingPages,
        murajaah: murajaahPages,
        tilawah: tilawahPages,
        pushups,
        pullups,
        totalExercise: pushups + pullups,
      };
    });

  // Calculate Aggregates
  const totalPrayersCount = chartData.reduce((sum, d) => sum + d.prayers, 0);
  const totalTahajjud = chartData.reduce((sum, d) => sum + d.tahajjud, 0);
  const totalDhuha = chartData.reduce((sum, d) => sum + d.dhuha, 0);
  const totalRawatib = chartData.reduce((sum, d) => sum + d.rawatib, 0);
  const totalWitir = chartData.reduce((sum, d) => sum + d.witir, 0);

  const avgPrayerPercentage = Math.round(
    (totalPrayersCount / (daysCount * 11)) * 100
  );

  const totalReadingPages = chartData.reduce((sum, d) => sum + d.reading, 0);
  const totalMurajaahPages = chartData.reduce((sum, d) => sum + d.murajaah, 0);
  const totalTilawahPages = chartData.reduce((sum, d) => sum + d.tilawah, 0);
  const totalPushups = chartData.reduce((sum, d) => sum + d.pushups, 0);
  const totalPullups = chartData.reduce((sum, d) => sum + d.pullups, 0);

  const pushupDaysCount = chartData.filter((d) => d.pushups > 0).length;
  const pullupDaysCount = chartData.filter((d) => d.pullups > 0).length;

  const totalMurajaahSurahsCount = chartData.reduce((sum, d) => {
    const log = allLogs[d.dateStr];
    if (!log?.murajaah) return sum;
    const m = log.murajaah;
    if (m.completedSurahNumbers && m.completedSurahNumbers.length > 0) {
      return sum + m.completedSurahNumbers.length;
    }
    if (m.selectedSurahNumbers && m.selectedSurahNumbers.length > 0 && m.completedPages > 0) {
      return sum + m.selectedSurahNumbers.length;
    }
    if (m.surahNumber && m.completedPages > 0) {
      return sum + 1;
    }
    return sum;
  }, 0);

  // Wake Up State Calculations
  const wakeUpSelfCount = chartData.filter((d) => {
    const log = allLogs[d.dateStr];
    return log?.wakeUpState === 'bangun_sendiri';
  }).length;

  const wakeUpWokenCount = chartData.filter((d) => {
    const log = allLogs[d.dateStr];
    return log?.wakeUpState === 'dibangunkan';
  }).length;

  const wakeUpLateCount = chartData.filter((d) => {
    const log = allLogs[d.dateStr];
    return log?.wakeUpState === 'terlambat';
  }).length;

  return (
    <div className="space-y-6">
      {/* Header & Period Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 shadow-xl">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Grafik Progres & Analisis Aktivitas
          </h2>
          <p className="text-xs text-slate-400">
            Laporan tren konsistensi Shalat Sunnah, Membaca, Murajaah & Olahraga
          </p>
        </div>

        {/* Toggle Weekly vs Monthly */}
        <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setPeriod('weekly')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              period === 'weekly'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            7 Hari Terakhir (Mingguan)
          </button>
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              period === 'monthly'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            30 Hari Terakhir (Bulanan)
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-semibold uppercase">
              Total Tilawah Al-Qur'an
            </div>
            <div className="text-lg font-black text-slate-100">
              {totalTilawahPages} <span className="text-xs text-cyan-400 font-normal">Halaman</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-semibold uppercase">
              Total Membaca Buku
            </div>
            <div className="text-lg font-black text-slate-100">
              {totalReadingPages} <span className="text-xs text-indigo-400 font-normal">Halaman</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <BookMarked className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-semibold uppercase">
              Total Murajaah Qur'an
            </div>
            <div className="text-base sm:text-lg font-black text-slate-100">
              {totalMurajaahPages} <span className="text-xs text-amber-400 font-normal">Halaman</span>
              <span className="text-xs text-slate-300 font-normal ml-1.5">({totalMurajaahSurahsCount} Surat)</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-semibold uppercase">
              Konsistensi Olahraga
            </div>
            <div className="text-base sm:text-lg font-black text-slate-100">
              Push-up {pushupDaysCount} Hari <span className="text-xs text-rose-400 font-normal">/ Pull-up {pullupDaysCount} Hari</span>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluasi Rutinitas Bangun Tidur */}
      <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700/50 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <AlarmClock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Evaluasi Rutinitas Bangun Tidur ({period === 'weekly' ? '7 Hari Terakhir (Mingguan)' : '30 Hari Terakhir (Bulanan)'})
              </h3>
              <p className="text-xs text-slate-400">
                Frekuensi Bangun Sendiri, Dibangunkan, & Terlambat Bangun
              </p>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
            {wakeUpSelfCount + wakeUpWokenCount + wakeUpLateCount} / {daysCount} Hari Tercatat
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card Bangun Sendiri */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 flex items-center space-x-3.5">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0">
              <AlarmClock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                Bangun Sendiri (&lt; Jam 4)
              </div>
              <div className="text-xl font-black text-emerald-400 mt-0.5">
                {wakeUpSelfCount} <span className="text-xs text-slate-400 font-normal">Hari</span>
              </div>
            </div>
          </div>

          {/* Card Dibangunkan */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 flex items-center space-x-3.5">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 shrink-0">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                Dibangunkan (&lt; Jam 4)
              </div>
              <div className="text-xl font-black text-indigo-400 mt-0.5">
                {wakeUpWokenCount} <span className="text-xs text-slate-400 font-normal">Hari</span>
              </div>
            </div>
          </div>

          {/* Card Terlambat */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 flex items-center space-x-3.5">
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                Terlambat Bangun
              </div>
              <div className="text-xl font-black text-rose-400 mt-0.5">
                {wakeUpLateCount} <span className="text-xs text-slate-400 font-normal">Hari</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rincian Shalat Sunnah (Tahajjud, Dhuha, Rawatib) Cards */}
      <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700/50 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Rincian Shalat Sunnah ({period === 'weekly' ? '7 Hari Terakhir (Mingguan)' : '30 Hari Terakhir (Bulanan)'})
              </h3>
              <p className="text-xs text-slate-400">
                Jumlah pelaksanaan Shalat Tahajjud, Dhuha, dan Rawatib
              </p>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            Total {totalPrayersCount} Shalat Sunnah
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card Tahajjud */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 flex items-center space-x-3.5">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-center shrink-0">
              <span className="text-xl">🌙</span>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                Jumlah Shalat Tahajjud
              </div>
              <div className="text-xl font-black text-indigo-400 mt-0.5">
                {totalTahajjud} <span className="text-xs text-slate-400 font-normal">Kali ({totalTahajjud}/{daysCount} Hari)</span>
              </div>
            </div>
          </div>

          {/* Card Dhuha */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 flex items-center space-x-3.5">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 text-center shrink-0">
              <span className="text-xl">☀️</span>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                Jumlah Shalat Dhuha
              </div>
              <div className="text-xl font-black text-amber-400 mt-0.5">
                {totalDhuha} <span className="text-xs text-slate-400 font-normal">Kali ({totalDhuha}/{daysCount} Hari)</span>
              </div>
            </div>
          </div>

          {/* Card Rawatib */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 flex items-center space-x-3.5">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-center shrink-0">
              <span className="text-xl">🕌</span>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                Jumlah Shalat Rawatib
              </div>
              <div className="text-xl font-black text-emerald-400 mt-0.5">
                {totalRawatib} <span className="text-xs text-slate-400 font-normal">Rawatib (Qobliyah/Ba'diyyah)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart 1: Shalat Sunnah Breakdown Bar Chart */}
      <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 shadow-xl">
        <h3 className="text-sm font-bold text-slate-100 mb-1 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          Grafik Komposisi Shalat Sunnah (Tahajjud, Dhuha, Rawatib & Witir)
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Perbandingan pelaksanaan Tahajjud, Dhuha, Rawatib (8 Shalat), dan Witir per hari
        </p>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} />
              <YAxis domain={[0, 11]} stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="tahajjud" name="Tahajjud" stackId="a" fill="#818cf8" />
              <Bar dataKey="dhuha" name="Dhuha" stackId="a" fill="#fbbf24" />
              <Bar dataKey="rawatib" name="Rawatib (Qobliyah/Ba'diyyah)" stackId="a" fill="#10b981" />
              <Bar dataKey="witir" name="Witir" stackId="a" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Reading & Murajaah Line Chart */}
      <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 shadow-xl">
        <h3 className="text-sm font-bold text-slate-100 mb-1 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
          Grafik Membaca Buku & Murajaah Al-Qur'an (Jumlah Halaman)
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Perbandingan akumulasi membaca literatur vs mengulang hafalan Qur'an
        </p>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="reading"
                name="Membaca Buku (Hal)"
                stroke="#818cf8"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="tilawah"
                name="Tilawah Qur'an (Hal)"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="murajaah"
                name="Murajaah Qur'an (Hal)"
                stroke="#fbbf24"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Push-Up vs Pull-Up Volume Stacked Bar Chart */}
      <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 shadow-xl">
        <h3 className="text-sm font-bold text-slate-100 mb-1 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
          Grafik Repetisi Olahraga (Push-Up & Pull-Up)
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Volume latihan fisik harian untuk menjaga kebugaran tubuh
        </p>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="pushups" name="Push-Up Reps" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pullups" name="Pull-Up Reps" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
