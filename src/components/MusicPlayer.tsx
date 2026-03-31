import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const TRACKS = [
  {
    id: 1,
    title: 'Neon Gaming',
    artist: 'AI Synth',
    url: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3',
    color: 'text-pink-500',
    glow: 'shadow-[0_0_15px_rgba(236,72,153,0.5)]',
  },
  {
    id: 2,
    title: 'Cyberpunk City',
    artist: 'AI Synth',
    url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_c8b81755eb.mp3',
    color: 'text-cyan-400',
    glow: 'shadow-[0_0_15px_rgba(34,211,238,0.5)]',
  },
  {
    id: 3,
    title: 'Retro Synthwave',
    artist: 'AI Synth',
    url: 'https://cdn.pixabay.com/audio/2021/11/25/audio_91b3cb0024.mp3',
    color: 'text-purple-500',
    glow: 'shadow-[0_0_15px_rgba(168,85,247,0.5)]',
  },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnded = () => {
    nextTrack();
  };

  return (
    <div className="flex flex-col w-full max-w-md p-6 bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-800 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 tracking-wider">
          <Music className={cn("w-5 h-5", currentTrack.color)} />
          NEON BEATS
        </h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className={cn(
          "w-16 h-16 rounded-lg flex items-center justify-center bg-gray-800 border border-gray-700 transition-all duration-500",
          isPlaying ? currentTrack.glow : ""
        )}>
          <Music className={cn("w-8 h-8", currentTrack.color)} />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className={cn("text-lg font-bold truncate transition-colors duration-300", currentTrack.color)}>
            {currentTrack.title}
          </h3>
          <p className="text-sm text-gray-400 truncate">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="w-full h-1.5 bg-gray-800 rounded-full mb-6 overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-100 ease-linear", currentTrack.color.replace('text-', 'bg-'))}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-center gap-6">
        <button 
          onClick={prevTrack}
          className="p-2 text-gray-400 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all"
        >
          <SkipBack className="w-6 h-6" />
        </button>
        <button 
          onClick={togglePlay}
          className={cn(
            "p-4 rounded-full bg-gray-800 text-white transition-all hover:scale-105",
            isPlaying ? currentTrack.glow : "hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          )}
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
        </button>
        <button 
          onClick={nextTrack}
          className="p-2 text-gray-400 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all"
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      <div className="mt-6 space-y-2">
        {TRACKS.map((track, index) => (
          <button
            key={track.id}
            onClick={() => {
              setCurrentTrackIndex(index);
              setIsPlaying(true);
            }}
            className={cn(
              "w-full flex items-center gap-3 p-2 rounded-md transition-colors text-left",
              currentTrackIndex === index 
                ? "bg-gray-800/50 border border-gray-700" 
                : "hover:bg-gray-800/30 border border-transparent"
            )}
          >
            <span className={cn(
              "text-xs font-mono w-4",
              currentTrackIndex === index ? track.color : "text-gray-500"
            )}>
              {isPlaying && currentTrackIndex === index ? 'â¶' : index + 1}
            </span>
            <span className={cn(
              "text-sm flex-1 truncate",
              currentTrackIndex === index ? "text-white font-medium" : "text-gray-400"
            )}>
              {track.title}
            </span>
          </button>
        ))}
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />
    </div>
  );
}
