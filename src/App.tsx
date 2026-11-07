import React, { useState, useEffect } from 'react';
import { ActiveTab, DailyLog, PrayerKey, ReadingItem, MurajaahLog, TilawahLog, ExerciseLog, ReminderConfig } from './types';
import {
  loadAllLogs,
  saveAllLogs,
  getOrCreateDailyLog,
  loadReminders,
  saveReminders,
  calculateStreak,
} from './utils/storage';
import { getTodayDateStr } from './data/initialData';
import { Navbar } from './components/Navbar';
import { DateHeader } from './components/DateHeader';
import { WakeUpSection } from './components/WakeUpSection';
import { ShalatSection } from './components/ShalatSection';
import { MurajaahSection } from './components/MurajaahSection';
import { TilawahSection } from './components/TilawahSection';
import { ReadingSection } from './components/ReadingSection';
import { ExerciseSection } from './components/ExerciseSection';
import { AnalyticsView } from './components/AnalyticsView';
import { QuranSurahStoriesView } from './components/QuranSurahStoriesView';
import { AiAdviceModal } from './components/AiAdviceModal';
import { BackupModal } from './components/BackupModal';
import { AuthModal } from './components/AuthModal';
import { AuthGate } from './components/AuthGate';
import { UserSettingsSection } from './components/UserSettingsSection';
import { FileText, Save, Sparkles, Sun, Moon, Check, ShieldCheck, Heart, CloudCheck, Database, Loader2, AlertTriangle } from 'lucide-react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, collection, onSnapshot } from 'firebase/firestore';
import {
  auth,
  db,
  loginWithGoogle,
  logoutUser,
  testFirestoreConnection,
  handleFirestoreError,
  OperationType,
} from './lib/firebase';

export default function App() {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateStr());
  const [allLogs, setAllLogs] = useState<Record<string, DailyLog>>(() => loadAllLogs());
  const [reminders, setReminders] = useState<ReminderConfig[]>(() => loadReminders());
  const [activeTab, setActiveTab] = useState<ActiveTab>('beranda');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [quotaExceeded, setQuotaExceeded] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('daily_routine_theme_v1') as 'dark' | 'light') || 'dark';
  });

  // Modals state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Validate connection to Firestore on boot
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  // Track Firebase Auth state & attach realtime Firestore listeners
  useEffect(() => {
    let unsubLogs: (() => void) | null = null;
    let unsubReminders: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);

      if (unsubLogs) {
        unsubLogs();
        unsubLogs = null;
      }
      if (unsubReminders) {
        unsubReminders();
        unsubReminders = null;
      }

      if (user) {
        // Sync daily logs collection
        const logsRef = collection(db, 'users', user.uid, 'daily_logs');
        unsubLogs = onSnapshot(
          logsRef,
          (snapshot) => {
            const cloudLogs: Record<string, DailyLog> = {};
            snapshot.docs.forEach((docSnap) => {
              cloudLogs[docSnap.id] = docSnap.data() as DailyLog;
            });
            if (Object.keys(cloudLogs).length > 0) {
              setAllLogs((prev) => {
                const merged = { ...prev, ...cloudLogs };
                saveAllLogs(merged);
                return merged;
              });
            }
          },
          (error: any) => {
            if (
              error?.message?.includes('Quota limit exceeded') ||
              error?.message?.includes('resource-exhausted') ||
              error?.code === 'resource-exhausted'
            ) {
              console.warn('Firestore write quota exceeded for daily logs snapshot.');
              setQuotaExceeded(true);
            } else {
              console.warn('Daily logs snapshot warning:', error.message);
            }
          }
        );

        // Sync reminders config doc
        const remindersRef = doc(db, 'users', user.uid, 'settings', 'reminders');
        unsubReminders = onSnapshot(
          remindersRef,
          (docSnap) => {
            if (docSnap.exists() && docSnap.data().reminders) {
              const loadedReminders = docSnap.data().reminders;
              setReminders(loadedReminders);
              saveReminders(loadedReminders);
            }
          },
          (error: any) => {
            if (
              error?.message?.includes('Quota limit exceeded') ||
              error?.message?.includes('resource-exhausted') ||
              error?.code === 'resource-exhausted'
            ) {
              console.warn('Firestore write quota exceeded for reminders snapshot.');
              setQuotaExceeded(true);
            } else {
              console.warn('Reminders snapshot warning:', error.message);
            }
          }
        );
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubLogs) unsubLogs();
      if (unsubReminders) unsubReminders();
    };
  }, []);

  // Sync theme to localStorage and body/documentElement
  useEffect(() => {
    localStorage.setItem('daily_routine_theme_v1', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.style.backgroundColor = '#0f172a';
      document.body.style.color = '#f8fafc';
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.color = '#0f172a';
    }
  }, [theme]);

  const currentLog = getOrCreateDailyLog(selectedDate, allLogs);

  const updateCurrentLog = (patch: Partial<DailyLog>) => {
    const updatedLog: DailyLog = {
      ...currentLog,
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    setAllLogs((prev) => {
      const nextLogs = { ...prev, [selectedDate]: updatedLog };
      saveAllLogs(nextLogs);
      return nextLogs;
    });

    if (currentUser && !quotaExceeded) {
      const logRef = doc(db, 'users', currentUser.uid, 'daily_logs', selectedDate);
      setDoc(logRef, updatedLog, { merge: true }).catch((err: any) => {
        if (
          err?.message?.includes('Quota limit exceeded') ||
          err?.message?.includes('resource-exhausted') ||
          err?.code === 'resource-exhausted'
        ) {
          console.warn('Firestore write quota exceeded; falling back to local persistence.');
          setQuotaExceeded(true);
        } else {
          console.warn('Firestore log write warning:', err?.message);
        }
      });
    }
  };

  const handleUpdateReminders = (newReminders: ReminderConfig[]) => {
    setReminders(newReminders);
    saveReminders(newReminders);

    if (currentUser && !quotaExceeded) {
      const remindersRef = doc(db, 'users', currentUser.uid, 'settings', 'reminders');
      setDoc(remindersRef, { reminders: newReminders, updatedAt: new Date().toISOString() }, { merge: true }).catch((err: any) => {
        if (
          err?.message?.includes('Quota limit exceeded') ||
          err?.message?.includes('resource-exhausted') ||
          err?.code === 'resource-exhausted'
        ) {
          console.warn('Firestore write quota exceeded for reminders.');
          setQuotaExceeded(true);
        } else {
          console.warn('Firestore reminders write warning:', err?.message);
        }
      });
    }
  };

  // Prayer handlers
  const handleTogglePrayer = (key: PrayerKey, completed: boolean) => {
    updateCurrentLog({
      prayers: {
        ...currentLog.prayers,
        [key]: completed,
      },
    });
  };

  const handleUpdatePrayerNote = (key: PrayerKey, note: string) => {
    updateCurrentLog({
      prayerNotes: {
        ...currentLog.prayerNotes,
        [key]: note,
      },
    });
  };

  const handleMarkAllPrayers = (completed: boolean) => {
    const keys: PrayerKey[] = [
      'tahajjud',
      'qobliyah_subuh',
      'dhuha',
      'qobliyah_zuhur',
      'badiyyah_zuhur',
      'qobliyah_ashar',
      'qobliyah_maghrib',
      'badiyyah_maghrib',
      'qobliyah_isya',
      'badiyyah_isya',
      'witir',
    ];
    const newPrayers = { ...currentLog.prayers };
    keys.forEach((k) => {
      newPrayers[k] = completed;
    });
    updateCurrentLog({ prayers: newPrayers });
  };

  // Reading handlers
  const handleAddReading = (item: Omit<ReadingItem, 'id' | 'timestamp'>) => {
    const newItem: ReadingItem = {
      ...item,
      id: `read_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    updateCurrentLog({
      readings: [newItem, ...currentLog.readings],
    });
  };

  const handleDeleteReading = (id: string) => {
    updateCurrentLog({
      readings: currentLog.readings.filter((r) => r.id !== id),
    });
  };

  // Murajaah handler
  const handleUpdateMurajaah = (updated: Partial<MurajaahLog>) => {
    updateCurrentLog({
      murajaah: {
        ...currentLog.murajaah,
        ...updated,
      },
    });
  };

  // Tilawah handler
  const handleUpdateTilawah = (updated: TilawahLog) => {
    updateCurrentLog({
      tilawah: updated,
    });
  };

  // Exercise handler
  const handleUpdateExercises = (updated: ExerciseLog[]) => {
    updateCurrentLog({
      exercises: updated,
    });
  };

  const { currentStreak } = calculateStreak(allLogs);

  // 1. Loading splash screen while checking auth status
  if (authLoading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors ${
        theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 animate-pulse">
            <Moon className="w-6 h-6 fill-white/20" />
          </div>
          <div className="flex items-center space-x-2 text-emerald-500 font-bold text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Memeriksa Status Login Akun...</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Mandatory Authentication Gate: User MUST log in first before using app
  if (!currentUser) {
    return <AuthGate theme={theme} setTheme={setTheme} />;
  }

  return (
    <div className={`min-h-screen flex flex-col pb-20 md:pb-8 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        streakCount={currentStreak}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        theme={theme}
        currentUser={currentUser}
        onLogin={() => setIsAuthModalOpen(true)}
        onLogout={() => logoutUser().catch(console.error)}
      />

      {/* Quota Exceeded Alert Banner */}
      {quotaExceeded && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 text-amber-400 px-4 py-2.5 text-xs flex items-center justify-between">
          <div className="max-w-7xl mx-auto w-full flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              <strong>Batas Quota Firestore Hari Ini Terlampaui:</strong> Sistem otomatis mengaktifkan <strong>Mode Penyimpanan Lokal (LocalStorage)</strong>. Seluruh jurnal & rutinitas harian Anda tetap tersimpan dengan aman di browser dan akan disinkronkan kembali besok setelah quota direset oleh Firebase.
            </span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'beranda' && (
          <div className="space-y-6">
            {/* Date Picker & Progress Banner */}
            <DateHeader
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              currentLog={currentLog}
              onUpdateMood={(mood) => updateCurrentLog({ mood })}
              userName={currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Pengguna'}
            />

            {/* Bangun Tidur Section */}
            <WakeUpSection
              wakeUpState={currentLog.wakeUpState}
              onSelectWakeUp={(wakeUpState) => updateCurrentLog({ wakeUpState })}
            />

            {/* Shalat Sunnah Section */}
            <ShalatSection
              prayers={currentLog.prayers}
              prayerNotes={currentLog.prayerNotes}
              onTogglePrayer={handleTogglePrayer}
              onUpdatePrayerNote={handleUpdatePrayerNote}
              onMarkAllPrayers={handleMarkAllPrayers}
            />

            {/* Murajaah & Tilawah Al-Qur'an */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MurajaahSection
                murajaah={currentLog.murajaah}
                onUpdateMurajaah={handleUpdateMurajaah}
              />

              <TilawahSection
                tilawah={currentLog.tilawah}
                onUpdateTilawah={handleUpdateTilawah}
              />
            </div>

            {/* Membaca Buku Section */}
            <ReadingSection
              readings={currentLog.readings}
              onAddReading={handleAddReading}
              onDeleteReading={handleDeleteReading}
            />

            {/* Olahraga Section (Push-Up & Pull-Up) */}
            <ExerciseSection
              exercises={currentLog.exercises}
              onUpdateExercises={handleUpdateExercises}
            />

            {/* Catatan Harian & Refleksi Self-Journal */}
            <div className={`rounded-2xl p-5 border shadow-xl backdrop-blur-sm space-y-3 transition-colors ${
              theme === 'dark' ? 'bg-slate-800/80 border-slate-700/60' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold">Catatan & Refleksi Harian</h3>
              </div>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Tuliskan rasa syukur, kendala harian, atau pelajaran berharga hari ini
              </p>
              <textarea
                rows={3}
                placeholder="Apa hal baik yang dirasakan hari ini? Pelajaran apa yang dipetik?..."
                value={currentLog.dailyNote || ''}
                onChange={(e) => updateCurrentLog({ dailyNote: e.target.value })}
                className={`w-full rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-500 resize-y border ${
                  theme === 'dark'
                    ? 'bg-slate-900 border-slate-700 text-slate-100'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>
        )}

        {activeTab === 'progres' && <AnalyticsView allLogs={allLogs} />}

        {activeTab === 'surat_quran' && (
          <QuranSurahStoriesView theme={theme} />
        )}

        {activeTab === 'pengaturan' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* User Profile & Password Editing */}
            <UserSettingsSection currentUser={currentUser} theme={theme} />

            <div className={`rounded-2xl p-6 border shadow-xl space-y-6 transition-all ${
              theme === 'dark'
                ? 'bg-slate-800/80 border-slate-700/60 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
            }`}>
              {/* Header Tema */}
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-xl border ${
                  theme === 'dark'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-amber-100 border-amber-300 text-amber-600'
                }`}>
                  {theme === 'dark' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                </div>
                <div>
                  <h2 className="text-lg font-bold">Pilihan Mode Tampilan (Tema)</h2>
                  <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    Pilih tema Mode Gelap (Dark Mode) atau Mode Terang (Light Mode) sesuai kenyamanan penglihatan Anda
                  </p>
                </div>
              </div>

              {/* Theme Toggle Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Mode Gelap */}
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                    theme === 'dark'
                      ? 'bg-slate-900 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/50'
                      : 'bg-slate-100 border-slate-300 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-slate-800 text-amber-400 border border-slate-700">
                      <Moon className="w-5 h-5 fill-amber-400/20" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-bold">Mode Gelap (Dark Mode)</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Sangat nyaman untuk penglihatan di malam hari</p>
                    </div>
                  </div>
                  {theme === 'dark' && <Check className="w-5 h-5 text-emerald-400 stroke-[3]" />}
                </button>

                {/* Mode Terang */}
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                    theme === 'light'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/50'
                      : 'bg-slate-800/40 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-amber-100 text-amber-600 border border-amber-200">
                      <Sun className="w-5 h-5 fill-amber-500/20" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-bold">Mode Terang (Light Mode)</h4>
                      <p className={`text-[10px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} mt-0.5`}>
                        Cerah, bersih, & jelas untuk penggunaan siang hari
                      </p>
                    </div>
                  </div>
                  {theme === 'light' && <Check className="w-5 h-5 text-emerald-600 stroke-[3]" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* AI Advice Modal */}
      <AiAdviceModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        selectedDate={selectedDate}
        currentLog={currentLog}
        allLogs={allLogs}
      />

      {/* Backup Data Modal */}
      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        allLogs={allLogs}
        reminders={reminders}
        onImportLogs={(imported) => setAllLogs(imported)}
      />

      {/* Auth Modal (Email/Password & Google) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        theme={theme}
      />
    </div>
  );
}
