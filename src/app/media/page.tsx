"use client";

import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { mediaData } from "@/data/zkevm-tracker";
import playlistData from "@/data/youtube-playlist.json";
import { ExternalLink, ChevronDown } from "lucide-react";

// Keep the element type stable when the generated JSON contains an empty array.
type PlaylistVideo = {
  title: string;
  videoId: string;
  url: string;
  date: string;
  author: string;
};

const playlistVideos: PlaylistVideo[] = playlistData.videos;

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

const allMedia = [
  ...mediaData.map((item) => ({
    title: item.title,
    url: item.url,
    date: item.date,
    type: item.type === 'talk' ? 'Talk' : item.type === 'podcast' ? 'Podcast' : item.type === 'blog-external' ? 'Article' : 'Video',
    event: item.event,
    speaker: item.speaker,
  })),
  ...playlistVideos.map((video) => ({
    title: video.title,
    url: video.url,
    date: video.date,
    type: 'Breakout Call',
    event: 'L1-zkEVM Breakout',
    speaker: undefined,
  })),
].sort((a, b) => b.date.localeCompare(a.date));

const types = ['All', ...Array.from(new Set(allMedia.map((m) => m.type)))];

export default function MediaPage() {
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? allMedia : allMedia.filter((m) => m.type === filter);

  return (
    <PageLayout
      title="Media"
      description="Talks, presentations, and external content from the zkVM team."
    >
      {/* Filter */}
      <div className="flex items-center justify-end mb-10">
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none bg-transparent border border-border rounded px-4 py-2 pr-8 text-sm text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--accent-blue)]"
          >
            {types.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Thumbnail grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((item, i) => {
          const videoId = getYouTubeId(item.url);
          return (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video rounded-lg overflow-hidden mb-3 bg-muted">
                {videoId ? (
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                )}
                {/* Type tag */}
                <span className="absolute top-2 left-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-black/60 text-white">
                  {item.type}
                </span>
                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent-orange)' }}>
                    <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
              </div>

              {/* Info */}
              <span className="text-sm text-muted-foreground">{item.date}{item.event && ` · ${item.event}`}</span>
              <h3 className="text-base font-semibold text-foreground group-hover:text-[var(--accent-orange)] transition-colors mt-1 line-clamp-2">
                {item.title}
              </h3>
              {item.speaker && (
                <span className="text-sm text-muted-foreground mt-1 block">{item.speaker}</span>
              )}
            </a>
          );
        })}
      </div>
    </PageLayout>
  );
}
