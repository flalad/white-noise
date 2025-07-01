'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface AnimatedSceneProps {
  onThemeToggle?: () => void;
}

export function AnimatedScene({ onThemeToggle }: AnimatedSceneProps) {
  const { toggleTheme, isDark } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleToggleMode = () => {
    toggleTheme();
    onThemeToggle?.();
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [isDark]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`backdrop-blur-sm rounded-xl shadow-sm border overflow-hidden h-full relative hover:shadow-md transition-all duration-300 flex flex-col ${
        isDark
          ? 'bg-slate-800/90 border-slate-600/30'
          : 'bg-white/90 border-white/30'
      }`}
      style={{ height: '100%' }}
    >
      {/* Header */}
      <div className={`p-3 border-b ${isDark ? 'border-slate-600/50' : 'border-gray-50'}`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>
            宁静时光
          </h3>
          <button
            onClick={handleToggleMode}
            className={`p-1.5 rounded-lg transition-all duration-500 ${
              !isDark
                ? 'bg-blue-50 text-blue-500 hover:bg-blue-100'
                : 'bg-purple-50 text-purple-500 hover:bg-purple-100'
            }`}
          >
            {!isDark ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Video Scene */}
      <div className="relative flex-1">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={!isDark ? '/rain.mp4' : '/rain_night.mp4'} type="video/mp4" />
          您的浏览器不支持视频播放
        </video>

        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-black/5"></div>

        {/* Mode indicator */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center">
            <p className="text-white text-xs font-medium">
              {!isDark ? '🌅 清晨雨声' : '🌙 夜雨绵绵'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}