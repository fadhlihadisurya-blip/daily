import React, { useState, useEffect } from 'react';
import { ReminderConfig } from '../types';
import { Bell, Plus, Trash2, Volume2, CheckCircle, ShieldAlert, Sparkles, Clock } from 'lucide-react';
import { playNotificationChime } from '../utils/audio';

interface ReminderViewProps {
  reminders: ReminderConfig[];
  onUpdateReminders: (updated: ReminderConfig[]) => void;
}

export const ReminderView: React.FC<ReminderViewProps> = ({
  reminders,
  onUpdateReminders,
}) => {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('08:00');
  const [category, setCategory] = useState<ReminderConfig['category']>('shalat');
  const [sound, setSound] = useState(true);

  useEffect(() => {
    if (typeof Notification !== 'undefined') {
      setPermission(Notification.permission);
    }
  }, []);

  const handleRequestPermission = async () => {
    if (typeof Notification === 'undefined') {
      alert('Browser Anda tidak mendukung Web Notification API.');
      return;
    }

    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      if (res === 'granted') {
        playNotificationChime();
        new Notification('✅ Notifikasi Berhasil Diaktifkan!', {
          body: "Pengingat shalat sunnah dan rutinitas harian Anda siap mendampingi istiqomah.",
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleTestNotification = () => {
    playNotificationChime();
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification('⏰ Uji Pengingat Mutaba\'ah', {
        body: 'Waktunya Shalat Sunnah / Murajaah Harian! Tetap semangat istiqomah.',
      });
    } else {
      alert('Pengingat suara dibunyikan! Aktifkan izin notifikasi browser untuk menerima notifikasi pop-up.');
    }
  };

  const handleToggleReminder = (id: string) => {
    const updated = reminders.map((r) =>
      r.id === id ? { ...r, enabled: !r.enabled } : r
    );
    onUpdateReminders(updated);
  };

  const handleDeleteReminder = (id: string) => {
    const updated = reminders.filter((r) => r.id !== id);
    onUpdateReminders(updated);
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newReminder: ReminderConfig = {
      id: `rem_${Date.now()}`,
      title: title.trim(),
      time,
      enabled: true,
      category,
      days: [],
      sound,
    };

    onUpdateReminders([...reminders, newReminder]);
    setTitle('');
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Browser Notification Status Banner */}
      <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
            <Bell className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Sistem Pengingat & Alarm Routine
              {permission === 'granted' ? (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Notifikasi Aktif
                </span>
              ) : (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> Perlu Izin Browser
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Dapatkan pengingat tepat waktu untuk Shalat Tahajjud, Dhuha, Murajaah, & Olahraga
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {permission !== 'granted' && (
            <button
              onClick={handleRequestPermission}
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 transition-all"
            >
              Aktifkan Notifikasi
            </button>
          )}

          <button
            onClick={handleTestNotification}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold border border-slate-600 transition-colors"
          >
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <span>Uji Suara & Notifikasi</span>
          </button>
        </div>
      </div>

      {/* Reminders List Header */}
      <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              Jadwal Pengingat Harian Anda ({reminders.length})
            </h3>
            <p className="text-xs text-slate-400">
              Atur waktu dan aktifkan pengingat yang sesuai dengan rutinitas harian
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Tambah Jadwal</span>
          </button>
        </div>

        {/* Add Reminder Form */}
        {showForm && (
          <form
            onSubmit={handleAddReminder}
            className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40 space-y-3"
          >
            <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Buat Pengingat Rutinitas Baru
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Nama Pengingat / Aktivitas
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Shalat Dhuha & Zikir, Push-up 30 Reps..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Jam Pengingat (HH:MM)
                </label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="shalat">Shalat Sunnah</option>
                  <option value="murajaah">Murajaah Qur'an</option>
                  <option value="buku">Membaca Buku</option>
                  <option value="olahraga">Olahraga</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 pt-5">
                <input
                  type="checkbox"
                  id="sound_toggle"
                  checked={sound}
                  onChange={(e) => setSound(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-800 border-slate-700"
                />
                <label htmlFor="sound_toggle" className="text-xs font-medium text-slate-200">
                  Bunyikan Nada Suara (Chime)
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20"
              >
                Simpan Pengingat
              </button>
            </div>
          </form>
        )}

        {/* Reminders List */}
        <div className="space-y-2.5">
          {reminders.map((rem) => (
            <div
              key={rem.id}
              className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                rem.enabled
                  ? 'bg-slate-900/80 border-slate-700'
                  : 'bg-slate-900/30 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <div className="text-lg font-black text-emerald-400 font-mono bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                  {rem.time}
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-100">
                    {rem.title}
                  </h4>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                    <span className="capitalize px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                      {rem.category}
                    </span>
                    {rem.sound && (
                      <span className="flex items-center gap-1 text-teal-400">
                        <Volume2 className="w-3 h-3" /> Suara Aktif
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Toggle Switch */}
                <button
                  onClick={() => handleToggleReminder(rem.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    rem.enabled ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      rem.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>

                <button
                  onClick={() => handleDeleteReminder(rem.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Hapus Pengingat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
