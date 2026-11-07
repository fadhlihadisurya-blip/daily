import React, { useState } from 'react';
import { loginWithEmail, registerWithEmail } from '../lib/firebase';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, X, Sparkles, LogIn, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  theme = 'dark',
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

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
      resetForm();
      onClose();
    } catch (err: any) {
      console.error(err);
      let msg = err.message || 'Gagal masuk. Periksa kembali email & password Anda.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        msg = 'Email atau password yang Anda masukkan salah.';
      } else if (err.code === 'auth/operation-not-allowed') {
        msg = 'Provider Email/Password belum di-enable pada Firebase Console Anda. Mohon aktifkan di Authentication > Sign-in method.';
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
      resetForm();
      onClose();
    } catch (err: any) {
      console.error(err);
      let msg = err.message || 'Gagal mendaftar akun baru.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'Email ini sudah terdaftar. Silakan gunakan menu Masuk / Login.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password terlalu lemah. Guanakan minimal 6 karakter.';
      } else if (err.code === 'auth/operation-not-allowed') {
        msg = 'Provider Email/Password belum di-enable pada Firebase Console. Mohon aktifkan di Authentication > Sign-in method.';
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div
        className={`rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 border transition-all ${
          isDark
            ? 'bg-slate-900 border-slate-700/80 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 text-white shadow-md">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Akun Mutaba'ah Anda</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Simpan data harian secara pribadi & tersinkron di cloud
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-xl transition-colors ${
              isDark ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div className={`grid grid-cols-2 gap-1 p-1 rounded-xl border ${
          isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            type="button"
            onClick={() => handleTabSwitch('login')}
            className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              tab === 'login'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Masuk / Login</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch('register')}
            className={`py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              tab === 'register'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Daftar Akun Baru</span>
          </button>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {/* Form Body */}
        {tab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold mb-1">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-none focus:border-emerald-500 ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold mb-1">
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-9 pr-10 py-2 text-xs rounded-xl border focus:outline-none focus:border-emerald-500 ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
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
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold mb-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Fadhli Hadi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-none focus:border-emerald-500 ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold mb-1">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-none focus:border-emerald-500 ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold mb-1">
                  Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Min 6 kar"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:border-emerald-500 ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold mb-1">
                  Ulangi Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Ulangi"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:border-emerald-500 ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <span>Mendaftarkan...</span>
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
  );
};
