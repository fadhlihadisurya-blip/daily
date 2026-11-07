import React, { useState } from 'react';
import { ExerciseLog, ExerciseSet } from '../types';
import { Dumbbell, Plus, Trash2, Trophy, Flame, Play, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExerciseSectionProps {
  exercises: ExerciseLog[];
  onUpdateExercises: (updated: ExerciseLog[]) => void;
}

export const ExerciseSection: React.FC<ExerciseSectionProps> = ({
  exercises,
  onUpdateExercises,
}) => {
  const [activeType, setActiveType] = useState<'push_up' | 'pull_up' | 'squat'>('push_up');

  // Find or create current exercise type log
  const currentExercise = exercises.find((e) => e.type === activeType) || {
    id: `ex_${activeType}`,
    type: activeType,
    title: activeType === 'push_up' ? 'Push-Up' : activeType === 'pull_up' ? 'Pull-Up' : 'Squat',
    sets: [],
    totalReps: 0,
    unit: 'reps' as const,
  };

  const handleAddSet = (repsCount: number = 15) => {
    const existingSets = currentExercise.sets || [];
    const nextSetNum = existingSets.length + 1;
    const newSet: ExerciseSet = {
      id: `set_${Date.now()}_${Math.random()}`,
      setNumber: nextSetNum,
      reps: repsCount,
    };

    const updatedSets = [...existingSets, newSet];
    const newTotal = updatedSets.reduce((sum, s) => sum + s.reps, 0);

    const updatedExercise: ExerciseLog = {
      ...currentExercise,
      sets: updatedSets,
      totalReps: newTotal,
    };

    const otherExercises = exercises.filter((e) => e.type !== activeType);
    onUpdateExercises([...otherExercises, updatedExercise]);

    // Celebrate high set achievements!
    if (newTotal >= 50 && activeType === 'push_up') {
      confetti({ particleCount: 50, spread: 50 });
    }
  };

  const handleUpdateSetReps = (setId: string, reps: number) => {
    const validReps = Math.max(0, reps);
    const updatedSets = currentExercise.sets.map((s) =>
      s.id === setId ? { ...s, reps: validReps } : s
    );

    const newTotal = updatedSets.reduce((sum, s) => sum + s.reps, 0);
    const updatedExercise: ExerciseLog = {
      ...currentExercise,
      sets: updatedSets,
      totalReps: newTotal,
    };

    const otherExercises = exercises.filter((e) => e.type !== activeType);
    onUpdateExercises([...otherExercises, updatedExercise]);
  };

  const handleDeleteSet = (setId: string) => {
    const updatedSets = currentExercise.sets
      .filter((s) => s.id !== setId)
      .map((s, idx) => ({ ...s, setNumber: idx + 1 }));

    const newTotal = updatedSets.reduce((sum, s) => sum + s.reps, 0);
    const updatedExercise: ExerciseLog = {
      ...currentExercise,
      sets: updatedSets,
      totalReps: newTotal,
    };

    const otherExercises = exercises.filter((e) => e.type !== activeType);
    onUpdateExercises([...otherExercises, updatedExercise]);
  };

  const pushUpLog = exercises.find((e) => e.type === 'push_up');
  const pullUpLog = exercises.find((e) => e.type === 'pull_up');

  return (
    <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/60 shadow-xl backdrop-blur-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700/60">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Olahraga Harian (Push-up & Pull-up)
            </h3>
            <p className="text-xs text-slate-400">
              Pencatatan repetisi & set latihan fisik harian
            </p>
          </div>
        </div>

        {/* Exercise Switcher Tabs */}
        <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveType('push_up')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeType === 'push_up'
                ? 'bg-rose-500 text-slate-950 font-bold shadow-md shadow-rose-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Push-Up ({pushUpLog?.totalReps || 0})
          </button>
          <button
            onClick={() => setActiveType('pull_up')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeType === 'pull_up'
                ? 'bg-rose-500 text-slate-950 font-bold shadow-md shadow-rose-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pull-Up ({pullUpLog?.totalReps || 0})
          </button>
          <button
            onClick={() => setActiveType('squat')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeType === 'squat'
                ? 'bg-rose-500 text-slate-950 font-bold shadow-md shadow-rose-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Squat
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Column: Quick Stats & Preset Buttons */}
        <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-700/60 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
              {currentExercise.title} Total Volume
            </span>
            <div className="text-3xl font-black text-slate-100 mt-1 flex items-baseline gap-2">
              <span>{currentExercise.totalReps}</span>
              <span className="text-xs text-slate-400 font-normal">Repetisi Total</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {currentExercise.sets?.length || 0} Set telah diselesaikan hari ini.
            </p>
          </div>

          {/* Quick Add Presets */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-[11px] font-semibold text-slate-300 block">
              + Tambah Set Cepat:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleAddSet(activeType === 'pull_up' ? 5 : 10)}
                className="py-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-rose-300 text-xs font-bold border border-slate-700 transition-colors"
              >
                +{activeType === 'pull_up' ? 5 : 10} Reps
              </button>
              <button
                onClick={() => handleAddSet(activeType === 'pull_up' ? 8 : 15)}
                className="py-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-rose-300 text-xs font-bold border border-slate-700 transition-colors"
              >
                +{activeType === 'pull_up' ? 8 : 15} Reps
              </button>
              <button
                onClick={() => handleAddSet(activeType === 'pull_up' ? 10 : 20)}
                className="py-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-rose-300 text-xs font-bold border border-slate-700 transition-colors"
              >
                +{activeType === 'pull_up' ? 10 : 20} Reps
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Sets Table / List */}
        <div className="md:col-span-2 bg-slate-900/70 p-4 rounded-xl border border-slate-700/60 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-200">
              Daftar Set {currentExercise.title}
            </h4>
            <button
              onClick={() => handleAddSet(activeType === 'pull_up' ? 8 : 15)}
              className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-rose-500 hover:bg-rose-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-rose-500/20"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Tambah Set</span>
            </button>
          </div>

          {currentExercise.sets.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-slate-700 rounded-xl">
              <Dumbbell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">
                Belum ada set {currentExercise.title} yang dicatat.
              </p>
              <button
                onClick={() => handleAddSet(activeType === 'pull_up' ? 8 : 15)}
                className="mt-2 text-xs text-rose-400 font-bold hover:underline"
              >
                + Catat Set Pertama
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {currentExercise.sets.map((setItem) => (
                <div
                  key={setItem.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700/70"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 text-xs font-bold flex items-center justify-center border border-rose-500/30">
                      S{setItem.setNumber}
                    </span>
                    <span className="text-xs font-semibold text-slate-200">
                      Set #{setItem.setNumber}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-700">
                      <input
                        type="number"
                        min="1"
                        value={setItem.reps}
                        onChange={(e) =>
                          handleUpdateSetReps(
                            setItem.id,
                            parseInt(e.target.value, 10) || 0
                          )
                        }
                        className="w-12 bg-transparent text-center text-xs font-bold text-rose-400 focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-400">Reps</span>
                    </div>

                    <button
                      onClick={() => handleDeleteSet(setItem.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Hapus Set"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
