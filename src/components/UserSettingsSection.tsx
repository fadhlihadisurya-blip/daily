import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { updateUserProfileName, changeUserPassword } from '../lib/firebase';
import {
  User as UserIcon,
  Lock,
  Save,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
} from 'lucide-react';

interface UserSettingsSectionProps {
  currentUser: User | null;
  theme: 'dark' | 'light';
}

export const UserSettingsSection: React.FC<UserSettingsSectionProps> = ({
  currentUser,
  theme,
}) => {
  const isDark = theme === 'dark';

  // State for Name Edit
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [savingName, setSavingName] = useState(false);
  const [nameSuccess, setNameSuccess] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  // State for Password Change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);
  const [passError, setPassError] = useState<string | null>(null);

  if (!currentUser) return null;

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setNameError('Nama lengkap tidak boleh kosong.');
      return;
    }

    setSavingName(true);
    setNameSuccess(null);
    setNameError(null);

    try {
      await updateUserProfileName(displayName.trim());
      setNameSuccess('Nama lengkap profil berhasil diperbarui!');
    } catch (err: any) {
      console.error(err);
      setNameError(err.message || 'Gagal memperbarui nama profil.');
    } finally {
      setSavingName(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPassError('Semua kolom password wajib diisi.');
      return;
    }

    if (newPassword.length < 6) {
      setPassError('Password baru minimal harus 6 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('Konfirmasi password baru tidak cocok.');
      return;
    }

    setSavingPassword(true);
    setPassSuccess(null);
    setPassError(null);

    try {
      await changeUserPassword(currentPassword, newPassword);
      setPassSuccess('Password akun berhasil diubah!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error(err);
      let msg = err.message || 'Gagal mengubah password.';
      if (
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential'
      ) {
        msg = 'Password saat ini yang Anda masukkan salah.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password baru terlalu lemah. Gunakan minimal 6 karakter.';
      } else if (err.code === 'auth/requires-recent-login') {
        msg = 'Sesi login Anda sudah terlalu lama. Silakan logout dan login kembali untuk mengubah password.';
      }
      setPassError(msg);
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profil Pengguna Card */}
      <div
        className={`rounded-2xl p-6 border shadow-xl space-y-6 transition-all ${
          isDark
            ? 'bg-slate-800/80 border-slate-700/60 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <UserIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Edit Profil Pengguna</h2>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Perbarui nama lengkap akun Anda yang muncul di sistem
            </p>
          </div>
        </div>

        {nameSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{nameSuccess}</span>
          </div>
        )}

        {nameError && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{nameError}</span>
          </div>
        )}

        <form onSubmit={handleUpdateName} className="space-y-4">
          <div>
            <label className="block text-xs font-bold mb-1.5">Alamat Email (Akun)</label>
            <input
              type="text"
              disabled
              value={currentUser.email || ''}
              className={`w-full px-3.5 py-2.5 text-xs rounded-xl border opacity-75 cursor-not-allowed ${
                isDark ? 'bg-slate-900 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-300 text-slate-600'
              }`}
            />
            <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Email akun digunakan sebagai ID login unik
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5">Nama Lengkap</label>
            <div className="relative">
              <UserCheck className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                required
                placeholder="Nama Lengkap Anda"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border focus:outline-none focus:border-emerald-500 ${
                  isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingName}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center space-x-2 active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{savingName ? 'Simpan...' : 'Simpan Nama Lengkap'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Ganti Password Card */}
      <div
        className={`rounded-2xl p-6 border shadow-xl space-y-6 transition-all ${
          isDark
            ? 'bg-slate-800/80 border-slate-700/60 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Ganti Password (Kata Sandi)</h2>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Ubah kata sandi akun Anda demi keamanan data
            </p>
          </div>
        </div>

        {passSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{passSuccess}</span>
          </div>
        )}

        {passError && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{passError}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold mb-1.5">Password Saat Ini</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type={showCurrentPass ? 'text' : 'password'}
                required
                placeholder="Masukkan password saat ini"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border focus:outline-none focus:border-indigo-500 ${
                  isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200"
              >
                {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5">Password Baru</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type={showNewPass ? 'text' : 'password'}
                  required
                  placeholder="Min 6 karakter"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border focus:outline-none focus:border-indigo-500 ${
                    isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200"
                >
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5">Konfirmasi Password Baru</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type={showNewPass ? 'text' : 'password'}
                  required
                  placeholder="Ulangi password baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border focus:outline-none focus:border-indigo-500 ${
                    isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingPassword}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center space-x-2 active:scale-95"
            >
              <KeyRound className="w-4 h-4" />
              <span>{savingPassword ? 'Ubah Password...' : 'Ubah Password'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Install PWA di iOS & Android Card */}
      <div
        className={`rounded-2xl p-6 border shadow-xl space-y-4 transition-all ${
          isDark
            ? 'bg-slate-800/80 border-slate-700/60 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30">
            <UserCheck className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Install Aplikasi di iOS (iPhone / iPad) & Android</h2>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Petunjuk pemasangan aplikasi langsung ke layar utama perangkat Anda
            </p>
          </div>
        </div>

        <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-2 ${
          isDark ? 'bg-slate-900/60 border-slate-700/60 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}>
          <p className="font-bold text-emerald-400">Cara Instalasi di iPhone / iPad (Safari):</p>
          <ol className="list-decimal list-inside space-y-1 text-[11px] pl-1">
            <li>Buka halaman aplikasi ini menggunakan <strong>Safari</strong> di iPhone/iPad Anda.</li>
            <li>Ketuk tombol <strong>Bagikan (Share)</strong> di bagian bawah layar Safari (ikon kotak dengan panah ke atas).</li>
            <li>Gulir ke bawah dan ketuk opsi <strong>"Tambah ke Layar Utama" (Add to Home Screen)</strong>.</li>
            <li>Tekan <strong>"Tambah"</strong> di pojok kanan atas. Aplikasi akan terpasang layaknya aplikasi bawaan iOS!</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
