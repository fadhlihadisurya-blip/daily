import React from 'react';
import { X, Share, PlusSquare, Smartphone, CheckCircle2, Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose, theme = 'dark' }) => {
  const { isInstallable, isIOS, install, isInstalled } = usePWAInstall();

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border transition-all ${
        isDark
          ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-emerald-900/20'
          : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50'
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
            isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
          }`}
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold tracking-tight">Install Aplikasi di iOS & Android</h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Jadikan aplikasi seperti Aplikasi Asli (Native App) tanpa App Store
            </p>
          </div>
        </div>

        {/* Installed State */}
        {isInstalled ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center space-x-3">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <div>
              <p className="font-bold">Aplikasi Sudah Terinstall!</p>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                Aplikasi ini sudah berjalan dalam mode PWA Standalone di perangkat Anda.
              </p>
            </div>
          </div>
        ) : isInstallable ? (
          /* Direct Chrome/Android Install */
          <div className="space-y-4">
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Perangkat Anda mendukung instalasi langsung 1-klik ke Layar Utama. Klik tombol di bawah untuk menginstall secara otomatis.
            </p>
            <button
              onClick={async () => {
                const res = await install();
                if (res) onClose();
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 hover:from-emerald-500 hover:to-teal-400 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Install Sekarang ke Layar Utama</span>
            </button>
          </div>
        ) : (
          /* iOS Safari Specific Detailed Step-by-Step Guide */
          <div className="space-y-4">
            <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed flex items-center space-x-2.5 ${
              isDark ? 'bg-slate-800/60 border-slate-700/80 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 font-bold text-[10px] text-emerald-400 shrink-0">iOS / Safari</span>
              <span>Ikuti 3 langkah mudah berikut untuk menginstall di iPhone atau iPad Anda:</span>
            </div>

            <div className="space-y-3 pt-1">
              {/* Step 1 */}
              <div className={`p-3.5 rounded-2xl border flex items-start space-x-3 transition-colors ${
                isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="text-xs">
                  <p className="font-bold flex items-center gap-1.5 text-slate-200">
                    Buka Menu Bagikan (Share)
                    <Share className="w-4 h-4 text-emerald-400 inline" />
                  </p>
                  <p className={`mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Tekan ikon <strong>Share</strong> (kotak panah ke atas) di bagian bawah bar navigasi browser Safari iPhone/iPad Anda.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className={`p-3.5 rounded-2xl border flex items-start space-x-3 transition-colors ${
                isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="text-xs">
                  <p className="font-bold flex items-center gap-1.5 text-slate-200">
                    Pilih "Tambah ke Layar Utama"
                    <PlusSquare className="w-4 h-4 text-emerald-400 inline" />
                  </p>
                  <p className={`mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Gulir menu ke bawah dan pilih opsi <strong>"Tambah ke Layar Utama"</strong> (atau <em>"Add to Home Screen"</em>).
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className={`p-3.5 rounded-2xl border flex items-start space-x-3 transition-colors ${
                isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="text-xs">
                  <p className="font-bold text-slate-200">Klik "Tambah" di Pojok Kanan Atas</p>
                  <p className={`mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Tekan <strong>"Tambah" (Add)</strong>. Ikon aplikasi akan langsung muncul di home screen iPhone Anda!
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className={`w-full mt-2 py-3 px-4 rounded-2xl border text-xs font-bold transition-all ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
              }`}
            >
              Saya Mengerti & Mengerti Cara Menginstall
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
