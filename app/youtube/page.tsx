"use client";

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar'; // Adjust the path as necessary

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY as string;

export default function YouTubePage() {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [recommendedVideos, setRecommendedVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

  const searchYouTube = async () => {
    if (!query.trim()) return;

    setLoading(true);

    // Append music-related keywords to the search query
    const musicQuery = `${query} music tutorial`;

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${encodeURIComponent(
        musicQuery
      )}&key=${API_KEY}`
    );

    const data = await response.json();
    setVideos(data.items || []);
    setLoading(false);
  };

  const fetchRecommendedVideos = async () => {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=3&q=music%20lessons&key=${API_KEY}`
    );

    const data = await response.json();
    setRecommendedVideos(data.items || []);
  };

  useEffect(() => {
    fetchRecommendedVideos();
  }, []);

  type YouTubeVideo = {
    id: {
      videoId: string;
    };
    snippet: {
      title: string;
      channelTitle: string;
      thumbnails: {
        medium: {
          url: string;
        };
      };
    };
  };

  return (
    <div className="min-h-screen bg-white p-6 text-black">
      {/* Import and use the Navbar component */}
      <Navbar />

      <h1 className="text-3xl font-bold text-center text-cyan-800 mb-6">📺 YouTube Music Classes</h1>

      <div className="flex justify-center gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-3 rounded w-full max-w-md border-cyan-300 focus:ring-2 focus:ring-cyan-500"
          placeholder="Search for music classes..."
        />
        <button
          onClick={searchYouTube}
          className="bg-cyan-600 text-white p-3 rounded hover:bg-cyan-700"
        >
          Search
        </button>
      </div>

      {loading && (
        <div className="text-center mt-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-cyan-600">Loading...</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {videos.map((video) => (
          <div
            key={video.id.videoId}
            className={`bg-gradient-to-br from-cyan-100 to-white text-cyan-800 p-4 rounded-lg shadow-lg transform transition ${
              selectedVideo?.id.videoId === video.id.videoId ? 'scale-105 col-span-3' : 'hover:scale-105'
            }`}
            onClick={() => setSelectedVideo(video)}
          >
            <div className="aspect-w-16 aspect-h-9 mb-2">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${video.id.videoId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="YouTube video player"
                className="rounded"
              ></iframe>
            </div>
            <h3 className="font-bold text-lg">{video.snippet.title}</h3>
            <p className="text-sm opacity-80">🎙️ {video.snippet.channelTitle}</p>
          </div>
        ))}
      </div>

      {/* Recommended Videos Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-center text-cyan-800 mb-4">Recommended Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedVideos.map((video) => (
            <div
              key={video.id.videoId}
              className={`bg-gradient-to-br from-cyan-100 to-white text-cyan-800 p-4 rounded-lg shadow-lg transform transition ${
                selectedVideo?.id.videoId === video.id.videoId ? 'scale-105 col-span-3' : 'hover:scale-105'
              }`}
              onClick={() => setSelectedVideo(video)}
            >
              <div className="aspect-w-16 aspect-h-9 mb-2">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${video.id.videoId}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="YouTube video player"
                  className="rounded"
                ></iframe>
              </div>
              <h3 className="font-bold text-lg">{video.snippet.title}</h3>
              <p className="text-sm opacity-80">🎙️ {video.snippet.channelTitle}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
