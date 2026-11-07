import React from 'react';
import { ActiveTab } from '../types';
import { User } from 'firebase/auth';
import {
  CheckCircle2,
  BarChart3,
  Bell,
  Settings,
  Sparkles,
  Flame,
  Moon,
  Bookmark,
  LogIn,
  LogOut,
  UserCheck,
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  streakCount: number;
  onOpenAiModal: () => void;
  theme?: 'dark' | 'light';
  currentUser?: User | null;
  onLogin?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  streakCount,
  onOpenAiModal,
  theme = 'dark',
  currentUser,
  onLogin,
  onLogout,
}) => {
  const isDark = theme === 'dark';

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'beranda', label: 'Beranda', icon: <CheckCircle2 className="w-5 h-5" /> },
    { id: 'progres', label: 'Progres', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'pengingat', label: 'Pengingat', icon: <Bell className="w-5 h-5" /> },
    { id: 'pengaturan', label: 'Pengaturan', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Top Header Navigation (Desktop & Mobile header) */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white/90 border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Moon className="w-5 h-5 fill-white/20" />
            </div>
            <div>
              <h1 className={`text-base font-bold bg-clip-text text-transparent bg-gradient-to-r ${
                isDark ? 'from-white via-slate-100 to-slate-300' : 'from-slate-900 via-slate-800 to-slate-700'
              } flex items-center gap-1.5`}>
                Mutaba'ah & Routine
              </h1>
              <p className={`text-xs font-medium hidden sm:block ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                Pencatatan Ibadah & Rutinitas Harian
              </p>
            </div>
          </div>

          {/* Center Nav Links (Desktop) */}
          <nav className={`hidden md:flex items-center space-x-1 p-1.5 rounded-xl border ${
            isDark ? 'bg-slate-800/60 border-slate-700/50' : 'bg-slate-100 border-slate-200'
          }`}>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                      : isDark
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Streak Counter */}
            <div className="flex items-center space-x-1.5 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl text-amber-400 text-xs font-bold">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400/30 animate-pulse" />
              <span>{streakCount} Hari Istiqomah</span>
            </div>

            {/* AI Evaluasi Button */}
            <button
              onClick={onOpenAiModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-teal-500/20 active:scale-95"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span className="hidden sm:inline">AI Evaluasi</span>
              <span className="sm:hidden">AI</span>
            </button>

            {/* Google Auth User Profile Button */}
            {currentUser ? (
              <div className="flex items-center space-x-2">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="w-8 h-8 rounded-full border border-emerald-500/50 object-cover"
                    title={`Login sebagai ${currentUser.displayName || currentUser.email}`}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 text-xs font-bold">
                    {currentUser.displayName?.[0] || 'U'}
                  </div>
                )}
                <button
                  onClick={onLogout}
                  className={`p-2 rounded-xl border transition-colors ${
                    isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-rose-600 border-slate-300'
                  }`}
                  title="Keluar (Logout)"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Masuk / Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-lg border-t px-3 py-2 transition-colors ${
        isDark ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-200 shadow-lg'
      }`}>
        <div className="grid grid-cols-4 gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs transition-all ${
                  isActive
                    ? 'text-emerald-500 bg-emerald-500/10 font-bold'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200 font-medium'
                    : 'text-slate-500 hover:text-slate-900 font-medium'
                }`}
              >
                <div
                  className={`p-1 rounded-lg ${
                    isActive ? (isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600') : ''
                  }`}
                >
                  {item.icon}
                </div>
                <span className="mt-1 text-[10px]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
