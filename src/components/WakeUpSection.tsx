import React from 'react';
import { WakeUpOption } from '../types';
import { AlarmClock, Sun, BellRing, Check, Sparkles, AlertCircle, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WakeUpSectionProps {
  wakeUpState?: WakeUpOption;
  onSelectWakeUp: (option: WakeUpOption) => void;
}

export const WakeUpSection: React.FC<WakeUpSectionProps> = ({
  wakeUpState,
  onSelectWakeUp,
}) => {
  const options: {
    id: WakeUpOption;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    color: string;
    badgeBg: string;
  }[] = [
    {
      id: 'bangun_sendiri',
      label: 'Bangun sendiri sebelum jam 4',
      sublabel: 'Disiplin mandiri untuk Qiyamul Lail & Sahur',
      icon: <AlarmClock className="w-5 h-5 text-emerald-400" />,
      color: 'emerald',
      badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    },
    {
      id: 'dibangunkan',
      label: 'Dibangunkan sebelum jam 4',
      sublabel: 'Dibantu alarm/keluarga sebelum jam 04:00',
      icon: <BellRing className="w-5 h-5 text-teal-400" />,
      color: 'teal',
      badgeBg: 'bg-teal-500/10 border-teal-500/30 text-teal-300',
    },
    {
      id: 'terlambat',
      label: 'Terlambat bangun',
      sublabel: 'Bangun sesudah jam 04:00',
      icon: <Sun className="w-5 h-5 text-amber-400" />,
      color: 'amber',
      badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    },
  ];

  const handleSelect = (optionId: WakeUpOption) => {
    onSelectWakeUp(optionId);
    if (optionId === 'bangun_sendiri' && wakeUpState !== 'bangun_sendiri') {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 },
      });
    }
  };

  return (
    <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/60 shadow-xl backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Bangun Tidur
              {wakeUpState && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center gap-1">
                  <Check className="w-3 h-3 stroke-[3]" /> Terekam
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              Pencatatan kedisiplinan waktu bangun tidur di pagi hari
            </p>
          </div>
        </div>
      </div>

      {/* Checklist Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        {options.map((opt) => {
          const isSelected = wakeUpState === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-emerald-950/30 border-emerald-500/60 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/30'
                  : 'bg-slate-900/60 border-slate-700/70 hover:border-slate-600 hover:bg-slate-900/90'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                    {opt.icon}
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md'
                        : 'border-slate-600 bg-slate-800 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>

                <div>
                  <h4
                    className={`text-xs font-bold transition-colors ${
                      isSelected ? 'text-emerald-300' : 'text-slate-100'
                    }`}
                  >
                    {opt.label}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {opt.sublabel}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
