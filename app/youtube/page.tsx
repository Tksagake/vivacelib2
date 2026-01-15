"use client";

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Search, Play, Clock, User, Filter, Grid3X3, List, X } from 'lucide-react';

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY as string;

type YouTubeVideo = {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      medium: {
        url: string;
      };
      high: {
        url: string;
      };
    };
  };
};

export default function YouTubePage() {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [recommendedVideos, setRecommendedVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const searchYouTube = async () => {
    if (!query.trim()) return;

    setLoading(true);
    const musicQuery = `${query} music tutorial`;

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=12&q=${encodeURIComponent(
        musicQuery
      )}&key=${API_KEY}`
    );

    const data = await response.json();
    setVideos(data.items || []);
    setLoading(false);
  };

  const fetchRecommendedVideos = async () => {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=6&q=music%20lessons%20ABRSM&key=${API_KEY}`
    );

    const data = await response.json();
    setRecommendedVideos(data.items || []);
  };

  useEffect(() => {
    fetchRecommendedVideos();
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchYouTube();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const VideoCard = ({ video, featured = false }: { video: YouTubeVideo; featured?: boolean }) => (
    <div
      className={`group bg-white rounded-xl border border-[var(--neutral-200)] overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer ${
        featured ? 'md:col-span-2' : ''
      }`}
      onClick={() => setSelectedVideo(video)}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium.url}
          alt={video.snippet.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all">
            <Play size={24} className="text-[var(--primary-700)] ml-1" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-[var(--primary-900)] line-clamp-2 mb-2 group-hover:text-[var(--primary-700)] transition-colors">
          {video.snippet.title}
        </h3>
        <div className="flex items-center gap-3 text-sm text-[var(--neutral-500)]">
          <div className="flex items-center gap-1.5">
            <User size={14} />
            <span className="line-clamp-1">{video.snippet.channelTitle}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            <span>{formatDate(video.snippet.publishedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-5xl overflow-hidden">
            <div className="relative aspect-video bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.id.videoId}?autoplay=1`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={selectedVideo.snippet.title}
              />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-[var(--primary-900)] mb-2">
                    {selectedVideo.snippet.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-[var(--neutral-500)]">
                    <div className="flex items-center gap-1.5">
                      <User size={16} />
                      <span>{selectedVideo.snippet.channelTitle}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={16} />
                      <span>{formatDate(selectedVideo.snippet.publishedAt)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="p-2 hover:bg-[var(--neutral-100)] rounded-lg transition-colors"
                >
                  <X size={24} className="text-[var(--neutral-600)]" />
                </button>
              </div>
              {selectedVideo.snippet.description && (
                <p className="mt-4 text-sm text-[var(--neutral-600)] line-clamp-3">
                  {selectedVideo.snippet.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-br from-[var(--primary-800)] to-[var(--primary-900)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Video Lessons</h1>
            <p className="text-lg text-white/80 mb-8">
              Explore our curated collection of music tutorials and masterclasses from expert instructors.
            </p>

            {/* Search Bar */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={20} className="text-[var(--neutral-400)]" />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="w-full pl-12 pr-4 py-4 bg-white text-[var(--neutral-900)] rounded-xl placeholder-[var(--neutral-400)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-500)]"
                  placeholder="Search for piano lessons, music theory, ABRSM preparation..."
                />
              </div>
              <button
                onClick={searchYouTube}
                className="px-8 py-4 bg-[var(--accent-500)] hover:bg-[var(--accent-600)] text-white font-semibold rounded-xl transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[var(--primary-200)] border-t-[var(--primary-600)] rounded-full animate-spin"></div>
            <p className="mt-4 text-[var(--neutral-600)]">Searching for videos...</p>
          </div>
        ) : videos.length > 0 ? (
          <div className="space-y-8">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[var(--primary-900)]">Search Results</h2>
                <p className="text-[var(--neutral-500)]">{videos.length} videos found</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-[var(--primary-100)] text-[var(--primary-700)]' 
                      : 'text-[var(--neutral-500)] hover:bg-[var(--neutral-100)]'
                  }`}
                >
                  <Grid3X3 size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-[var(--primary-100)] text-[var(--primary-700)]' 
                      : 'text-[var(--neutral-500)] hover:bg-[var(--neutral-100)]'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>

            {/* Video Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {videos.map((video) => (
                <VideoCard key={video.id.videoId} video={video} />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Section */}
            {recommendedVideos.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-[var(--primary-900)]">Recommended for You</h2>
                    <p className="text-[var(--neutral-500)]">Curated lessons to enhance your musical journey</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendedVideos.map((video, index) => (
                    <VideoCard key={video.id.videoId} video={video} featured={index === 0} />
                  ))}
                </div>
              </section>
            )}

            {/* Categories */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--primary-900)] mb-6">Browse by Category</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { name: 'Piano', emoji: '🎹' },
                  { name: 'Guitar', emoji: '🎸' },
                  { name: 'Violin', emoji: '🎻' },
                  { name: 'Music Theory', emoji: '📚' },
                  { name: 'ABRSM Prep', emoji: '🎓' },
                  { name: 'Singing', emoji: '🎤' },
                ].map((category) => (
                  <button
                    key={category.name}
                    onClick={() => {
                      setQuery(category.name);
                      searchYouTube();
                    }}
                    className="flex flex-col items-center gap-2 p-6 bg-white border border-[var(--neutral-200)] rounded-xl hover:border-[var(--primary-300)] hover:shadow-md transition-all"
                  >
                    <span className="text-3xl">{category.emoji}</span>
                    <span className="font-medium text-[var(--primary-900)]">{category.name}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
