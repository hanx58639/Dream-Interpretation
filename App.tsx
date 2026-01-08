
import React, { useState, useEffect, useRef } from 'react';
import DreamRecorder from './components/DreamRecorder';
import DreamAnalysis from './components/DreamAnalysis';
import { DreamRecord, DreamTag, Perspective } from './types';
import { ICONS } from './constants';

const App: React.FC = () => {
  const [currentDream, setCurrentDream] = useState<DreamRecord | null>(null);
  const [stars, setStars] = useState<{ id: number; top: number; left: number; size: number; duration: number }[]>([]);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 生成梦幻星星
    const newStars = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 5 + 3,
    }));
    setStars(newStars);
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Music play blocked by browser"));
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  const handleSaveDream = (content: string, tags: DreamTag[], perspectives: Perspective[]) => {
    const record: DreamRecord = {
      id: Date.now().toString(),
      content,
      tags,
      perspectives,
      timestamp: Date.now(),
    };
    setCurrentDream(record);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center">
      <audio 
        ref={audioRef} 
        loop 
        src="https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3" 
      />

      {stars.map(star => (
        <div
          key={star.id}
          className="star"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            '--duration': `${star.duration}s`
          } as any}
        />
      ))}

      <button 
        onClick={toggleMusic}
        className={`fixed bottom-8 right-8 z-50 p-4 rounded-full transition-all duration-500 shadow-2xl ${
          isMusicPlaying ? 'bg-indigo-500 scale-110' : 'bg-slate-700 opacity-60 hover:opacity-100'
        }`}
      >
        <span className="text-xl">{isMusicPlaying ? '🎵' : '🔇'}</span>
      </button>

      <header className="w-full max-w-4xl px-6 py-12 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 breathe">
            <ICONS.Moon />
          </div>
          <div>
            <h1 className="text-4xl font-dreamy text-white tracking-wider">梦境织者</h1>
            <p className="text-purple-300/80 text-sm font-soft italic">在温暖的星光中，遇见潜意识的自己</p>
          </div>
        </div>
      </header>

      <main className="w-full max-w-4xl px-6 pb-24 z-10">
        {!currentDream ? (
          <div className="dreamy-glass p-10 md:p-14 transition-all hover:shadow-[0_0_50px_rgba(167,139,250,0.1)]">
            <DreamRecorder onSave={handleSaveDream} />
          </div>
        ) : (
          <div className="space-y-6">
            <DreamAnalysis 
              dreamContent={currentDream.content}
              tags={currentDream.tags}
              perspectives={currentDream.perspectives}
              onReset={() => setCurrentDream(null)}
            />
          </div>
        )}
      </main>

      <footer className="w-full max-w-4xl px-6 py-10 flex items-center justify-between opacity-30 text-xs font-soft z-10 border-t border-white/5">
        <p>© 2024 梦境织者 · 温暖守护每一场梦</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-purple-300">隐私守护</a>
          <a href="#" className="hover:text-purple-300">灵感来源</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
