import React, { useState } from 'react';
import { QURAN_STORIES, StoryGroup } from '../data/quranStoriesData';
import {
  BookOpen,
  Search,
  Sparkles,
  BookMarked,
  CheckCircle2,
  Copy,
  Check,
  ChevronRight,
  Bookmark,
  Info,
} from 'lucide-react';

interface QuranSurahStoriesViewProps {
  theme?: 'dark' | 'light';
}

export const QuranSurahStoriesView: React.FC<QuranSurahStoriesViewProps> = ({
  theme = 'dark',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStoryId, setSelectedStoryId] = useState<number | 'all'>('all');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [memorizedStories, setMemorizedStories] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('memorized_quran_stories_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const isDark = theme === 'dark';

  const toggleMemorized = (id: number) => {
    setMemorizedStories((prev) => {
      const next = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      localStorage.setItem('memorized_quran_stories_v1', JSON.stringify(next));
      return next;
    });
  };

  const handleCopyStory = (story: StoryGroup) => {
    const text = `${story.title} (${story.surahRange})\n\nKisah Kronologis:\n${story.narrative}\n\nUrutan Surah:\n` +
      story.surahs.map((s) => `${s.number}. ${s.keyword} – ${s.name}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedId(story.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter stories based on search query and category selection
  const filteredStories = QURAN_STORIES.filter((story) => {
    const matchesCategory =
      selectedStoryId === 'all' || story.id === selectedStoryId;

    if (!searchQuery.trim()) return matchesCategory;

    const query = searchQuery.toLowerCase().trim();
    const matchesTitle = story.title.toLowerCase().includes(query);
    const matchesNarrative = story.narrative.toLowerCase().includes(query);
    const matchesSurahs = story.surahs.some(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.keyword.toLowerCase().includes(query) ||
        s.number.toString() === query
    );

    return matchesCategory && (matchesTitle || matchesNarrative || matchesSurahs);
  });

  // Highlight keywords in story text
  const renderHighlightedNarrative = (story: StoryGroup) => {
    const text = story.narrative;
    const keywords = story.surahs.map((s) => s.keyword);

    // Sort keywords by length descending to match longer multi-word phrases first
    const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length);
    const escapedKeywords = sortedKeywords.map((k) =>
      k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );
    const regex = new RegExp(`(${escapedKeywords.join('|')})`, 'g');

    const parts = text.split(regex);

    return parts.map((part, idx) => {
      const isMatch = keywords.includes(part);
      if (isMatch) {
        return (
          <span
            key={idx}
            className={`font-black px-1.5 py-0.5 rounded-md text-xs sm:text-sm mx-0.5 inline-block ${
              isDark
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
            }`}
          >
            {part}
          </span>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-1 sm:px-4">
      {/* Header Banner */}
      <div
        className={`rounded-3xl p-6 sm:p-8 border shadow-xl backdrop-blur-md relative overflow-hidden transition-all ${
          isDark
            ? 'bg-slate-800/90 border-slate-700/60 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Metode Mnemonic 114 Surah Al-Qur'an</span>
            </div>

            <h1 className="text-xl sm:text-3xl font-black tracking-tight leading-tight">
              Metode Asosiasi Cerita Urutan <span className="text-emerald-500">Surat Al-Qur'an</span>
            </h1>

            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Gunakan 11 rangkaian alur cerita mnemonik di bawah ini untuk menghafal dan mengingat nomor serta urutan seluruh 114 Surah dalam Al-Qur'an secara mudah, cepat, dan menyenangkan.
            </p>
          </div>

          {/* Quick Stat Counter */}
          <div className="flex sm:flex-col items-center justify-between sm:justify-center p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 shrink-0 gap-2">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                {memorizedStories.length} / 11
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                Cerita Dihafal
              </div>
            </div>
            <div className="w-full bg-slate-700/50 h-2 rounded-full overflow-hidden hidden sm:block">
              <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${(memorizedStories.length / 11) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kata kunci cerita, nama surah, atau nomor surah (misal: SAPI BETINA, 18, Al-Kahf)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-2xl border focus:outline-none focus:border-emerald-500 shadow-sm ${
                isDark
                  ? 'bg-slate-800/90 border-slate-700/80 text-slate-100 placeholder-slate-500'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-xs text-slate-400 hover:text-slate-200"
              >
                Hapus
              </button>
            )}
          </div>

          {/* Quick Filter Reset */}
          {selectedStoryId !== 'all' && (
            <button
              onClick={() => setSelectedStoryId('all')}
              className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-all shrink-0"
            >
              Tampilkan Semua (11 Cerita)
            </button>
          )}
        </div>

        {/* Story Selector Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedStoryId('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedStoryId === 'all'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : isDark
                ? 'bg-slate-800/70 border border-slate-700/60 text-slate-400 hover:text-slate-200'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua Cerita (1-114)
          </button>

          {QURAN_STORIES.map((story) => {
            const isSelected = selectedStoryId === story.id;
            const isDone = memorizedStories.includes(story.id);

            return (
              <button
                key={story.id}
                onClick={() => setSelectedStoryId(story.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : isDone
                    ? isDark
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                      : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                    : isDark
                    ? 'bg-slate-800/70 border border-slate-700/60 text-slate-400 hover:text-slate-200'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{story.title}</span>
                {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stories Content Cards List */}
      <div className="space-y-6">
        {filteredStories.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/50 rounded-3xl border border-slate-700/50">
            <Info className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-300">Tidak ada cerita atau surah yang cocok</p>
            <p className="text-xs text-slate-500 mt-1">Coba gunakan kata kunci pencarian yang lain</p>
          </div>
        ) : (
          filteredStories.map((story) => {
            const isMemorized = memorizedStories.includes(story.id);
            const isCopied = copiedId === story.id;

            return (
              <div
                key={story.id}
                className={`rounded-3xl p-6 sm:p-7 border shadow-xl transition-all space-y-6 ${
                  isDark
                    ? 'bg-slate-800/90 border-slate-700/70 text-slate-100'
                    : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50'
                }`}
              >
                {/* Story Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/50 pb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shadow-md ${
                        isMemorized
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-indigo-600 text-white'
                      }`}
                    >
                      {story.id}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-black">{story.title}</h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-700/50 border border-slate-600/50 text-[11px] text-slate-300 font-bold">
                          {story.surahRange}
                        </span>
                      </div>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Mnemonic Asosiasi kata kunci Surah ke-{story.surahs[0].number} s.d. Surah ke-{story.surahs[story.surahs.length - 1].number}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 self-start sm:self-auto">
                    <button
                      onClick={() => handleCopyStory(story)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center space-x-1.5 ${
                        isCopied
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : isDark
                          ? 'bg-slate-700/60 hover:bg-slate-700 border-slate-600 text-slate-300'
                          : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                      }`}
                      title="Salin Teks Cerita"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Tersalin!' : 'Salin Cerita'}</span>
                    </button>

                    <button
                      onClick={() => toggleMemorized(story.id)}
                      className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center space-x-1.5 ${
                        isMemorized
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                          : isDark
                          ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-emerald-400'
                          : 'bg-slate-50 border-slate-300 text-slate-600 hover:text-emerald-600'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isMemorized ? 'Sudah Dihafal' : 'Tandai Dihafal'}</span>
                    </button>
                  </div>
                </div>

                {/* Narrative Text Section */}
                <div
                  className={`p-5 rounded-2xl border space-y-2 transition-all ${
                    isDark
                      ? 'bg-slate-900/80 border-slate-700/60 text-slate-200'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold mb-1">
                    <BookOpen className="w-4 h-4" />
                    <span>Narasikan Cerita Berikut dalam Pikiran Anda:</span>
                  </div>

                  <p className="text-sm sm:text-base leading-relaxed tracking-wide font-medium">
                    {renderHighlightedNarrative(story)}
                  </p>
                </div>

                {/* Chronological Table List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <span>No. Kronologi Cerita & Nama Surah</span>
                    <span className="text-[10px] text-slate-500">({story.surahs.length} Surah)</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {story.surahs.map((surah) => (
                      <div
                        key={surah.number}
                        className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                          isDark
                            ? 'bg-slate-900/60 border-slate-700/40 hover:border-emerald-500/50'
                            : 'bg-slate-50 border-slate-200 hover:border-emerald-400'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-7 h-7 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 text-xs font-extrabold flex items-center justify-center shrink-0">
                            {surah.number}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-emerald-400">
                              {surah.keyword}
                            </div>
                            <div className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                              {surah.name}
                            </div>
                          </div>
                        </div>

                        {surah.arabicName && (
                          <div className="text-base font-bold text-slate-400 font-serif">
                            {surah.arabicName}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
