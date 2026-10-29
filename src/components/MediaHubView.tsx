import React, { useState } from 'react';
import { INITIAL_MEDIA } from '../data/initialData';
import { MediaItem } from '../types';
import { arabicAudio } from '../lib/audio';
import {
  Video,
  Music,
  Headphones,
  Play,
  Volume2,
  Clock,
  Sparkles,
} from 'lucide-react';

export const MediaHubView: React.FC = () => {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem>(INITIAL_MEDIA[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Lagu Edukasi', 'Video Percakapan', 'Nasyid Rohani'];

  const filteredMedia = INITIAL_MEDIA.filter(
    (m) => selectedCategory === 'all' || m.category === selectedCategory
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
            <Music className="w-4 h-4" />
            <span>Pustaka Multimedia Edukasi Arab</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Video Pembelajaran, Lagu & Nasyid
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Perkaya mufrodat dan pelafalan melalui visual animasi, lagu anak berima, dan nasyid penuh hikmah.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl overflow-x-auto max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-purple-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {cat === 'all' ? 'Semua Media' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Media Showcase (Video Player + Lyrics Split) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Video Player (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg border border-stone-200">
            <iframe
              src={selectedMedia.url}
              title={selectedMedia.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-700">
              <span>{selectedMedia.category}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {selectedMedia.duration || '03:00'}
              </span>
            </div>
            <h3 className="text-xl font-black text-stone-900">{selectedMedia.title}</h3>
            {selectedMedia.titleArabic && (
              <p className="font-arabic text-xl font-bold text-emerald-800">
                {selectedMedia.titleArabic}
              </p>
            )}
            <p className="text-xs text-stone-600 leading-relaxed pt-1">
              {selectedMedia.description}
            </p>
          </div>
        </div>

        {/* Right Lyrics & Text Panel (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-purple-600" />
              <h4 className="text-sm font-bold text-stone-900">
                Lirik Arab & Terjemahan
              </h4>
            </div>

            {selectedMedia.lyricsArabic && (
              <button
                onClick={() =>
                  arabicAudio.speakArabic(
                    selectedMedia.lyricsArabic?.replace(/\.\.\./g, '') || ''
                  )
                }
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Lafalkan</span>
              </button>
            )}
          </div>

          {selectedMedia.lyricsArabic ? (
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
              <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-xl space-y-2">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Teks Arab Berharakat:
                </span>
                <div className="font-arabic text-xl sm:text-2xl font-bold text-emerald-950 leading-loose text-right whitespace-pre-line">
                  {selectedMedia.lyricsArabic}
                </div>
              </div>

              {selectedMedia.lyricsTranslation && (
                <div className="p-4 bg-stone-50 border border-stone-200/80 rounded-xl space-y-2">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                    Terjemahan Bahasa Indonesia:
                  </span>
                  <div className="text-xs text-stone-700 leading-relaxed whitespace-pre-line font-medium">
                    {selectedMedia.lyricsTranslation}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-stone-400">
              Tidak ada teks lirik untuk media ini.
            </div>
          )}
        </div>
      </div>

      {/* Media Playlist Grid */}
      <div className="space-y-3 pt-6 border-t border-stone-200">
        <h3 className="text-base font-black text-stone-900">
          Koleksi Lagu & Video Pembelajaran Lainnya
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredMedia.map((media) => {
            const isPlaying = media.id === selectedMedia.id;
            return (
              <div
                key={media.id}
                onClick={() => setSelectedMedia(media)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isPlaying
                    ? 'bg-purple-50/80 border-purple-500 shadow-sm'
                    : 'bg-white border-stone-200 hover:border-purple-300 hover:bg-stone-50'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500">
                    <span className="text-purple-700">{media.category}</span>
                    <span>{media.duration}</span>
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 line-clamp-2">
                    {media.title}
                  </h4>
                  {media.titleArabic && (
                    <p className="font-arabic text-base font-bold text-emerald-800 truncate">
                      {media.titleArabic}
                    </p>
                  )}
                </div>

                <div className="pt-3 flex items-center justify-between text-xs font-bold text-purple-700">
                  <span className="flex items-center gap-1">
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isPlaying ? 'Sedang Diputar' : 'Putar Media'}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
