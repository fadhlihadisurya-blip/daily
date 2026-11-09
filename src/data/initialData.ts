import { DailyLog, ReminderConfig, PrayerKey } from '../types';

export const DEFAULT_PRAYER_STATE: Record<PrayerKey, boolean> = {
  tahajjud: false,
  qobliyah_subuh: false,
  dhuha: false,
  qobliyah_zuhur: false,
  badiyyah_zuhur: false,
  badiyyah_maghrib: false,
  badiyyah_isya: false,
  witir: false,
};

export const DEFAULT_REMINDERS: ReminderConfig[] = [
  {
    id: 'rem_tahajjud',
    title: '⏰ Shalat Tahajjud & Istighfar Sahur',
    time: '03:30',
    enabled: true,
    category: 'shalat',
    days: [],
    sound: true,
  },
  {
    id: 'rem_qobliyah_subuh',
    title: '🌅 Qobliyah Subuh (Dua Rakaat Fajar)',
    time: '04:30',
    enabled: true,
    category: 'shalat',
    days: [],
    sound: true,
  },
  {
    id: 'rem_dhuha',
    title: '☀️ Shalat Dhuha & Zikir Pagi',
    time: '07:30',
    enabled: true,
    category: 'shalat',
    days: [],
    sound: true,
  },
  {
    id: 'rem_murajaah',
    title: '📖 Murajaah Al-Qur\'an Daily Target',
    time: '16:00',
    enabled: true,
    category: 'murajaah',
    days: [],
    sound: true,
  },
  {
    id: 'rem_olahraga',
    title: '💪 Olahraga Routine (Push-Up & Pull-Up)',
    time: '17:15',
    enabled: true,
    category: 'olahraga',
    days: [],
    sound: true,
  },
  {
    id: 'rem_buku',
    title: '📚 Membaca Buku Sebelum Tidur',
    time: '21:00',
    enabled: true,
    category: 'buku',
    days: [],
    sound: true,
  },
];

export function getTodayDateStr(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function generateSamplePastLogs(): Record<string, DailyLog> {
  const logs: Record<string, DailyLog> = {};
  const today = new Date();

  // Create 14 days of realistic historical logs for impressive charts
  for (let i = 14; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    const isToday = i === 0;

    logs[dateStr] = {
      date: dateStr,
      prayers: {
        tahajjud: Math.random() > 0.3,
        qobliyah_subuh: Math.random() > 0.1,
        dhuha: Math.random() > 0.2,
        qobliyah_zuhur: Math.random() > 0.3,
        badiyyah_zuhur: Math.random() > 0.2,
        badiyyah_maghrib: Math.random() > 0.2,
        badiyyah_isya: Math.random() > 0.2,
        witir: Math.random() > 0.3,
      },
      readings: [
        {
          id: `read_${dateStr}_1`,
          bookTitle: 'Atomic Habits (James Clear)',
          startPage: 10 + i * 8,
          endPage: 25 + i * 8,
          totalPages: 15 + (i % 5),
          durationMinutes: 25 + (i % 10),
          notes: 'Membangun kebiasaan kecil 1% lebih baik setiap hari.',
          timestamp: '20:30',
        },
      ],
      murajaah: {
        mode: 'surah',
        surahNumber: 67,
        surahName: 'Al-Mulk',
        completedPages: 3 + (i % 3),
        targetPages: 4,
        completed: true,
        notes: 'Ulangi ayat 1-15 hingga lancar.',
      },
      exercises: [
        {
          id: `ex_push_${dateStr}`,
          type: 'push_up',
          title: 'Push-Up Standard',
          unit: 'reps',
          totalReps: 45 + (i % 4) * 10,
          sets: [
            { id: 's1', setNumber: 1, reps: 20 },
            { id: 's2', setNumber: 2, reps: 15 },
            { id: 's3', setNumber: 3, reps: 10 + (i % 4) * 10 },
          ],
          notes: 'Form bersih, dada sentuh lantai.',
        },
        {
          id: `ex_pull_${dateStr}`,
          type: 'pull_up',
          title: 'Pull-Up Wide Grip',
          unit: 'reps',
          totalReps: 18 + (i % 3) * 5,
          sets: [
            { id: 'p1', setNumber: 1, reps: 8 },
            { id: 'p2', setNumber: 2, reps: 6 },
            { id: 'p3', setNumber: 3, reps: 4 + (i % 3) * 5 },
          ],
        },
        {
          id: `ex_plank_${dateStr}`,
          type: 'plank',
          title: 'Plank Core',
          unit: 'reps',
          totalReps: 3 + (i % 3),
          sets: [
            { id: 'pl1', setNumber: 1, reps: 2 },
            { id: 'pl2', setNumber: 2, reps: 1 + (i % 3) },
          ],
        },
      ],
      dailyNote: isToday
        ? 'Alhamdulillah hari ini aktivitas berjalan produktif dan tenang.'
        : 'Hari yang luar biasa, istiqomah terus.',
      mood: 'motivated',
      updatedAt: new Date().toISOString(),
    };
  }

  return logs;
}
