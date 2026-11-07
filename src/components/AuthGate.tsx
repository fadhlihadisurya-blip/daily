import React, { useState } from 'react';
import { loginWithEmail, registerWithEmail } from '../lib/firebase';
import {
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  Sparkles,
  LogIn,
  UserPlus,
  AlertCircle,
  Moon,
  Sun,
  CheckCircle2,
  BookOpen,
  Flame,
  Activity,
} from 'lucide-react';

interface AuthGateProps {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({ theme, setTheme }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isDark = theme === 'dark';

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrorMessage(null);
  };

  const handleTabSwitch = (newTab: 'login' | 'register') => {
    setTab(newTab);
    resetForm();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      await loginWithEmail(email.trim(), password.trim());
    } catch (err: any) {
      console.error(err);
      let msg = err.message || 'Gagal masuk. Periksa kembali email & password Anda.';
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password'
      ) {
        msg = 'Email atau password yang Anda masukkan salah.';
      } else if (err.code === 'auth/operation-not-allowed') {
        msg =
          'Provider Email/Password belum aktif di Firebase Console. Silakan aktifkan di Firebase Console > Authentication > Sign-in method.';
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    if (password.length < 6) {
      setErrorMessage('Password minimal harus terdiri dari 6 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi password tidak cocok.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await registerWithEmail(name.trim(), email.trim(), password.trim());
    } catch (err: any) {
      console.error(err);
      let msg = err.message || 'Gagal mendaftar akun baru.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'Email ini sudah terdaftar. Silakan gunakan menu Masuk / Login.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password terlalu lemah. Gunakan minimal 6 karakter.';
      } else if (err.code === 'auth/operation-not-allowed') {
        msg =
          'Provider Email/Password belum aktif di Firebase Console. Silakan aktifkan di Firebase Console > Authentication > Sign-in method.';
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between transition-colors duration-300 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Top Header bar with Theme Toggle */}
      <header className={`px-6 py-4 border-b flex items-center justify-between ${
        isDark ? 'border-slate-800/80 bg-slate-900/60' : 'border-slate-200 bg-white/80'
      } backdrop-blur-md sticky top-0 z-20`}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Moon className="w-5 h-5 fill-white/20" />
          </div>
          <div>
            <h1 className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
              Mutaba'ah & Daily Activity Tracker
            </h1>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Platform Pencatatan Ibadah & Rutinitas Harian
            </p>
          </div>
        </div>

        {/* Theme Switcher */}
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className={`p-2.5 rounded-xl border transition-all flex items-center space-x-2 text-xs font-semibold ${
            isDark
              ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm'
          }`}
          title="Ganti Tema"
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Mode Terang</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-700" />
              <span className="hidden sm:inline">Mode Gelap</span>
            </>
          )}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Brand Value Proposition & Features */}
        <div className="lg:col-span-6 space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
            Selamat Datang!
          </h2>

          <div className="space-y-3 pt-2">
            {[
              { title: 'Checklist Shalat Sunnah Harian', desc: 'Tahajjud, Dhuha, Witir, & Rawatib lengkap dengan catatan khusyuk', icon: CheckCircle2, color: 'text-emerald-500' },
              { title: 'Tilawah & Murajaah Al-Qur\'an', desc: 'Target 1 Juz per hari & checklist per-surah otomatis', icon: BookOpen, color: 'text-teal-400' },
              { title: 'Log Olahraga Push-Up & Pull-Up', desc: 'Pencatatan set & repetisi harian', icon: Activity, color: 'text-cyan-400' },
              { title: 'Grafik Analisis & Evaluasi AI', desc: 'Laporan progres mingguan/bulanan dan saran penguat istiqomah', icon: Flame, color: 'text-amber-400' },
            ].map((feat, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border flex items-start space-x-3 transition-all ${
                  isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className={`p-2 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-100'} ${feat.color}`}>
                  <feat.icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold">{feat.title}</h4>
                  <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Auth Form Card */}
        <div className="lg:col-span-6">
          <div
            className={`rounded-3xl p-6 sm:p-8 shadow-2xl border space-y-6 transition-all ${
              isDark
                ? 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-slate-950/80'
                : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/60'
            }`}
          >
            {/* Header */}
            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold">Akses Akun Mutaba'ah</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Masuk atau daftar untuk membuka seluruh fitur & pencatatan
              </p>
            </div>

            {/* Tab Switcher */}
            <div
              className={`grid grid-cols-2 gap-1 p-1.5 rounded-2xl border ${
                isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-200'
              }`}
            >
              <button
                type="button"
                onClick={() => handleTabSwitch('login')}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  tab === 'login'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk / Login</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabSwitch('register')}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  tab === 'register'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Daftar Akun Baru</span>
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{errorMessage}</p>
              </div>
            )}

            {/* Login Form */}
            {tab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5">Alamat Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border focus:outline-none focus:border-emerald-500 ${
                        isDark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5">Kata Sandi (Password)</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border focus:outline-none focus:border-emerald-500 ${
                        isDark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  {loading ? (
                    <span>Memproses...</span>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Masuk Ke Akun Saya</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5">Nama Lengkap</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Nama Lengkap Anda"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border focus:outline-none focus:border-emerald-500 ${
                        isDark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5">Alamat Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border focus:outline-none focus:border-emerald-500 ${
                        isDark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold mb-1.5">Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Min 6 Karakter"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-none focus:border-emerald-500 ${
                        isDark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1.5">Ulangi Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Ulangi Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-none focus:border-emerald-500 ${
                        isDark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  {loading ? (
                    <span>Mendaftarkan Akun...</span>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Daftar Akun Baru</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`py-4 text-center text-xs border-t ${
        isDark ? 'border-slate-800/80 text-slate-500' : 'border-slate-200 text-slate-400'
      }`}>
        <p>© 2026 Mutaba'ah & Daily Activity Tracker. Data Anda tersimpan pribadi & aman.</p>
      </footer>
    </div>
  );
};
