export interface StorySurah {
  number: number;
  keyword: string;
  name: string;
  arabicName?: string;
}

export interface StoryGroup {
  id: number;
  title: string;
  surahRange: string;
  narrative: string;
  surahs: StorySurah[];
}

export const QURAN_STORIES: StoryGroup[] = [
  {
    id: 1,
    title: 'Cerita I',
    surahRange: 'Surah 1 – 10',
    narrative:
      'Paman membaca AL FATIHAH sebelum memasak SAPI BETINA milik KELUARGA IMRAN yang punya anak wanita bernama AN NISA. Sebagian HIDANGAN itu diberikan untuk BINATANG TERNAK. Kemudian paman menuju TEMPAT-TEMPAT YANG TINGGI, untuk mencuri HARTA RAMPASAN PERANG. Namun akhirnya paman ber-TAUBAT seperti taubatnya Nabi YUNUS.',
    surahs: [
      { number: 1, keyword: 'AL-FATIHAH', name: 'Al-Fatihah', arabicName: 'الفاتحة' },
      { number: 2, keyword: 'SAPI BETINA', name: 'Al-Baqarah', arabicName: 'البقرة' },
      { number: 3, keyword: 'KELUARGA IMRAN', name: 'Ali Imran', arabicName: 'آل عمران' },
      { number: 4, keyword: 'AN NISA', name: 'An-Nisa\'', arabicName: 'النساء' },
      { number: 5, keyword: 'HIDANGAN', name: 'Al-Ma\'idah', arabicName: 'المائدة' },
      { number: 6, keyword: 'BINATANG TERNAK', name: 'Al-An\'am', arabicName: 'الأنعام' },
      { number: 7, keyword: 'TEMPAT-TEMPAT YANG TINGGI', name: 'Al-A\'raf', arabicName: 'الأعراف' },
      { number: 8, keyword: 'HARTA RAMPASAN PERANG', name: 'Al-Anfal', arabicName: 'الأنفال' },
      { number: 9, keyword: 'TAUBAT', name: 'At-Taubah', arabicName: 'التوبة' },
      { number: 10, keyword: 'YUNUS', name: 'Yunus', arabicName: 'يونس' },
    ],
  },
  {
    id: 2,
    title: 'Cerita II',
    surahRange: 'Surah 11 – 20',
    narrative:
      'HUD dan YUSUF melihat PETIR. Sementara itu IBRAHIM sedang berada di PEGUNUNGAN HIJR. Ia mencari LEBAH, untuk kemudian memulai PERJALANAN MALAM menuju ke GUA untuk menemui MARYAM dan TOHA.',
    surahs: [
      { number: 11, keyword: 'HUD', name: 'Hud', arabicName: 'هود' },
      { number: 12, keyword: 'YUSUF', name: 'Yusuf', arabicName: 'يوسف' },
      { number: 13, keyword: 'PETIR', name: 'Ar-Ra\'d', arabicName: 'الرعد' },
      { number: 14, keyword: 'IBRAHIM', name: 'Ibrahim', arabicName: 'إبراهيم' },
      { number: 15, keyword: 'PEGUNUNGAN HIJR', name: 'Al-Hijr', arabicName: 'الحجر' },
      { number: 16, keyword: 'LEBAH', name: 'An-Nahl', arabicName: 'النحل' },
      { number: 17, keyword: 'PERJALANAN MALAM', name: 'Al-Isra\'', arabicName: 'الإسراء' },
      { number: 18, keyword: 'GUA', name: 'Al-Kahf', arabicName: 'الكهف' },
      { number: 19, keyword: 'MARYAM', name: 'Maryam', arabicName: 'مريم' },
      { number: 20, keyword: 'TOHA', name: 'Taha', arabicName: 'طه' },
    ],
  },
  {
    id: 3,
    title: 'Cerita III',
    surahRange: 'Surah 21 – 30',
    narrative:
      'PARA NABI pergi HAJI diikuti oleh ORANG-ORANG BERIMAN. Mereka seperti CAHAYA. Inilah yang menjadi PEMBEDA ANTARA YANG BENAR DAN BATHIL. Sementara itu, PARA PENYAIR bercerita tentang SEMUT. Cerita itu terangkum dalam buku KISAH-KISAH. Dalam buku itu juga diceritakan tentang LABA-LABA yang menyerang BANGSA ROMAWI.',
    surahs: [
      { number: 21, keyword: 'PARA NABI', name: 'Al-Anbiya\'', arabicName: 'الأنبياء' },
      { number: 22, keyword: 'HAJI', name: 'Al-Hajj', arabicName: 'الحج' },
      { number: 23, keyword: 'ORANG-ORANG BERIMAN', name: 'Al-Mu\'minun', arabicName: 'المؤمنون' },
      { number: 24, keyword: 'CAHAYA', name: 'An-Nur', arabicName: 'النور' },
      { number: 25, keyword: 'PEMBEDA ANTARA YANG BENAR DAN BATHIL', name: 'Al-Furqan', arabicName: 'الفرقان' },
      { number: 26, keyword: 'PARA PENYAIR', name: 'Asy-Syu\'ara\'', arabicName: 'الشعراء' },
      { number: 27, keyword: 'SEMUT', name: 'An-Naml', arabicName: 'النمل' },
      { number: 28, keyword: 'KISAH-KISAH', name: 'Al-Qashash', arabicName: 'القصص' },
      { number: 29, keyword: 'LABA-LABA', name: 'Al-\'Ankabut', arabicName: 'العنكبوت' },
      { number: 30, keyword: 'BANGSA ROMAWI', name: 'Ar-Rum', arabicName: 'الروم' },
    ],
  },
  {
    id: 4,
    title: 'Cerita IV',
    surahRange: 'Surah 31 – 40',
    narrative:
      'LUKMAN tidak berSUJUD di kaum yang terkena AHZAB dan tidak juga kepada kaum SABA\'. Sementara itu FATHIR dan YASIN berdiri bersama orang YANG BERSHAF-SHAF dan membentuk huruf SHOD. Mereka termasuk ROMBONGAN-ROMBONGAN yang memohon ampunan kepada YANG MAHA PENGAMPUN.',
    surahs: [
      { number: 31, keyword: 'LUKMAN', name: 'Luqman', arabicName: 'لقمان' },
      { number: 32, keyword: 'SUJUD', name: 'As-Sajdah', arabicName: 'Sajdah' },
      { number: 33, keyword: 'AL AHZAB', name: 'Al-Ahzab', arabicName: 'الأحزاب' },
      { number: 34, keyword: 'SABA\'', name: 'Saba\'', arabicName: 'سبإ' },
      { number: 35, keyword: 'FATHIR', name: 'Fatir', arabicName: 'فاطر' },
      { number: 36, keyword: 'YASIN', name: 'Ya-Sin', arabicName: 'يس' },
      { number: 37, keyword: 'YANG BERSHAF-SHAF', name: 'Ash-Shatfat', arabicName: 'الصافات' },
      { number: 38, keyword: 'SHOD', name: 'Sad', arabicName: 'ص' },
      { number: 39, keyword: 'ROMBONGAN-ROMBONGAN', name: 'Az-Zumar', arabicName: 'الزمر' },
      { number: 40, keyword: 'YANG MAHA PENGAMPUN', name: 'Ghafir', arabicName: 'غافر' },
    ],
  },
  {
    id: 5,
    title: 'Cerita V',
    surahRange: 'Surah 41 – 50',
    narrative:
      'YANG DIJELASKAN dalam MUSYAWARAH itu adalah tentang PERHIASAN. Bukan tentang KABUT. Sementara itu banyak orang YANG BERLUTUT di BUKIT-BUKIT PASIR. Saat itulah MUHAMMAD mendapat KEMENANGAN. Hal ini ditandai dengan KAMAR-KAMAR bertuliskan huruf QOF.',
    surahs: [
      { number: 41, keyword: 'YANG DIJELASKAN', name: 'Fussilat', arabicName: 'فصلت' },
      { number: 42, keyword: 'MUSYAWARAH', name: 'Asy-Syura', arabicName: 'الشورى' },
      { number: 43, keyword: 'PERHIASAN', name: 'Az-Zukhruf', arabicName: 'الزخرف' },
      { number: 44, keyword: 'KABUT', name: 'Ad-Dukhan', arabicName: 'الدخان' },
      { number: 45, keyword: 'YANG BERLUTUT', name: 'Al-Jathiyah', arabicName: 'الجاثية' },
      { number: 46, keyword: 'BUKIT-BUKIT PASIR', name: 'Al-Ahqaf', arabicName: 'الأحقاف' },
      { number: 47, keyword: 'MUHAMMAD', name: 'Muhammad', arabicName: 'محمد' },
      { number: 48, keyword: 'KEMENANGAN', name: 'Al-Fath', arabicName: 'الفتح' },
      { number: 49, keyword: 'KAMAR-KAMAR', name: 'Al-Hujurat', arabicName: 'الحجرات' },
      { number: 50, keyword: 'QOF', name: 'Qaf', arabicName: 'ق' },
    ],
  },
  {
    id: 6,
    title: 'Cerita VI',
    surahRange: 'Surah 51 – 60',
    narrative:
      'ANGIN YANG MENERBANGKAN membawa awan ke bukit THURSINA. Ini terjadi saat BINTANG dan BULAN bersinar. Sementara itu pak RAHMAN sedang berceramah tentang HARI KIAMAT. Dimana BESI hancur, WANITA YANG MENGAJUKAN GUGATAN mengalami PENGUSIRAN, dan banyak PEREMPUAN YANG DIUJI.',
    surahs: [
      { number: 51, keyword: 'ANGIN YANG MENERBANGKAN', name: 'Adz-Dzariyat', arabicName: 'الذاريات' },
      { number: 52, keyword: 'THURSINA', name: 'At-Tur', arabicName: 'الطور' },
      { number: 53, keyword: 'BINTANG', name: 'An-Najm', arabicName: 'النجم' },
      { number: 54, keyword: 'BULAN', name: 'Al-Qamar', arabicName: 'القمر' },
      { number: 55, keyword: 'AR RAHMAN', name: 'Ar-Rahman', arabicName: 'الرحمن' },
      { number: 56, keyword: 'HARI KIAMAT', name: 'Al-Waqi\'ah', arabicName: 'الواقعة' },
      { number: 57, keyword: 'BESI', name: 'Al-Hadid', arabicName: 'الحديد' },
      { number: 58, keyword: 'WANITA YANG MENGAJUKAN GUGATAN', name: 'Al-Mujadilah', arabicName: 'المجادلة' },
      { number: 59, keyword: 'PENGUSIRAN', name: 'Al-Hasyr', arabicName: 'الحشر' },
      { number: 60, keyword: 'PEREMPUAN YANG DIUJI', name: 'Al-Mumtahanah', arabicName: 'الممتحنة' },
    ],
  },
  {
    id: 7,
    title: 'Cerita VII',
    surahRange: 'Surah 61 – 70',
    narrative:
      'BARISAN orang beriman pada HARI JUM\'AT berbeda dengan ORANG-ORANG MUNAFIK. Demikian juga pada HARI DITAMPAKAN KESALAHAN-KESALAHAN. Ketika aku di-TALAK, aku MENGHARAMKAN dia untuk masuk rumah ini. KERAJAAN yang indah, PENA yang mahal, pada HARI KIAMAT tidak lagi berharga. Disinilah TEMPAT-TEMPAT NAIK bagi amal sholih.',
    surahs: [
      { number: 61, keyword: 'BARISAN', name: 'As-Saff', arabicName: 'الصف' },
      { number: 62, keyword: 'HARI JUM\'AT', name: 'Al-Jumu\'ah', arabicName: 'الجمعة' },
      { number: 63, keyword: 'ORANG-ORANG MUNAFIK', name: 'Al-Munafiqun', arabicName: 'المنافقون' },
      { number: 64, keyword: 'HARI DITAMPAKAN KESALAHAN-KESALAHAN', name: 'At-Taghabun', arabicName: 'التغابن' },
      { number: 65, keyword: 'TALAK', name: 'At-Talaq', arabicName: 'الطلاق' },
      { number: 66, keyword: 'MENGHARAMKAN', name: 'At-Tahrim', arabicName: 'التحريم' },
      { number: 67, keyword: 'KERAJAAN', name: 'Al-Mulk', arabicName: 'الملك' },
      { number: 68, keyword: 'PENA', name: 'Al-Qalam', arabicName: 'القلم' },
      { number: 69, keyword: 'HARI KIAMAT', name: 'Al-Haqqah', arabicName: 'الحاقة' },
      { number: 70, keyword: 'TEMPAT-TEMPAT NAIK', name: 'Al-Ma\'arij', arabicName: 'المعارج' },
    ],
  },
  {
    id: 8,
    title: 'Cerita VIII',
    surahRange: 'Surah 71 – 80',
    narrative:
      'NUH diganggu JIN disaat ORANG YANG BERSELIMUT dan ORANG YANG BERKEMUL tertidur pulas. Ia tidak menyadari datangnya KIAMAT. Sementara itu, ketika MANUSIA bertemu dengan MALAIKAT YANG DIUTUS untuk menyampaikan BERITA BESAR tentang kematian, MALAIKAT-MALAIKAT YANG MENCABUT nyawa sedang melihat IA BERMUKA MASAM.',
    surahs: [
      { number: 71, keyword: 'NUH', name: 'Nuh', arabicName: 'نوح' },
      { number: 72, keyword: 'JIN', name: 'Al-Jinn', arabicName: 'الجن' },
      { number: 73, keyword: 'ORANG YANG BERSELIMUT', name: 'Al-Muzzammil', arabicName: 'المزمل' },
      { number: 74, keyword: 'ORANG YANG BERKEMUL', name: 'Al-Muddaththir', arabicName: 'المدثر' },
      { number: 75, keyword: 'KIAMAT', name: 'Al-Qiyamah', arabicName: 'القيامة' },
      { number: 76, keyword: 'MANUSIA', name: 'Al-Insan', arabicName: 'الإنسان' },
      { number: 77, keyword: 'MALAIKAT YANG DIUTUS', name: 'Al-Mursalat', arabicName: 'المرسلات' },
      { number: 78, keyword: 'BERITA BESAR', name: 'An-Naba\'', arabicName: 'النبأ' },
      { number: 79, keyword: 'MALAIKAT-MALAIKAT YANG MENCABUT', name: 'An-Nazi\'at', arabicName: 'النازعات' },
      { number: 80, keyword: 'IA BERMUKA MASAM', name: '\'Abasa', arabicName: 'عبس' },
    ],
  },
  {
    id: 9,
    title: 'Cerita IX',
    surahRange: 'Surah 81 – 90',
    narrative:
      'Ombak MENGGULUNG, bumi TERBELAH, ORANG-ORANG YANG CURANG pun ikut TERBELAH. Mereka seperti GUGUSAN BINTANG YANG DATANG DI MALAM HARI. Mereka berada di tempat YANG PALING TINGGI. Pada HARI PEMBALASAN tidak akan muncul FAJAR di NEGERI manapun.',
    surahs: [
      { number: 81, keyword: 'MENGGULUNG', name: 'At-Takwir', arabicName: 'التكوير' },
      { number: 82, keyword: 'TERBELAH', name: 'Al-Infitar', arabicName: 'الانفطار' },
      { number: 83, keyword: 'ORANG-ORANG YANG CURANG', name: 'Al-Mutaffifin', arabicName: 'المطففين' },
      { number: 84, keyword: 'TERBELAH', name: 'Al-Inshiqaq', arabicName: 'الانشقاق' },
      { number: 85, keyword: 'GUGUSAN BINTANG', name: 'Al-Buruj', arabicName: 'البروج' },
      { number: 86, keyword: 'YANG DATANG DI MALAM HARI', name: 'At-Tariq', arabicName: 'الطارق' },
      { number: 87, keyword: 'YANG PALING TINGGI', name: 'Al-A\'la', arabicName: 'الأعلى' },
      { number: 88, keyword: 'HARI PEMBALASAN', name: 'Al-Ghasyiyah', arabicName: 'الغاشية' },
      { number: 89, keyword: 'FAJAR', name: 'Al-Fajr', arabicName: 'الفجر' },
      { number: 90, keyword: 'NEGERI', name: 'Al-Balad', arabicName: 'البلد' },
    ],
  },
  {
    id: 10,
    title: 'Cerita X',
    surahRange: 'Surah 91 – 100',
    narrative:
      'MATAHARI tenggelam saat MALAM tiba. Dan ketika WAKTU DHUHA, Allah MELAPANGKAN rizki dan menumbuhkan BUAH TIN. Sementara itu manusia yang berasal dari SEGUMPAL DARAH tidak mempunyai KEMULIAAN sedikit pun. Ini adalah BUKTI akan terjadi KEGONCANGAN di dunia. Hingga KUDA PERANG YANG BERLARI KENCANG pun mati.',
    surahs: [
      { number: 91, keyword: 'MATAHARI', name: 'Asy-Syams', arabicName: 'الشمس' },
      { number: 92, keyword: 'MALAM', name: 'Al-Lail', arabicName: 'الليل' },
      { number: 93, keyword: 'WAKTU DHUHA', name: 'Adh-Dhuha', arabicName: 'الضحى' },
      { number: 94, keyword: 'MELAPANGKAN', name: 'Al-Insyirah', arabicName: 'الشرح' },
      { number: 95, keyword: 'BUAH TIN', name: 'At-Tin', arabicName: 'التين' },
      { number: 96, keyword: 'SEGUMPAL DARAH', name: 'Al-\'Alaq', arabicName: 'العلق' },
      { number: 97, keyword: 'KEMULIAAN', name: 'Al-Qadr', arabicName: 'القدر' },
      { number: 98, keyword: 'BUKTI', name: 'Al-Bayyinah', arabicName: 'البينة' },
      { number: 99, keyword: 'KEGONCANGAN', name: 'Az-Zalzalah', arabicName: 'Zalzalah' },
      { number: 100, keyword: 'KUDA PERANG YANG BERLARI KENCANG', name: 'Al-\'Adiyat', arabicName: 'العاديات' },
    ],
  },
  {
    id: 11,
    title: 'Cerita XI',
    surahRange: 'Surah 101 – 114',
    narrative:
      'HARI KIAMAT, hari dimana manusia tidak bisa lagi BERMEGAH-MEGAHAN. Pada MASA itulah si PENGUMPAT mati diinjak-injak GAJAH. Sementara itu SUKU QURAISY bertengkar dengan pak MA\'UN di tepi telaga KAUTSAR. Saat itu ORANG-ORANG KAFIR tidak mendapatkan PERTOLONGAN, hingga GEJOLAK API memusnahkan ketamakan. Hanya dengan MEMURNIKAN KEESAAN ALLAH dan berlindung saat WAKTU SUBUH kita diselamatkan dari kejahatan MANUSIA.',
    surahs: [
      { number: 101, keyword: 'HARI KIAMAT', name: 'Al-Qari\'ah', arabicName: 'القارعة' },
      { number: 102, keyword: 'BERMEGAH-MEGAHAN', name: 'At-Takathur', arabicName: 'التكاثر' },
      { number: 103, keyword: 'MASA', name: 'Al-\'Asr', arabicName: 'العصر' },
      { number: 104, keyword: 'PENGUMPAT', name: 'Al-Humazah', arabicName: 'الهمزة' },
      { number: 105, keyword: 'GAJAH', name: 'Al-Fil', arabicName: 'الفيل' },
      { number: 106, keyword: 'SUKU QURAISY', name: 'Quraysh', arabicName: 'قريش' },
      { number: 107, keyword: 'MA\'UN', name: 'Al-Ma\'un', arabicName: 'الماعون' },
      { number: 108, keyword: 'KAUTSAR', name: 'Al-Kawthar', arabicName: 'الكوثر' },
      { number: 109, keyword: 'ORANG-ORANG KAFIR', name: 'Al-Kafirun', arabicName: 'الكافرون' },
      { number: 110, keyword: 'PERTOLONGAN', name: 'An-Nasr', arabicName: 'النصر' },
      { number: 111, keyword: 'GEJOLAK API', name: 'Al-Lahab', arabicName: 'المسد' },
      { number: 112, keyword: 'MEMURNIKAN KEESAAN ALLAH', name: 'Al-Ikhlas', arabicName: 'الإخلاص' },
      { number: 113, keyword: 'WAKTU SUBUH', name: 'Al-Falaq', arabicName: 'الفلق' },
      { number: 114, keyword: 'MANUSIA', name: 'An-Nas', arabicName: 'الناس' },
    ],
  },
];
