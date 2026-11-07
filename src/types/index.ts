export type PrayerKey =
  | 'tahajjud'
  | 'qobliyah_subuh'
  | 'dhuha'
  | 'qobliyah_zuhur'
  | 'badiyyah_zuhur'
  | 'qobliyah_ashar'
  | 'qobliyah_maghrib'
  | 'badiyyah_maghrib'
  | 'qobliyah_isya'
  | 'badiyyah_isya'
  | 'witir';

export interface PrayerDefinition {
  id: PrayerKey;
  label: string;
  rakats: string;
  timeLabel: string;
  description: string;
  category: 'malam' | 'subuh' | 'zuhur' | 'ashar' | 'maghrib' | 'isya';
}

export interface ReadingItem {
  id: string;
  bookTitle: string;
  startPage: number;
  endPage: number;
  totalPages: number;
  durationMinutes: number;
  notes?: string;
  timestamp: string;
}

export interface MurajaahLog {
  mode: 'surah' | 'halaman' | 'juz';
  surahNumber?: number;
  surahName?: string;
  selectedSurahNumbers?: number[];
  completedSurahNumbers?: number[];
  startPage?: number;
  endPage?: number;
  juzNumber?: number;
  completedPages: number;
  targetPages: number;
  completed: boolean;
  notes?: string;
}

export interface ExerciseSet {
  id: string;
  setNumber: number;
  reps: number;
}

export interface ExerciseLog {
  id: string;
  type: 'push_up' | 'pull_up' | 'squat' | 'plank' | 'custom';
  title: string;
  sets: ExerciseSet[];
  totalReps: number;
  unit: 'reps' | 'detik';
  notes?: string;
}

export interface TilawahLog {
  startPage: number;
  endPage: number;
  totalPages: number;
  currentJuz: number;
  targetPages: number;
  completed: boolean;
  notes?: string;
}

export type WakeUpOption = 'bangun_sendiri' | 'dibangunkan' | 'terlambat';

export interface DailyLog {
  date: string; // YYYY-MM-DD
  wakeUpState?: WakeUpOption;
  wakeUpTime?: string;
  prayers: Record<PrayerKey, boolean>;
  prayerNotes?: Partial<Record<PrayerKey, string>>;
  readings: ReadingItem[];
  murajaah: MurajaahLog;
  tilawah?: TilawahLog;
  exercises: ExerciseLog[];
  dailyNote?: string;
  mood?: 'happy' | 'neutral' | 'tired' | 'peaceful' | 'motivated';
  updatedAt: string;
}

export interface ReminderConfig {
  id: string;
  title: string;
  time: string; // HH:mm
  enabled: boolean;
  category: 'shalat' | 'murajaah' | 'buku' | 'olahraga' | 'lainnya';
  days: number[]; // 0 = Sun, 1 = Mon, ..., 6 = Sat. Empty array = every day.
  sound: boolean;
}

export type ActiveTab = 'beranda' | 'progres' | 'surat_quran' | 'pengaturan';
