import { DailyLog, ReminderConfig, PrayerKey } from '../types';
import {
  DEFAULT_PRAYER_STATE,
  DEFAULT_REMINDERS,
  generateSamplePastLogs,
  getTodayDateStr,
} from '../data/initialData';
import { SUNNAH_PRAYERS, getJuzForPage } from '../data/quranData';

const STORAGE_LOGS_KEY = 'daily_routine_logs_v1';
const STORAGE_REMINDERS_KEY = 'daily_routine_reminders_v1';

export function loadAllLogs(): Record<string, DailyLog> {
  try {
    const raw = localStorage.getItem(STORAGE_LOGS_KEY);
    if (!raw) {
      const sample = generateSamplePastLogs();
      localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(sample));
      return sample;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse logs from LocalStorage', e);
    return generateSamplePastLogs();
  }
}

export function saveAllLogs(logs: Record<string, DailyLog>) {
  try {
    localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save logs to LocalStorage', e);
  }
}

export function getOrCreateDailyLog(
  dateStr: string,
  allLogs: Record<string, DailyLog>
): DailyLog {
  if (allLogs[dateStr]) {
    return allLogs[dateStr];
  }

  // Calculate yesterday's date to auto-fill tilawah start page
  const curDate = new Date(dateStr + 'T00:00:00');
  const prevDate = new Date(curDate);
  prevDate.setDate(prevDate.getDate() - 1);
  const prevDateStr = prevDate.toISOString().split('T')[0];

  const prevLog = allLogs[prevDateStr];
  let defaultStartPage = 1;

  if (prevLog && prevLog.tilawah && prevLog.tilawah.endPage) {
    defaultStartPage = prevLog.tilawah.endPage + 1;
    if (defaultStartPage > 604) defaultStartPage = 1;
  }

  const juzInfo = getJuzForPage(defaultStartPage);
  const defaultEndPage = juzInfo.endPage;
  const defaultTotalPages = Math.max(1, defaultEndPage - defaultStartPage + 1);

  const newLog: DailyLog = {
    date: dateStr,
    prayers: { ...DEFAULT_PRAYER_STATE },
    prayerNotes: {},
    readings: [],
    murajaah: {
      mode: 'surah',
      surahNumber: 67,
      surahName: 'Al-Mulk',
      completedPages: 0,
      targetPages: 4,
      completed: false,
    },
    tilawah: {
      startPage: defaultStartPage,
      endPage: defaultEndPage,
      totalPages: defaultTotalPages,
      currentJuz: juzInfo.juz,
      targetPages: juzInfo.targetPages,
      completed: true,
    },
    exercises: [
      {
        id: `ex_push_${dateStr}`,
        type: 'push_up',
        title: 'Push-Up',
        unit: 'reps',
        totalReps: 0,
        sets: [],
      },
      {
        id: `ex_pull_${dateStr}`,
        type: 'pull_up',
        title: 'Pull-Up',
        unit: 'reps',
        totalReps: 0,
        sets: [],
      },
      {
        id: `ex_plank_${dateStr}`,
        type: 'plank',
        title: 'Plank',
        unit: 'reps',
        totalReps: 0,
        sets: [],
      },
    ],
    dailyNote: '',
    mood: 'motivated',
    updatedAt: new Date().toISOString(),
  };

  return newLog;
}

export function loadReminders(): ReminderConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_REMINDERS_KEY);
    if (!raw) {
      localStorage.setItem(
        STORAGE_REMINDERS_KEY,
        JSON.stringify(DEFAULT_REMINDERS)
      );
      return DEFAULT_REMINDERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_REMINDERS;
  }
}

export function saveReminders(reminders: ReminderConfig[]) {
  try {
    localStorage.setItem(STORAGE_REMINDERS_KEY, JSON.stringify(reminders));
  } catch (e) {
    console.error('Failed to save reminders', e);
  }
}

// Stats & Analytics calculation helpers
export function calculateStreak(allLogs: Record<string, DailyLog>): {
  currentStreak: number;
  bestStreak: number;
} {
  const dates = Object.keys(allLogs).sort().reverse();
  if (dates.length === 0) return { currentStreak: 0, bestStreak: 0 };

  let current = 0;
  let maxStreak = 0;
  let tempStreak = 0;

  const today = getTodayDateStr();
  let checkDate = new Date();

  // Check from today or yesterday backward
  for (let i = 0; i < 60; i++) {
    const dateStr = checkDate.toISOString().split('T')[0];
    const log = allLogs[dateStr];

    if (log) {
      const prayersDone = Object.values(log.prayers).filter(Boolean).length;
      const readingDone = log.readings.length > 0 && log.readings.some((r) => r.totalPages > 0);
      const murajaahDone = log.murajaah.completedPages > 0;
      const exerciseDone = log.exercises.some((e) => e.totalReps > 0);

      // A day is active if at least 2 categories had progress
      const totalActiveCategories =
        (prayersDone > 0 ? 1 : 0) +
        (readingDone ? 1 : 0) +
        (murajaahDone ? 1 : 0) +
        (exerciseDone ? 1 : 0);

      if (totalActiveCategories >= 2) {
        tempStreak++;
        if (i === 0 || i === 1) current = tempStreak;
        if (tempStreak > maxStreak) maxStreak = tempStreak;
      } else {
        if (i > 1 && current > 0) break;
        tempStreak = 0;
      }
    } else {
      if (i > 1 && current > 0) break;
      tempStreak = 0;
    }

    checkDate.setDate(checkDate.getDate() - 1);
  }

  return {
    currentStreak: current || 1,
    bestStreak: Math.max(maxStreak, current, 1),
  };
}

export function getSummaryForDate(log: DailyLog) {
  const totalPrayersCount = SUNNAH_PRAYERS.length; // 11
  const completedPrayersCount = Object.values(log.prayers).filter(Boolean).length;
  const prayerPercentage = Math.round((completedPrayersCount / totalPrayersCount) * 100);

  const readingTotalPages = log.readings.reduce((sum, r) => sum + r.totalPages, 0);

  const murajaahPages = log.murajaah.completedPages || 0;

  const pushupTotal =
    log.exercises.find((e) => e.type === 'push_up')?.totalReps || 0;
  const pullupTotal =
    log.exercises.find((e) => e.type === 'pull_up')?.totalReps || 0;

  return {
    totalPrayersCount,
    completedPrayersCount,
    prayerPercentage,
    readingTotalPages,
    murajaahPages,
    pushupTotal,
    pullupTotal,
  };
}

export function exportDataAsJSON(allLogs: Record<string, DailyLog>, reminders: ReminderConfig[]) {
  const data = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    logs: allLogs,
    reminders,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `daily-mutabaah-backup-${getTodayDateStr()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
