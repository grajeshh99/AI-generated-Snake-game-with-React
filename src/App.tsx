import React from 'react';
import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 md:p-8 font-sans relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[50%] translate-x-[-50%] w-[30%] h-[30%] rounded-full bg-green-600/10 blur-[100px] pointer-events-none" />

      <header className="mb-8 md:mb-12 text-center z-10">
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] tracking-tighter">
          NEON ARCADE
        </h1>
        <p className="text-gray-400 mt-2 font-mono tracking-widest text-sm uppercase">
          Synthwave & Snake
        </p>
      </header>

      <main className="flex flex-col xl:flex-row items-center justify-center gap-8 xl:gap-16 w-full max-w-6xl z-10">
        <div className="w-full max-w-md flex justify-center order-2 xl:order-1">
          <MusicPlayer />
        </div>
        
        <div className="flex justify-center order-1 xl:order-2">
          <SnakeGame />
        </div>
      </main>

      <footer className="mt-12 text-gray-600 font-mono text-xs z-10">
        &copy; {new Date().getFullYear()} Neon Arcade. Play to the beat.
      </footer>
    </div>
  );
}
