import { PrayerDefinition } from '../types';

export interface Surah {
  number: number;
  name: string;
  transliteration: string;
  totalAyah: number;
  totalPages: number;
}

export const SURAH_LIST: Surah[] = [
  { number: 1, name: 'الفاتحة', transliteration: 'Al-Fatihah', totalAyah: 7, totalPages: 1 },
  { number: 2, name: 'البقرة', transliteration: 'Al-Baqarah', totalAyah: 286, totalPages: 48 },
  { number: 3, name: 'آل عمران', transliteration: 'Ali \'Imran', totalAyah: 200, totalPages: 27 },
  { number: 4, name: 'النساء', transliteration: 'An-Nisa\'', totalAyah: 176, totalPages: 29 },
  { number: 5, name: 'المائدة', transliteration: 'Al-Ma\'idah', totalAyah: 120, totalPages: 22 },
  { number: 6, name: 'الأنعام', transliteration: 'Al-An\'am', totalAyah: 165, totalPages: 23 },
  { number: 7, name: 'الأعراف', transliteration: 'Al-A\'raf', totalAyah: 206, totalPages: 26 },
  { number: 8, name: 'الأنفال', transliteration: 'Al-Anfal', totalAyah: 75, totalPages: 10 },
  { number: 9, name: 'التوبة', transliteration: 'At-Taubah', totalAyah: 129, totalPages: 21 },
  { number: 10, name: 'يونس', transliteration: 'Yunus', totalAyah: 109, totalPages: 13 },
  { number: 11, name: 'هود', transliteration: 'Hud', totalAyah: 123, totalPages: 13 },
  { number: 12, name: 'يوسف', transliteration: 'Yusuf', totalAyah: 111, totalPages: 14 },
  { number: 13, name: 'الرعد', transliteration: 'Ar-Ra\'d', totalAyah: 43, totalPages: 6 },
  { number: 14, name: 'إبراهيم', transliteration: 'Ibrahim', totalAyah: 52, totalPages: 7 },
  { number: 15, name: 'الحجر', transliteration: 'Al-Hijr', totalAyah: 99, totalPages: 6 },
  { number: 16, name: 'النحل', transliteration: 'An-Nahl', totalAyah: 128, totalPages: 14 },
  { number: 17, name: 'الإسراء', transliteration: 'Al-Isra\'', totalAyah: 111, totalPages: 12 },
  { number: 18, name: 'الكهف', transliteration: 'Al-Kahf', totalAyah: 110, totalPages: 12 },
  { number: 19, name: 'مريم', transliteration: 'Maryam', totalAyah: 98, totalPages: 8 },
  { number: 20, name: 'طه', transliteration: 'Taha', totalAyah: 135, totalPages: 10 },
  { number: 21, name: 'الأنياء', transliteration: 'Al-Anbiya\'', totalAyah: 112, totalPages: 10 },
  { number: 22, name: 'الحج', transliteration: 'Al-Hajj', totalAyah: 78, totalPages: 10 },
  { number: 23, name: 'المؤمنون', transliteration: 'Al-Mu\'minun', totalAyah: 118, totalPages: 8 },
  { number: 24, name: 'النور', transliteration: 'An-Nur', totalAyah: 64, totalPages: 10 },
  { number: 25, name: 'الفرقان', transliteration: 'Al-Furqan', totalAyah: 77, totalPages: 8 },
  { number: 26, name: 'الشعراء', transliteration: 'Asy-Syu\'ara\'', totalAyah: 227, totalPages: 11 },
  { number: 27, name: 'النمل', transliteration: 'An-Naml', totalAyah: 93, totalPages: 9 },
  { number: 28, name: 'القصص', transliteration: 'Al-Qasas', totalAyah: 88, totalPages: 11 },
  { number: 29, name: 'العنكبوت', transliteration: 'Al-\'Ankabut', totalAyah: 69, totalPages: 7 },
  { number: 30, name: 'الروم', transliteration: 'Ar-Rum', totalAyah: 60, totalPages: 7 },
  { number: 31, name: 'لقمان', transliteration: 'Luqman', totalAyah: 34, totalPages: 4 },
  { number: 32, name: 'السجدة', transliteration: 'As-Sajdah', totalAyah: 30, totalPages: 3 },
  { number: 33, name: 'الأحزاب', transliteration: 'Al-Ahzab', totalAyah: 73, totalPages: 10 },
  { number: 34, name: 'سبإ', transliteration: 'Saba\'', totalAyah: 54, totalPages: 7 },
  { number: 35, name: 'فاطر', transliteration: 'Fatir', totalAyah: 45, totalPages: 6 },
  { number: 36, name: 'يس', transliteration: 'Yasin', totalAyah: 83, totalPages: 6 },
  { number: 37, name: 'الصافات', transliteration: 'As-Saffat', totalAyah: 182, totalPages: 7 },
  { number: 38, name: 'ص', transliteration: 'Sad', totalAyah: 88, totalPages: 5 },
  { number: 39, name: 'الزمر', transliteration: 'Az-Zumar', totalAyah: 75, totalPages: 9 },
  { number: 40, name: 'غافر', transliteration: 'Ghafir', totalAyah: 85, totalPages: 9 },
  { number: 41, name: 'فصلت', transliteration: 'Fussilat', totalAyah: 54, totalPages: 6 },
  { number: 42, name: 'الشورى', transliteration: 'Asy-Syura', totalAyah: 53, totalPages: 6 },
  { number: 43, name: 'الزخرف', transliteration: 'Az-Zukhruf', totalAyah: 89, totalPages: 6 },
  { number: 44, name: 'الدخان', transliteration: 'Ad-Dukhan', totalAyah: 59, totalPages: 3 },
  { number: 45, name: 'الجاثية', transliteration: 'Al-Jasiyah', totalAyah: 37, totalPages: 4 },
  { number: 46, name: 'الأحقاف', transliteration: 'Al-Ahqaf', totalAyah: 35, totalPages: 4 },
  { number: 47, name: 'محمد', transliteration: 'Muhammad', totalAyah: 38, totalPages: 4 },
  { number: 48, name: 'الفتح', transliteration: 'Al-Fath', totalAyah: 29, totalPages: 5 },
  { number: 49, name: 'الحجرات', transliteration: 'Al-Hujurat', totalAyah: 18, totalPages: 3 },
  { number: 50, name: 'ق', transliteration: 'Qaf', totalAyah: 45, totalPages: 3 },
  { number: 51, name: 'الذاريات', transliteration: 'Az-Zariyat', totalAyah: 60, totalPages: 3 },
  { number: 52, name: 'الطور', transliteration: 'At-Tur', totalAyah: 49, totalPages: 3 },
  { number: 53, name: 'النجم', transliteration: 'An-Najm', totalAyah: 62, totalPages: 3 },
  { number: 54, name: 'القمر', transliteration: 'Al-Qamar', totalAyah: 55, totalPages: 3 },
  { number: 55, name: 'الرحمن', transliteration: 'Ar-Rahman', totalAyah: 78, totalPages: 3 },
  { number: 56, name: 'الواقعة', transliteration: 'Al-Waqi\'ah', totalAyah: 96, totalPages: 3 },
  { number: 57, name: 'الحديد', transliteration: 'Al-Hadid', totalAyah: 29, totalPages: 5 },
  { number: 58, name: 'المجادلة', transliteration: 'Al-Mujadilah', totalAyah: 22, totalPages: 4 },
  { number: 59, name: 'الحشر', transliteration: 'Al-Haysr', totalAyah: 24, totalPages: 3 },
  { number: 60, name: 'الممتحنة', transliteration: 'Al-Mumtahanah', totalAyah: 13, totalPages: 3 },
  { number: 61, name: 'الصف', transliteration: 'As-Saff', totalAyah: 14, totalPages: 2 },
  { number: 62, name: 'الجمعة', transliteration: 'Al-Jumu\'ah', totalAyah: 11, totalPages: 2 },
  { number: 63, name: 'المنافقون', transliteration: 'Al-Munafiqun', totalAyah: 11, totalPages: 2 },
  { number: 64, name: 'التغابن', transliteration: 'At-Taghabun', totalAyah: 18, totalPages: 2 },
  { number: 65, name: 'الطلاق', transliteration: 'At-Talaq', totalAyah: 12, totalPages: 2 },
  { number: 66, name: 'التحريم', transliteration: 'At-Tahrim', totalAyah: 12, totalPages: 2 },
  { number: 67, name: 'الملك', transliteration: 'Al-Mulk', totalAyah: 30, totalPages: 2 },
  { number: 68, name: 'القلم', transliteration: 'Al-Qalam', totalAyah: 52, totalPages: 2 },
  { number: 69, name: 'الحاقة', transliteration: 'Al-Haqqah', totalAyah: 52, totalPages: 2 },
  { number: 70, name: 'المعارج', transliteration: 'Al-Ma\'arij', totalAyah: 44, totalPages: 2 },
  { number: 71, name: 'نوح', transliteration: 'Nuh', totalAyah: 28, totalPages: 2 },
  { number: 72, name: 'الجن', transliteration: 'Al-Jinn', totalAyah: 28, totalPages: 2 },
  { number: 73, name: 'المزمل', transliteration: 'Al-Muzzammil', totalAyah: 20, totalPages: 2 },
  { number: 74, name: 'المدثر', transliteration: 'Al-Muddassir', totalAyah: 56, totalPages: 2 },
  { number: 75, name: 'القيامة', transliteration: 'Al-Qiyamah', totalAyah: 40, totalPages: 2 },
  { number: 76, name: 'الإنسان', transliteration: 'Al-Insan', totalAyah: 31, totalPages: 2 },
  { number: 77, name: 'المرسلات', transliteration: 'Al-Mursalat', totalAyah: 50, totalPages: 2 },
  { number: 78, name: 'النبإ', transliteration: 'An-Naba\'', totalAyah: 40, totalPages: 2 },
  { number: 79, name: 'النازعات', transliteration: 'An-Nazi\'at', totalAyah: 46, totalPages: 2 },
  { number: 80, name: 'عبس', transliteration: '\'Abasa', totalAyah: 42, totalPages: 1 },
  { number: 81, name: 'التكوير', transliteration: 'At-Takwir', totalAyah: 29, totalPages: 1 },
  { number: 82, name: 'الإنفطار', transliteration: 'Al-Infitar', totalAyah: 19, totalPages: 1 },
  { number: 83, name: 'المطففين', transliteration: 'Al-Mutaffifin', totalAyah: 36, totalPages: 2 },
  { number: 84, name: 'الإنشقاق', transliteration: 'Al-Insyiqaq', totalAyah: 25, totalPages: 1 },
  { number: 85, name: 'البروج', transliteration: 'Al-Buruj', totalAyah: 22, totalPages: 1 },
  { number: 86, name: 'الطارق', transliteration: 'At-Tariq', totalAyah: 17, totalPages: 1 },
  { number: 87, name: 'الأعلى', transliteration: 'Al-A\'la', totalAyah: 19, totalPages: 1 },
  { number: 88, name: 'الغاشية', transliteration: 'Al-Ghasyiyah', totalAyah: 26, totalPages: 1 },
  { number: 89, name: 'الفجر', transliteration: 'Al-Fajr', totalAyah: 30, totalPages: 2 },
  { number: 90, name: 'البلد', transliteration: 'Al-Balad', totalAyah: 20, totalPages: 1 },
  { number: 91, name: 'الشمس', transliteration: 'Asy-Syams', totalAyah: 15, totalPages: 1 },
  { number: 92, name: 'الليل', transliteration: 'Al-Lail', totalAyah: 21, totalPages: 1 },
  { number: 93, name: 'الضحى', transliteration: 'Ad-Duha', totalAyah: 11, totalPages: 1 },
  { number: 94, name: 'الشرح', transliteration: 'Asy-Syarh', totalAyah: 8, totalPages: 1 },
  { number: 95, name: 'التين', transliteration: 'At-Tin', totalAyah: 8, totalPages: 1 },
  { number: 96, name: 'العلق', transliteration: 'Al-\'Alaq', totalAyah: 19, totalPages: 1 },
  { number: 97, name: 'القدر', transliteration: 'Al-Qadr', totalAyah: 5, totalPages: 1 },
  { number: 98, name: 'البينة', transliteration: 'Al-Bayyinah', totalAyah: 8, totalPages: 1 },
  { number: 99, name: 'الزلزلة', transliteration: 'Az-Zalzalah', totalAyah: 8, totalPages: 1 },
  { number: 100, name: 'العاديات', transliteration: 'Al-\'Adiyat', totalAyah: 11, totalPages: 1 },
  { number: 101, name: 'القارعة', transliteration: 'Al-Qari\'ah', totalAyah: 11, totalPages: 1 },
  { number: 102, name: 'التكاثر', transliteration: 'At-Takasur', totalAyah: 8, totalPages: 1 },
  { number: 103, name: 'العصر', transliteration: 'Al-\'Asr', totalAyah: 3, totalPages: 1 },
  { number: 104, name: 'الهمزة', transliteration: 'Al-Humazah', totalAyah: 9, totalPages: 1 },
  { number: 105, name: 'الفيل', transliteration: 'Al-Fil', totalAyah: 5, totalPages: 1 },
  { number: 106, name: 'قريش', transliteration: 'Quraisy', totalAyah: 4, totalPages: 1 },
  { number: 107, name: 'الماعون', transliteration: 'Al-Ma\'un', totalAyah: 7, totalPages: 1 },
  { number: 108, name: 'الكوثر', transliteration: 'Al-Kausar', totalAyah: 3, totalPages: 1 },
  { number: 109, name: 'الكافرون', transliteration: 'Al-Kafirun', totalAyah: 6, totalPages: 1 },
  { number: 110, name: 'النصر', transliteration: 'An-Nasr', totalAyah: 3, totalPages: 1 },
  { number: 111, name: 'المسد', transliteration: 'Al-Masad', totalAyah: 5, totalPages: 1 },
  { number: 112, name: 'الإخلاص', transliteration: 'Al-Ikhlas', totalAyah: 4, totalPages: 1 },
  { number: 113, name: 'الفلق', transliteration: 'Al-Falaq', totalAyah: 5, totalPages: 1 },
  { number: 114, name: 'الناس', transliteration: 'An-Nas', totalAyah: 6, totalPages: 1 },
];

export const SUNNAH_PRAYERS: PrayerDefinition[] = [
  {
    id: 'tahajjud',
    label: 'Shalat Tahajjud',
    rakats: '2-11 Rakaat',
    timeLabel: 'Sepertiga Malam Terakhir (02:00 - Sebelum Subuh)',
    description: 'Shalat malam pembuka keberkahan & kedekatan dengan Allah',
    category: 'malam',
  },
  {
    id: 'qobliyah_subuh',
    label: 'Qobliyah Subuh (Fajar)',
    rakats: '2 Rakaat',
    timeLabel: 'Sebelum Shalat Subuh',
    description: 'Lebih baik dari dunia dan seisinya (HR. Muslim)',
    category: 'subuh',
  },
  {
    id: 'dhuha',
    label: 'Shalat Dhuha',
    rakats: '2-8 Rakaat',
    timeLabel: 'Pagi Hari (07:00 - 11:15)',
    description: 'Sedekah seluruh persendian tubuh & pembuka rezeki',
    category: 'zuhur',
  },
  {
    id: 'qobliyah_zuhur',
    label: 'Qobliyah Zuhur',
    rakats: '2 / 4 Rakaat',
    timeLabel: 'Sebelum Shalat Zuhur',
    description: 'Sunnah Muakkad pengiring shalat fardhu Zuhur',
    category: 'zuhur',
  },
  {
    id: 'badiyyah_zuhur',
    label: 'Ba\'diyyah Zuhur',
    rakats: '2 / 4 Rakaat',
    timeLabel: 'Setelah Shalat Zuhur',
    description: 'Penyempurna shalat fardhu Zuhur',
    category: 'zuhur',
  },
  {
    id: 'qobliyah_ashar',
    label: 'Qobliyah Ashar',
    rakats: '2 / 4 Rakaat',
    timeLabel: 'Sebelum Shalat Ashar',
    description: 'Mendapat rahmat Allah (HR. Tirmidzi)',
    category: 'ashar',
  },
  {
    id: 'qobliyah_maghrib',
    label: 'Qobliyah Maghrib',
    rakats: '2 Rakaat',
    timeLabel: 'Sebelum Shalat Maghrib',
    description: 'Sunnah Ghairu Muakkad antara adzan & iqamah',
    category: 'maghrib',
  },
  {
    id: 'badiyyah_maghrib',
    label: 'Ba\'diyyah Maghrib',
    rakats: '2 Rakaat',
    timeLabel: 'Setelah Shalat Maghrib',
    description: 'Sunnah Muakkad penyempurna Maghrib',
    category: 'maghrib',
  },
  {
    id: 'qobliyah_isya',
    label: 'Qobliyah Isya',
    rakats: '2 Rakaat',
    timeLabel: 'Sebelum Shalat Isya',
    description: 'Shalat sunnah antara adzan dan iqamah Isya',
    category: 'isya',
  },
  {
    id: 'badiyyah_isya',
    label: 'Ba\'diyyah Isya',
    rakats: '2 Rakaat',
    timeLabel: 'Setelah Shalat Isya',
    description: 'Sunnah Muakkad penutup rangkaian shalat harian',
    category: 'isya',
  },
  {
    id: 'witir',
    label: 'Shalat Witir',
    rakats: '1 / 3 Rakaat',
    timeLabel: 'Malam Hari (Setelah Isya s/d Sebelum Subuh)',
    description: 'Penutup shalat malam, dicintai oleh Allah (HR. Abu Dawud)',
    category: 'malam',
  },
];

/**
 * Calculates Juz information and page boundaries according to user rules:
 * - Juz 1: Pages 1 to 21 (21 pages)
 * - Juz 30: Pages 582 to 604 (23 pages)
 * - Juz 2-29: 20 pages each (e.g., Juz 2 = pages 22 to 41, Juz 3 = pages 42 to 61)
 */
export function getJuzForPage(page: number): { juz: number; startPage: number; endPage: number; targetPages: number } {
  const p = Math.max(1, Math.min(604, page));

  if (p <= 21) {
    return { juz: 1, startPage: 1, endPage: 21, targetPages: 21 };
  }
  if (p >= 582) {
    return { juz: 30, startPage: 582, endPage: 604, targetPages: 23 };
  }

  const offset = p - 22;
  const juzIndex = Math.floor(offset / 20);
  const juz = Math.min(29, Math.max(2, juzIndex + 2));
  const startPage = 22 + (juz - 2) * 20;
  const endPage = startPage + 19;
  return { juz, startPage, endPage, targetPages: 20 };
}

export const JUZ_SURAH_RANGES: Record<number, number[]> = {
  1: [1, 2],
  2: [2],
  3: [2, 3],
  4: [3, 4],
  5: [4],
  6: [4, 5],
  7: [5, 6],
  8: [6, 7],
  9: [7, 8],
  10: [8, 9],
  11: [9, 10, 11],
  12: [11, 12],
  13: [12, 13, 14],
  14: [15, 16],
  15: [17, 18],
  16: [18, 19, 20],
  17: [21, 22],
  18: [23, 24, 25],
  19: [25, 26, 27],
  20: [27, 28, 29],
  21: [29, 30, 31, 32, 33],
  22: [33, 34, 35, 36],
  23: [36, 37, 38, 39],
  24: [39, 40, 41],
  25: [41, 42, 43, 44, 45],
  26: [46, 47, 48, 49, 50, 51],
  27: [51, 52, 53, 54, 55, 56, 57],
  28: [58, 59, 60, 61, 62, 63, 64, 65, 66],
  29: [67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77],
  30: Array.from({ length: 37 }, (_, i) => 78 + i),
};

export function getSurahsForJuz(juzNumber: number): Surah[] {
  const surahNums = JUZ_SURAH_RANGES[juzNumber] || JUZ_SURAH_RANGES[30];
  return surahNums
    .map((num) => SURAH_LIST.find((s) => s.number === num))
    .filter((s): s is Surah => Boolean(s));
}

