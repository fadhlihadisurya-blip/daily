import React from 'react';
import { Smartphone, Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  onOpenModal: () => void;
  theme?: 'dark' | 'light';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ onOpenModal, theme = 'dark' }) => {
  const { isInstalled, isInstallable, isIOS, install } = usePWAInstall();

  // If already installed as standalone PWA app on device, suppress button
  if (isInstalled) {
    return null;
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={async () => {
        if (isInstallable) {
          const installed = await install();
          if (installed) return;
        }
        onOpenModal();
      }}
      className={`flex items-center space-x-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-bold border transition-all active:scale-95 shadow-sm ${
        isDark
          ? 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:border-emerald-500/50'
          : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700 hover:border-emerald-300'
      }`}
      title="Install Aplikasi Mutaba'ah di iOS / Android"
    >
      <Smartphone className="w-4 h-4 text-emerald-400 animate-pulse" />
      <span className="hidden lg:inline">Install di iOS / Android</span>
      <span className="lg:hidden">Install App</span>
    </button>
  );
};
